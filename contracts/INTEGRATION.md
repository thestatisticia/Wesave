# WeSave Smart Contract Integration Guide

## 🔗 Frontend Integration

### **Contract ABI & Address**
After deployment, you'll need:
- Contract ABI (from `artifacts/contracts/WeSave.sol/WeSave.json`)
- Contract address (from deployment output)
- Network configuration

### **Environment Variables**
Add to your `.env` file:
```env
VITE_CONTRACT_ADDRESS=0x...
VITE_NETWORK_ID=44787
VITE_RPC_URL=https://alfajores-forno.celo-testnet.org
```

## 📱 React Integration

### **1. Contract Hook**
Create a custom hook for contract interaction:

```javascript
// src/hooks/useContract.js
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export const useContract = () => {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      const contractABI = [
        // Contract ABI here
      ];
      
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      setContract(contract);
    }
  }, []);

  const connectSigner = async () => {
    if (provider) {
      const signer = provider.getSigner();
      setSigner(signer);
      
      const contractWithSigner = contract.connect(signer);
      setContract(contractWithSigner);
    }
  };

  return { contract, provider, signer, connectSigner };
};
```

### **2. Goal Management Hook**
```javascript
// src/hooks/useGoals.js
import { useState, useEffect } from 'react';
import { useContract } from './useContract';

export const useGoals = () => {
  const { contract } = useContract();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  const createGoal = async (goalData) => {
    if (!contract) return;
    
    try {
      setLoading(true);
      const tx = await contract.createGoal(
        goalData.name,
        goalData.description,
        ethers.utils.parseEther(goalData.targetAmount.toString()),
        Math.floor(new Date(goalData.deadline).getTime() / 1000),
        goalData.category
      );
      
      await tx.wait();
      await fetchGoals();
      return tx.hash;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deposit = async (goalId, amount, description) => {
    if (!contract) return;
    
    try {
      setLoading(true);
      const tx = await contract.deposit(goalId, description, {
        value: ethers.utils.parseEther(amount.toString())
      });
      
      await tx.wait();
      await fetchGoals();
      return tx.hash;
    } catch (error) {
      console.error('Error making deposit:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (goalId, amount, description) => {
    if (!contract) return;
    
    try {
      setLoading(true);
      const tx = await contract.withdraw(
        goalId,
        ethers.utils.parseEther(amount.toString()),
        description
      );
      
      await tx.wait();
      await fetchGoals();
      return tx.hash;
    } catch (error) {
      console.error('Error withdrawing:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchGoals = async () => {
    if (!contract) return;
    
    try {
      const userGoals = await contract.getUserGoals(await contract.signer.getAddress());
      const goalsData = await Promise.all(
        userGoals.map(async (goalId) => {
          const goal = await contract.getGoal(goalId);
          const milestones = await contract.getGoalMilestones(goalId);
          const transactions = await contract.getGoalTransactions(goalId);
          
          return {
            id: goal.id.toNumber(),
            name: goal.name,
            description: goal.description,
            targetAmount: parseFloat(ethers.utils.formatEther(goal.targetAmount)),
            currentAmount: parseFloat(ethers.utils.formatEther(goal.currentAmount)),
            deadline: new Date(goal.deadline.toNumber() * 1000).toISOString().split('T')[0],
            category: goal.category,
            status: goal.status,
            createdAt: new Date(goal.createdAt.toNumber() * 1000).toISOString().split('T')[0],
            completedAt: goal.completedAt.toNumber() > 0 ? 
              new Date(goal.completedAt.toNumber() * 1000).toISOString().split('T')[0] : null,
            milestones: milestones.map(m => ({
              amount: parseFloat(ethers.utils.formatEther(m.amount)),
              reached: m.reached,
              reachedAt: m.reachedAt.toNumber() > 0 ? 
                new Date(m.reachedAt.toNumber() * 1000).toISOString().split('T')[0] : null,
              nftTokenId: m.nftTokenId.toNumber()
            })),
            transactions: await Promise.all(
              transactions.map(async (txId) => {
                const tx = await contract.getTransaction(txId);
                return {
                  id: tx.id.toNumber(),
                  amount: parseFloat(ethers.utils.formatEther(tx.amount)),
                  type: tx.transactionType === 0 ? 'deposit' : 'withdrawal',
                  description: tx.description,
                  date: new Date(tx.timestamp.toNumber() * 1000).toISOString().split('T')[0]
                };
              })
            )
          };
        })
      );
      
      setGoals(goalsData);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchGoals();
    }
  }, [contract]);

  return {
    goals,
    loading,
    createGoal,
    deposit,
    withdraw,
    fetchGoals
  };
};
```

### **3. NFT Rewards Hook**
```javascript
// src/hooks/useNFTs.js
import { useState, useEffect } from 'react';
import { useContract } from './useContract';

export const useNFTs = () => {
  const { contract } = useContract();
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserNFTs = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      const userAddress = await contract.signer.getAddress();
      const balance = await contract.balanceOf(userAddress);
      
      const nftData = [];
      for (let i = 0; i < balance; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i);
        const tokenURI = await contract.tokenURI(tokenId);
        
        nftData.push({
          tokenId: tokenId.toNumber(),
          tokenURI,
          // You can fetch metadata from tokenURI if needed
        });
      }
      
      setNFTs(nftData);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchUserNFTs();
    }
  }, [contract]);

  return { nfts, loading, fetchUserNFTs };
};
```

## 🔄 Event Listening

### **Contract Events**
```javascript
// src/hooks/useContractEvents.js
import { useEffect } from 'react';
import { useContract } from './useContract';

export const useContractEvents = () => {
  const { contract } = useContract();

  useEffect(() => {
    if (!contract) return;

    // Listen for goal creation
    contract.on('GoalCreated', (goalId, user, name, description, targetAmount, deadline, category, timestamp) => {
      console.log('New goal created:', { goalId, user, name });
      // Update UI or show notification
    });

    // Listen for deposits
    contract.on('DepositMade', (goalId, user, amount, newBalance, timestamp) => {
      console.log('Deposit made:', { goalId, user, amount: ethers.utils.formatEther(amount) });
      // Update UI or show notification
    });

    // Listen for milestones
    contract.on('MilestoneReached', (goalId, user, milestoneAmount, nftTokenId, timestamp) => {
      console.log('Milestone reached:', { goalId, user, milestoneAmount: ethers.utils.formatEther(milestoneAmount) });
      // Show celebration animation or notification
    });

    // Listen for goal completion
    contract.on('GoalCompleted', (goalId, user, totalAmount, timestamp) => {
      console.log('Goal completed:', { goalId, user, totalAmount: ethers.utils.formatEther(totalAmount) });
      // Show completion celebration
    });

    return () => {
      contract.removeAllListeners();
    };
  }, [contract]);
};
```

## 🎨 UI Integration

### **Update GoalsContext**
Replace the mock data in your GoalsContext with real contract calls:

```javascript
// src/contexts/GoalsContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useGoals } from '../hooks/useGoals';

const GoalsContext = createContext();

export const useGoalsContext = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoalsContext must be used within a GoalsProvider');
  }
  return context;
};

export const GoalsProvider = ({ children }) => {
  const { goals, loading, createGoal, deposit, withdraw, fetchGoals } = useGoals();

  const addGoal = async (goalData) => {
    try {
      const txHash = await createGoal(goalData);
      return { success: true, txHash };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const addTransaction = async (goalId, transaction) => {
    try {
      if (transaction.type === 'deposit') {
        const txHash = await deposit(goalId, transaction.amount, transaction.description);
        return { success: true, txHash };
      } else if (transaction.type === 'withdrawal') {
        const txHash = await withdraw(goalId, transaction.amount, transaction.description);
        return { success: true, txHash };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    goals,
    isLoading: loading,
    addGoal,
    addTransaction,
    refreshGoals: fetchGoals
  };

  return (
    <GoalsContext.Provider value={value}>
      {children}
    </GoalsContext.Provider>
  );
};
```

## 🚀 Deployment Checklist

### **Pre-Integration**
- [ ] Contract deployed and verified
- [ ] Contract ABI extracted
- [ ] Environment variables set
- [ ] Network configuration updated

### **Integration Steps**
- [ ] Install ethers.js
- [ ] Create contract hooks
- [ ] Update GoalsContext
- [ ] Add event listeners
- [ ] Update UI components
- [ ] Test all functions
- [ ] Handle error states

### **Post-Integration**
- [ ] Test on testnet
- [ ] Verify all functions work
- [ ] Check gas usage
- [ ] Monitor events
- [ ] User testing

This integration guide provides a complete path from smart contract deployment to frontend integration, ensuring a seamless user experience.
