import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Target, 
  TrendingUp, 
  Award,
  Plus,
  Minus,
  Clock,
  CheckCircle,
  Share2,
  MoreVertical
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { useGoals } from '../contexts/GoalsContext';
import { useWallet } from '../contexts/WalletContext';

const GoalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getGoalById, addTransaction, completeGoal, getTransactionsByGoal } = useGoals();
  const { isConnected } = useWallet();
  const [goal, setGoal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Load goal from context
  useEffect(() => {
    const goalData = getGoalById(id);
    if (goalData) {
      setGoal(goalData);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [id, getGoalById]);

  const percentage = Math.round((goal?.currentAmount / goal?.targetAmount) * 100);
  const daysLeft = goal ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
  const amountLeft = goal ? goal.targetAmount - goal.currentAmount : 0;

  const formatCurrency = (amount) => {
    const celoAmount = parseFloat(amount);
    const usdEstimate = celoAmount * 0.5; // Rough estimate: 1 CELO ≈ $0.50
    return `${celoAmount.toFixed(3)} CELO (≈$${usdEstimate.toFixed(2)})`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!isConnected) {
      toast.error('Please connect your wallet to make deposits');
      return;
    }

    setIsDepositing(true);
    try {
      // Deposit to smart contract
      const success = await addTransaction(goal.id, parseFloat(depositAmount), 'DEPOSIT', 'Deposit to goal');
      
      if (success) {
        toast.success(`Successfully deposited ${formatCurrency(depositAmount)}!`);
        setDepositAmount('');
        setShowDepositModal(false);
        
        // Refresh goal data
        const updatedGoal = getGoalById(goal.id);
        if (updatedGoal) {
          setGoal(updatedGoal);
          
          // Trigger confetti if goal is completed
          if (updatedGoal.currentAmount >= updatedGoal.targetAmount) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
            toast.success('🎉 Congratulations! Goal completed!');
          }
        }
      } else {
        toast.error('Failed to deposit funds');
      }
    } catch (error) {
      console.error('Error depositing:', error);
      toast.error('Failed to deposit funds');
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet to make withdrawals');
      return;
    }

    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid withdrawal amount');
      return;
    }

    if (parseFloat(withdrawAmount) > goal.currentAmount) {
      toast.error('Withdrawal amount cannot exceed available balance');
      return;
    }

    setIsWithdrawing(true);
    try {
      // Withdraw from smart contract
      const success = await addTransaction(goal.id, parseFloat(withdrawAmount), 'WITHDRAWAL');
      
      if (success) {
        toast.success(`Successfully withdrew ${formatCurrency(withdrawAmount)}!`);
        setWithdrawAmount('');
        setShowWithdrawModal(false);
        
        // Refresh goal data
        const updatedGoal = getGoalById(goal.id);
        if (updatedGoal) {
          setGoal(updatedGoal);
        }
      } else {
        toast.error('Failed to withdraw funds');
      }
    } catch (error) {
      console.error('Error withdrawing:', error);
      toast.error('Failed to withdraw funds');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return '#10b981';
    if (percentage >= 75) return '#3b82f6';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-accent-600 dark:text-accent-400">Loading goal details...</p>
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-accent-900 dark:text-white mb-4">
            Goal not found
          </h2>
          <button
            onClick={() => navigate('/app')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/app')}
            className="flex items-center space-x-2 text-accent-600 dark:text-accent-400 hover:text-accent-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-xl bg-white dark:bg-accent-800 shadow-lg border border-accent-200 dark:border-accent-700 hover:shadow-xl transition-all duration-300">
              <Share2 className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            </button>
            <button className="p-2 rounded-xl bg-white dark:bg-accent-800 shadow-lg border border-accent-200 dark:border-accent-700 hover:shadow-xl transition-all duration-300">
              <MoreVertical className="w-5 h-5 text-accent-600 dark:text-accent-400" />
            </button>
          </div>
        </div>

        {/* Goal Header */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-emerald rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-accent-900 dark:text-white">
                    {goal.name}
                  </h1>
                  <p className="text-accent-600 dark:text-accent-400">
                    {goal.category} • Created {formatDate(goal.createdAt)}
                  </p>
                </div>
              </div>
              
              <p className="text-lg text-accent-700 dark:text-accent-300 mb-6">
                {goal.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-accent-500" />
                  <div>
                    <p className="text-sm text-accent-600 dark:text-accent-400">Deadline</p>
                    <p className="font-semibold text-accent-900 dark:text-white">
                      {formatDate(goal.deadline)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-accent-500" />
                  <div>
                    <p className="text-sm text-accent-600 dark:text-accent-400">Days Left</p>
                    <p className="font-semibold text-accent-900 dark:text-white">
                      {daysLeft > 0 ? `${daysLeft} days` : 'Overdue'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-accent-500" />
                  <div>
                    <p className="text-sm text-accent-600 dark:text-accent-400">Amount Left</p>
                    <p className="font-semibold text-accent-900 dark:text-white">
                      {formatCurrency(amountLeft)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Ring */}
            <div className="w-48 h-48 lg:w-64 lg:h-64">
              <CircularProgressbar
                value={percentage}
                text={`${percentage}%`}
                styles={buildStyles({
                  pathColor: getProgressColor(percentage),
                  textColor: getProgressColor(percentage),
                  trailColor: '#e5e7eb',
                  textSize: '24px',
                  fontWeight: 'bold',
                })}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowDepositModal(true)}
            className="btn-primary flex items-center justify-center space-x-2 flex-1"
          >
            <Plus className="w-5 h-5" />
            <span>Deposit Funds</span>
          </button>
          
          {goal.status === 'active' && goal.currentAmount > 0 && (
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="btn-secondary flex items-center justify-center space-x-2 flex-1"
            >
              <Minus className="w-5 h-5" />
              <span>Withdraw Funds</span>
            </button>
          )}
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-accent-900 dark:text-white mb-4">
              Progress Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-accent-600 dark:text-accent-400">Current Amount</span>
                <span className="font-semibold text-accent-900 dark:text-white">
                  {formatCurrency(goal.currentAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-600 dark:text-accent-400">Target Amount</span>
                <span className="font-semibold text-accent-900 dark:text-white">
                  {formatCurrency(goal.targetAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-accent-600 dark:text-accent-400">Remaining</span>
                <span className="font-semibold text-accent-900 dark:text-white">
                  {formatCurrency(amountLeft)}
                </span>
              </div>
              <div className="w-full bg-accent-200 dark:bg-accent-700 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: getProgressColor(percentage)
                  }}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-accent-900 dark:text-white mb-4">
              Milestones
            </h3>
            <div className="space-y-3">
              {(goal.milestones || []).map((milestone, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    milestone.reached ? 'bg-green-500' : 'bg-accent-200 dark:bg-accent-700'
                  }`}>
                    {milestone.reached ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <div className="w-2 h-2 bg-accent-400 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-accent-900 dark:text-white">
                      {formatCurrency(milestone.amount)}
                    </p>
                    {milestone.reached && milestone.date && (
                      <p className="text-sm text-accent-600 dark:text-accent-400">
                        Reached {formatDate(milestone.date)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="card">
          <h3 className="text-lg font-semibold text-accent-900 dark:text-white mb-4">
            Transaction History
          </h3>
          <div className="space-y-3">
            {(goal.transactions || []).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-accent-50 dark:bg-accent-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'deposit' ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    {transaction.type === 'deposit' ? (
                      <Plus className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Minus className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-accent-900 dark:text-white">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-accent-600 dark:text-accent-400">
                      {formatDate(transaction.date)}
                    </p>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-accent-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-accent-900 dark:text-white mb-4">
              Deposit Funds
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-accent-700 dark:text-accent-300 mb-2">
                  Amount (CELO)
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  max="10"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter amount in CELO (0.001 - 10)"
                  className="w-full px-4 py-3 bg-white dark:bg-accent-900 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-accent-500 dark:text-accent-400 mt-1">
                  Minimum: 0.001 CELO, Maximum: 10 CELO
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeposit}
                  disabled={isDepositing}
                  className="flex-1 btn-primary"
                >
                  {isDepositing ? 'Depositing...' : 'Deposit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-accent-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-accent-900 dark:text-white mb-4">
              Withdraw Funds
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-accent-700 dark:text-accent-300 mb-2">
                  Withdrawal Amount (CELO)
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  max={goal.currentAmount}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder={`Enter amount (max: ${goal.currentAmount.toFixed(3)} CELO)`}
                  className="w-full px-4 py-3 bg-white dark:bg-accent-900 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-xs text-accent-500 dark:text-accent-400 mt-1">
                  Available: {formatCurrency(goal.currentAmount)}
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing}
                  className="flex-1 btn-primary"
                >
                  {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalDetail;
