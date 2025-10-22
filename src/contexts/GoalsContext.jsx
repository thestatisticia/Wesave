import React, { createContext, useContext } from 'react';
import { useContract } from '../hooks/useContract';

const GoalsContext = createContext();

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
};

export const GoalsProvider = ({ children }) => {
  console.log('GoalsProvider: Initializing...');
  try {
    const contract = useContract();
    console.log('GoalsProvider: Contract loaded:', contract);

    const addGoal = async (goalData) => {
      console.log('GoalsContext addGoal called with:', goalData);
      return await contract.createGoal(goalData);
    };

    const updateGoal = async (goalId, updates) => {
      // For smart contract integration, we'll refresh goals instead of local updates
      await contract.fetchGoals();
    };

    const deleteGoal = async (goalId) => {
      return await contract.deleteGoal(goalId);
    };

    const getGoalById = (goalId) => {
      return contract.goals.find(goal => goal.id === goalId);
    };

    const addTransaction = async (goalId, amount, type, description = 'Transaction') => {
      if (type === 'DEPOSIT') {
        return await contract.depositToGoal(goalId, amount, description);
      } else if (type === 'WITHDRAWAL') {
        return await contract.withdrawFromGoal(goalId, amount, description);
      }
      return false;
    };

    const getTransactionsByGoal = async (goalId) => {
      return await contract.getTransactionHistory(goalId);
    };

    const completeGoal = async (goalId) => {
      return await contract.completeGoal(goalId);
    };

    const getMilestones = async (goalId) => {
      return await contract.getMilestones(goalId);
    };

    const value = {
      goals: contract.goals,
      isLoading: contract.isLoading,
      goalCount: contract.goalCount,
      addGoal,
      updateGoal,
      deleteGoal,
      getGoalById,
      addTransaction,
      getTransactionsByGoal,
      completeGoal,
      getMilestones,
      fetchGoals: contract.fetchGoals,
      checkGoalState: contract.checkGoalState
    };

    return (
      <GoalsContext.Provider value={value}>
        {children}
      </GoalsContext.Provider>
    );
  } catch (error) {
    console.error('Error in GoalsProvider:', error);
    
    // Fallback provider with empty data
    const fallbackValue = {
      goals: [],
      isLoading: false,
      goalCount: 0,
      addGoal: async () => null,
      updateGoal: async () => {},
      deleteGoal: async () => false,
      getGoalById: () => null,
      addTransaction: async () => false,
      getTransactionsByGoal: async () => [],
      completeGoal: async () => false,
      getMilestones: async () => [],
      fetchGoals: async () => {}
    };

    return (
      <GoalsContext.Provider value={fallbackValue}>
        {children}
      </GoalsContext.Provider>
    );
  }
};