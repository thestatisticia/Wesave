import { createWalletClient, createPublicClient, http, parseEther, formatEther } from 'viem';
import { celoAlfajores } from 'viem/chains';

// Mock contract ABI for demonstration
// In a real app, this would be generated from your smart contract
const SAVINGS_CONTRACT_ABI = [
  {
    "inputs": [
      {"name": "name", "type": "string"},
      {"name": "targetAmount", "type": "uint256"},
      {"name": "deadline", "type": "uint256"},
      {"name": "category", "type": "string"}
    ],
    "name": "createGoal",
    "outputs": [{"name": "goalId", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "goalId", "type": "uint256"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "depositToGoal",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "goalId", "type": "uint256"}],
    "name": "withdrawFromGoal",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "getUserGoals",
    "outputs": [
      {
        "components": [
          {"name": "id", "type": "uint256"},
          {"name": "name", "type": "string"},
          {"name": "targetAmount", "type": "uint256"},
          {"name": "currentAmount", "type": "uint256"},
          {"name": "deadline", "type": "uint256"},
          {"name": "category", "type": "string"},
          {"name": "status", "type": "uint8"},
          {"name": "creator", "type": "address"}
        ],
        "name": "goals",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "goalId", "type": "uint256"}],
    "name": "claimReward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Contract address (mock - replace with actual deployed contract)
const CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';

class SavingsContractService {
  constructor() {
    this.publicClient = createPublicClient({
      chain: celoAlfajores,
      transport: http(),
    });
  }

  // Create wallet client for transactions
  createWalletClient() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask not detected');
    }

    return createWalletClient({
      chain: celoAlfajores,
      transport: window.ethereum,
    });
  }

  // Create a new savings goal
  async createGoal(name, targetAmount, deadline, category) {
    try {
      const walletClient = this.createWalletClient();
      const [account] = await walletClient.getAddresses();

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: SAVINGS_CONTRACT_ABI,
        functionName: 'createGoal',
        args: [name, parseEther(targetAmount.toString()), Math.floor(new Date(deadline).getTime() / 1000), category],
        account,
      });

      // Wait for transaction confirmation
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
      return receipt;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  }

  // Deposit funds to a goal
  async depositToGoal(goalId, amount) {
    try {
      const walletClient = this.createWalletClient();
      const [account] = await walletClient.getAddresses();

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: SAVINGS_CONTRACT_ABI,
        functionName: 'depositToGoal',
        args: [goalId, parseEther(amount.toString())],
        account,
        value: parseEther(amount.toString()),
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
      return receipt;
    } catch (error) {
      console.error('Error depositing to goal:', error);
      throw error;
    }
  }

  // Withdraw funds from a completed goal
  async withdrawFromGoal(goalId) {
    try {
      const walletClient = this.createWalletClient();
      const [account] = await walletClient.getAddresses();

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: SAVINGS_CONTRACT_ABI,
        functionName: 'withdrawFromGoal',
        args: [goalId],
        account,
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
      return receipt;
    } catch (error) {
      console.error('Error withdrawing from goal:', error);
      throw error;
    }
  }

  // Fetch user's goals
  async fetchGoals(userAddress) {
    try {
      const goals = await this.publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: SAVINGS_CONTRACT_ABI,
        functionName: 'getUserGoals',
        args: [userAddress],
      });

      // Transform the contract data to our app format
      return goals.map(goal => ({
        id: Number(goal.id),
        name: goal.name,
        targetAmount: parseFloat(formatEther(goal.targetAmount)),
        currentAmount: parseFloat(formatEther(goal.currentAmount)),
        deadline: new Date(Number(goal.deadline) * 1000).toISOString().split('T')[0],
        category: goal.category,
        status: this.getStatusFromContract(goal.status),
        creator: goal.creator,
      }));
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  }

  // Claim reward NFT for completed goal
  async claimReward(goalId) {
    try {
      const walletClient = this.createWalletClient();
      const [account] = await walletClient.getAddresses();

      const hash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: SAVINGS_CONTRACT_ABI,
        functionName: 'claimReward',
        args: [goalId],
        account,
      });

      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });
      return receipt;
    } catch (error) {
      console.error('Error claiming reward:', error);
      throw error;
    }
  }

  // Helper function to convert contract status to app status
  getStatusFromContract(status) {
    switch (Number(status)) {
      case 0: return 'active';
      case 1: return 'completed';
      case 2: return 'paused';
      case 3: return 'cancelled';
      default: return 'active';
    }
  }

  // Get contract balance (total locked funds)
  async getContractBalance() {
    try {
      const balance = await this.publicClient.getBalance({
        address: CONTRACT_ADDRESS,
      });
      return parseFloat(formatEther(balance));
    } catch (error) {
      console.error('Error fetching contract balance:', error);
      throw error;
    }
  }

  // Get goal details by ID
  async getGoalById(goalId) {
    try {
      // This would be a separate contract function in a real implementation
      const goals = await this.fetchGoals();
      return goals.find(goal => goal.id === goalId);
    } catch (error) {
      console.error('Error fetching goal by ID:', error);
      throw error;
    }
  }

  // Estimate gas for transactions
  async estimateGas(functionName, args) {
    try {
      const gasEstimate = await this.publicClient.estimateContractGas({
        address: CONTRACT_ADDRESS,
        abi: SAVINGS_CONTRACT_ABI,
        functionName,
        args,
      });
      return gasEstimate;
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const savingsContractService = new SavingsContractService();

// Export utility functions
export const contractUtils = {
  // Format contract error messages
  formatError: (error) => {
    if (error.message.includes('insufficient funds')) {
      return 'Insufficient funds for this transaction';
    }
    if (error.message.includes('user rejected')) {
      return 'Transaction was rejected by user';
    }
    if (error.message.includes('goal not found')) {
      return 'Goal not found';
    }
    if (error.message.includes('goal not completed')) {
      return 'Goal must be completed before withdrawal';
    }
    return 'Transaction failed. Please try again.';
  },

  // Validate goal data before creating
  validateGoalData: (name, targetAmount, deadline, category) => {
    const errors = [];
    
    if (!name || name.trim().length < 3) {
      errors.push('Goal name must be at least 3 characters');
    }
    
    if (!targetAmount || targetAmount <= 0) {
      errors.push('Target amount must be greater than 0');
    }
    
    if (!deadline || new Date(deadline) <= new Date()) {
      errors.push('Deadline must be in the future');
    }
    
    if (!category || category.trim().length < 2) {
      errors.push('Category must be at least 2 characters');
    }
    
    return errors;
  },

  // Calculate progress percentage
  calculateProgress: (currentAmount, targetAmount) => {
    if (targetAmount === 0) return 0;
    return Math.min(Math.round((currentAmount / targetAmount) * 100), 100);
  },

  // Check if goal is completed
  isGoalCompleted: (currentAmount, targetAmount) => {
    return currentAmount >= targetAmount;
  },

  // Check if goal is overdue
  isGoalOverdue: (deadline) => {
    return new Date(deadline) < new Date();
  },

  // Format currency for display
  formatCurrency: (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  // Format date for display
  formatDate: (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Calculate days remaining
  getDaysRemaining: (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
};
