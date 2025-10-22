import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { CONTRACT_CONFIG, GOAL_STATUS, TRANSACTION_TYPE } from '../config/contract';
import { createPublicClient, http, formatEther } from 'viem';
import { celoAlfajores } from 'viem/chains';
import { ethers, BrowserProvider, JsonRpcProvider } from 'ethers';
import toast from 'react-hot-toast';

// Create public client outside the hook to prevent recreation
const publicClient = createPublicClient({
  chain: celoAlfajores,
  transport: http('https://alfajores-forno.celo-testnet.org')
});

export const useContract = () => {
  const { address: account, isConnected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [goals, setGoals] = useState([]);
  const [goalCount, setGoalCount] = useState(0);

  console.log('useContract hook initialized:', { account, isConnected });
  console.log('useContract current state:', { isLoading, goalsLength: goals.length, goalCount });

  // Helper function to convert contract goal to frontend format
  const convertContractGoal = (contractGoal, goalId) => {
    return {
      id: goalId.toString(),
      title: contractGoal.name, // Contract uses 'name' not 'title'
      description: contractGoal.description,
      targetAmount: parseFloat(formatEther(contractGoal.targetAmount)),
      currentAmount: parseFloat(formatEther(contractGoal.currentAmount)),
      deadline: new Date(Number(contractGoal.deadline) * 1000),
      status: Object.keys(GOAL_STATUS)[contractGoal.status],
      category: contractGoal.category,
      owner: contractGoal.owner,
      createdAt: new Date(Number(contractGoal.createdAt) * 1000),
      progress: contractGoal.targetAmount > 0 ? 
        (Number(contractGoal.currentAmount) / Number(contractGoal.targetAmount)) * 100 : 0,
      milestones: [], // Will be fetched separately
      transactions: [] // Will be fetched separately
    };
  };

  // Fetch goals from contract with proper error handling
  const fetchGoals = useCallback(async () => {
    console.log('fetchGoals called:', { isConnected, account });
    
    if (!isConnected || !account) {
      console.log('Not connected or no account, setting empty goals');
      setGoals([]);
      setGoalCount(0);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Fetching goals from contract...');
      
      // Get goal IDs for the user with timeout
      const goalIds = await Promise.race([
        publicClient.readContract({
          address: CONTRACT_CONFIG.address,
          abi: CONTRACT_CONFIG.abi,
          functionName: 'getUserGoals',
          args: [account]
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Contract call timeout')), 10000)
        )
      ]);

      console.log('Found goal IDs:', goalIds);

      // If no goals found, set empty array
      if (!goalIds || goalIds.length === 0) {
        console.log('No goals found for user');
        setGoals([]);
        setGoalCount(0);
        return;
      }

      // Fetch each goal's details
      const goalsData = await Promise.all(
        goalIds.map(async (goalId) => {
          try {
            const goalData = await publicClient.readContract({
              address: CONTRACT_CONFIG.address,
              abi: CONTRACT_CONFIG.abi,
              functionName: 'getGoal',
              args: [goalId]
            });
            return convertContractGoal(goalData, goalId);
          } catch (error) {
            console.error(`Error fetching goal ${goalId}:`, error);
            return null;
          }
        })
      );

      // Filter out null results
      const validGoals = goalsData.filter(goal => goal !== null);
      console.log('Fetched goals:', validGoals);
      setGoals(validGoals);
      setGoalCount(validGoals.length);
    } catch (error) {
      console.error('Error fetching goals:', error);
      // Set empty array on error
      setGoals([]);
      setGoalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, account]);

  // Create a new goal using ethereum provider
  const createGoal = async (goalData) => {
    console.log('createGoal called with:', goalData);
    console.log('isConnected:', isConnected, 'account:', account);
    
    if (!isConnected || !account) {
      toast.error('Please connect your wallet');
      return null;
    }

    try {
      setIsLoading(true);
      console.log('Starting goal creation on blockchain...');
      
      // Use ethers.js for transactions
      const provider = new BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_CONFIG.address,
        CONTRACT_CONFIG.abi,
        signer
      );

      console.log('Calling createGoal on contract...');
      const tx = await contract.createGoal(
        goalData.title, // This will be stored as 'name' in the contract
        goalData.description,
        ethers.parseEther(goalData.targetAmount.toString()),
        Math.floor(goalData.deadline.getTime() / 1000),
        goalData.category || 'Other'
      );

      console.log('Transaction sent:', tx.hash);
      toast.success('Transaction sent! Waiting for confirmation...');

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      if (receipt.status === 1) {
        toast.success('Goal created successfully on blockchain!');
        await fetchGoals(); // Refresh goals
        // Extract goal ID from event logs
        const event = receipt.events.find(e => e.event === 'GoalCreated');
        return event ? event.args.goalId.toString() : 'unknown';
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal: ' + error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Deposit to a goal using ethereum provider
  const depositToGoal = async (goalId, amount, description = 'Deposit to goal') => {
    console.log('depositToGoal called with:', { goalId, amount, description });
    console.log('isConnected:', isConnected, 'account:', account);
    
    if (!isConnected || !account) {
      toast.error('Please connect your wallet');
      return false;
    }

    try {
      setIsLoading(true);
      console.log('Starting deposit on blockchain...');
      
      // Use ethers.js for transactions (same as createGoal)
      const provider = new BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_CONFIG.address,
        CONTRACT_CONFIG.abi,
        signer
      );

      console.log('Calling deposit on contract...');
      const tx = await contract.deposit(
        goalId,
        description,
        { 
          value: ethers.parseEther(amount.toString())
        }
      );

      console.log('Transaction sent:', tx.hash);
      toast.success('Transaction sent! Waiting for confirmation...');
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      if (receipt.status === 1) {
        toast.success('Deposit successful!');
        await fetchGoals(); // Refresh goals
        return true;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error depositing:', error);
      toast.error('Failed to deposit: ' + error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Withdraw from a goal using ethereum provider
  const withdrawFromGoal = async (goalId, amount, description = 'Withdrawal from goal') => {
    console.log('withdrawFromGoal called with:', { goalId, amount, description });
    console.log('isConnected:', isConnected, 'account:', account);
    
    if (!isConnected || !account) {
      toast.error('Please connect your wallet');
      return false;
    }

    try {
      setIsLoading(true);
      console.log('Starting withdrawal on blockchain...');
      
      // Use ethers.js for transactions (same as createGoal)
      const provider = new BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_CONFIG.address,
        CONTRACT_CONFIG.abi,
        signer
      );

      console.log('Calling withdraw on contract...');
      const tx = await contract.withdraw(
        goalId,
        ethers.parseEther(amount.toString()),
        description
      );

      console.log('Transaction sent:', tx.hash);
      toast.success('Transaction sent! Waiting for confirmation...');
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      if (receipt.status === 1) {
        toast.success('Withdrawal successful!');
        await fetchGoals(); // Refresh goals
        return true;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error withdrawing:', error);
      toast.error('Failed to withdraw: ' + error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Complete a goal using ethereum provider
  const completeGoal = async (goalId) => {
    if (!isConnected || !account) {
      toast.error('Please connect your wallet');
      return false;
    }

    try {
      setIsLoading(true);
      
      const provider = new BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_CONFIG.address,
        CONTRACT_CONFIG.abi,
        signer
      );

      const tx = await contract.completeGoal(
        goalId
      );

      toast.success('Transaction sent! Waiting for confirmation...');
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        toast.success('Goal completed!');
        await fetchGoals(); // Refresh goals
        return true;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error completing goal:', error);
      toast.error('Failed to complete goal: ' + error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a goal using ethereum provider
  const deleteGoal = async (goalId) => {
    if (!isConnected || !account) {
      toast.error('Please connect your wallet');
      return false;
    }

    try {
      setIsLoading(true);
      console.log('Starting goal deletion:', { goalId });
      
      const provider = new BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_CONFIG.address,
        CONTRACT_CONFIG.abi,
        signer
      );

      const tx = await contract.deleteGoal(
        goalId,
        { gasLimit: 200000 }
      );

      console.log('Delete transaction sent:', tx.hash);
      toast.success('Transaction sent! Waiting for confirmation...');
      
      const receipt = await tx.wait();
      console.log('Delete transaction confirmed:', receipt);
      
      if (receipt.status === 1) {
        toast.success('Goal deleted successfully!');
        await fetchGoals(); // Refresh goals
        return true;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      
      // Provide more specific error messages
      if (error.message.includes('user rejected')) {
        toast.error('Transaction rejected by user');
      } else if (error.message.includes('gas')) {
        toast.error('Gas estimation failed. Please try again.');
      } else if (error.message.includes('not owner')) {
        toast.error('You can only delete your own goals');
      } else {
        toast.error('Failed to delete goal: ' + error.message);
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch transaction history for a goal
  const getTransactionHistory = async (goalId) => {
    try {
      const transactions = await publicClient.readContract({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'getGoalTransactions',
        args: [BigInt(goalId)]
      });

      return transactions.map(tx => ({
        type: Object.keys(TRANSACTION_TYPE)[tx.transactionType],
        amount: parseFloat(formatEther(tx.amount)),
        timestamp: new Date(Number(tx.timestamp) * 1000)
      }));
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  };

  // Fetch milestones for a goal
  const getMilestones = async (goalId) => {
    try {
      const milestones = await publicClient.readContract({
        address: CONTRACT_CONFIG.address,
        abi: CONTRACT_CONFIG.abi,
        functionName: 'getGoalMilestones',
        args: [BigInt(goalId)]
      });

      return milestones.map(milestone => ({
        amount: parseFloat(formatEther(milestone.amount)),
        reached: milestone.reached,
        reachedAt: milestone.reachedAt ? new Date(Number(milestone.reachedAt) * 1000) : null
      }));
    } catch (error) {
      console.error('Error fetching milestones:', error);
      return [];
    }
  };

  // Test function to check goal state without transaction
  const checkGoalState = async (goalId) => {
    try {
      console.log('Checking goal state for ID:', goalId);
      
      // Use public client for read-only operations
      const provider = new JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
      const contract = new ethers.Contract(
        CONTRACT_CONFIG.address,
        CONTRACT_CONFIG.abi,
        provider
      );

      const goalDetails = await contract.goals(goalId);
      const currentTime = Math.floor(Date.now() / 1000);
      
      const goalInfo = {
        exists: goalDetails.exists,
        owner: goalDetails.owner,
        status: goalDetails.status,
        currentAmount: ethers.formatEther(goalDetails.currentAmount),
        targetAmount: ethers.formatEther(goalDetails.targetAmount),
        deadline: new Date(goalDetails.deadline.toNumber() * 1000).toISOString(),
        isExpired: currentTime > goalDetails.deadline.toNumber(),
        isOwner: goalDetails.owner.toLowerCase() === account.toLowerCase()
      };
      
      console.log('Goal State Check:', goalInfo);
      return goalInfo;
    } catch (error) {
      console.error('Error checking goal state:', error);
      
      // If the goal doesn't exist, return that information
      if (error.message.includes('execution reverted') || error.code === -32603) {
        console.log('Goal does not exist or contract call failed');
        return {
          exists: false,
          error: 'Goal does not exist or contract call failed',
          goalId: goalId
        };
      }
      
      return null;
    }
  };

  // Load goals when wallet connects - simplified to prevent infinite loops
  useEffect(() => {
    console.log('useEffect triggered:', { isConnected, account });
    if (isConnected && account) {
      fetchGoals();
    } else {
      setGoals([]);
      setGoalCount(0);
    }
  }, [isConnected, account, fetchGoals]);

  return {
    isLoading,
    goals,
    goalCount,
    createGoal,
    depositToGoal,
    withdrawFromGoal,
    completeGoal,
    deleteGoal,
    getTransactionHistory,
    getMilestones,
    fetchGoals,
    checkGoalState
  };
};