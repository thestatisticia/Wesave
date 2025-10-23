// Contract configuration - Complete ABI from artifacts
export const CONTRACT_CONFIG = {
  address: import.meta.env.VITE_CONTRACT_ADDRESS || '0x3304c9729f62e2421751bd33902049700c683296',
  abi: [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {"internalType": "string", "name": "name", "type": "string"},
        {"internalType": "string", "name": "description", "type": "string"},
        {"internalType": "uint256", "name": "targetAmount", "type": "uint256"},
        {"internalType": "uint256", "name": "deadline", "type": "uint256"},
        {"internalType": "string", "name": "category", "type": "string"}
      ],
      "name": "createGoal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "goalId", "type": "uint256"},
        {"internalType": "string", "name": "description", "type": "string"}
      ],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "goalId", "type": "uint256"},
        {"internalType": "uint256", "name": "amount", "type": "uint256"},
        {"internalType": "string", "name": "description", "type": "string"}
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "goalId", "type": "uint256"}
      ],
      "name": "completeGoal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "goalId", "type": "uint256"}
      ],
      "name": "deleteGoal",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "address", "name": "user", "type": "address"}
      ],
      "name": "getUserGoals",
      "outputs": [
        {"internalType": "uint256[]", "name": "", "type": "uint256[]"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "goalId", "type": "uint256"}
      ],
      "name": "getGoal",
      "outputs": [
        {
          "components": [
            {"internalType": "uint256", "name": "id", "type": "uint256"},
            {"internalType": "address", "name": "owner", "type": "address"},
            {"internalType": "string", "name": "name", "type": "string"},
            {"internalType": "string", "name": "description", "type": "string"},
            {"internalType": "uint256", "name": "targetAmount", "type": "uint256"},
            {"internalType": "uint256", "name": "currentAmount", "type": "uint256"},
            {"internalType": "uint256", "name": "deadline", "type": "uint256"},
            {"internalType": "string", "name": "category", "type": "string"},
            {"internalType": "uint8", "name": "status", "type": "uint8"},
            {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
            {"internalType": "uint256", "name": "completedAt", "type": "uint256"},
            {"internalType": "bool", "name": "exists", "type": "bool"}
          ],
          "internalType": "struct WeSave.Goal",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "goalId", "type": "uint256"}
      ],
      "name": "goals",
      "outputs": [
        {"internalType": "uint256", "name": "id", "type": "uint256"},
        {"internalType": "address", "name": "owner", "type": "address"},
        {"internalType": "string", "name": "name", "type": "string"},
        {"internalType": "string", "name": "description", "type": "string"},
        {"internalType": "uint256", "name": "targetAmount", "type": "uint256"},
        {"internalType": "uint256", "name": "currentAmount", "type": "uint256"},
        {"internalType": "uint256", "name": "deadline", "type": "uint256"},
        {"internalType": "string", "name": "category", "type": "string"},
        {"internalType": "uint8", "name": "status", "type": "uint8"},
        {"internalType": "uint256", "name": "createdAt", "type": "uint256"},
        {"internalType": "uint256", "name": "completedAt", "type": "uint256"},
        {"internalType": "bool", "name": "exists", "type": "bool"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MIN_GOAL_AMOUNT",
      "outputs": [
        {"internalType": "uint256", "name": "", "type": "uint256"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MAX_GOAL_AMOUNT",
      "outputs": [
        {"internalType": "uint256", "name": "", "type": "uint256"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "goalId", "type": "uint256"}
      ],
      "name": "getGoalMilestones",
      "outputs": [
        {
          "components": [
            {"internalType": "uint256", "name": "goalId", "type": "uint256"},
            {"internalType": "uint256", "name": "amount", "type": "uint256"},
            {"internalType": "bool", "name": "reached", "type": "bool"},
            {"internalType": "uint256", "name": "reachedAt", "type": "uint256"},
            {"internalType": "uint256", "name": "nftTokenId", "type": "uint256"}
          ],
          "internalType": "struct WeSave.Milestone[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "goalId", "type": "uint256"}
      ],
      "name": "getGoalTransactions",
      "outputs": [
        {"internalType": "uint256[]", "name": "", "type": "uint256[]"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {"internalType": "uint256", "name": "transactionId", "type": "uint256"}
      ],
      "name": "getTransaction",
      "outputs": [
        {
          "components": [
            {"internalType": "uint256", "name": "id", "type": "uint256"},
            {"internalType": "uint256", "name": "goalId", "type": "uint256"},
            {"internalType": "address", "name": "user", "type": "address"},
            {"internalType": "uint256", "name": "amount", "type": "uint256"},
            {"internalType": "uint8", "name": "transactionType", "type": "uint8"},
            {"internalType": "string", "name": "description", "type": "string"},
            {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
          ],
          "internalType": "struct WeSave.Transaction",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
};

export const GOAL_STATUS = {
  ACTIVE: 0,
  COMPLETED: 1,
  EXPIRED: 2,
  DELETED: 3
};

export const TRANSACTION_TYPE = {
  DEPOSIT: 0,
  WITHDRAWAL: 1
};
