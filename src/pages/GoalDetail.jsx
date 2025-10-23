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
  MoreVertical,
  DollarSign,
  FileText,
  X
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
  const { getGoalById, addTransaction } = useGoals();
  const { isConnected } = useWallet();
  const [goal, setGoal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDescription, setWithdrawDescription] = useState('');
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);

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

  // Calculate withdrawal fee (5% as per contract)
  const calculateWithdrawalFee = (amount) => {
    return amount * 0.05; // 5% fee
  };

  const getNetWithdrawalAmount = (amount) => {
    const fee = calculateWithdrawalFee(amount);
    return amount - fee;
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
            toast.success('🎉 Congratulations! Goal completed! Funds automatically returned to your wallet!');
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

    const amount = parseFloat(withdrawAmount);
    if (amount > goal.currentAmount) {
      toast.error('Withdrawal amount cannot exceed available balance');
      return;
    }

    if (amount < 0.001) {
      toast.error('Minimum withdrawal amount is 0.001 CELO');
      return;
    }

    // Show confirmation dialog
    setShowWithdrawConfirm(true);
  };

  const confirmWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      const amount = parseFloat(withdrawAmount);
      const description = withdrawDescription || 'Withdrawal from goal';
      
      // Withdraw from smart contract
      const success = await addTransaction(goal.id, amount, 'WITHDRAWAL', description);
      
      if (success) {
        const netAmount = getNetWithdrawalAmount(amount);
        toast.success(`Successfully withdrew ${formatCurrency(netAmount)}! (Fee: ${formatCurrency(calculateWithdrawalFee(amount))})`);
        setWithdrawAmount('');
        setWithdrawDescription('');
        setShowWithdrawModal(false);
        setShowWithdrawConfirm(false);
        
        // Refresh goal data
        const updatedGoal = getGoalById(goal.id);
        if (updatedGoal) {
          setGoal(updatedGoal);
        }
        
        // Show success animation
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f97316', '#ea580c', '#dc2626']
        });
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
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading goal details...</p>
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Goal not found
          </h2>
          <button
            onClick={() => navigate('/app')}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm lg:text-base"
          >
            <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <button
            onClick={() => navigate('/app')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm lg:text-base"
          >
            <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
              <Share2 className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300">
              <MoreVertical className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Goal Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 dark:text-white">
                    {goal.name}
                  </h1>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
                    {goal.category} • Created {formatDate(goal.createdAt)}
                  </p>
                </div>
              </div>
              
              <p className="text-sm lg:text-base text-gray-700 dark:text-gray-300 mb-4 lg:mb-6">
                {goal.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Deadline</p>
                    <p className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white">
                      {formatDate(goal.deadline)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Days Left</p>
                    <p className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white">
                      {daysLeft > 0 ? `${daysLeft} days` : 'Overdue'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" />
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Amount Left</p>
                    <p className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(amountLeft)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Ring */}
            <div className="w-32 h-32 lg:w-48 lg:h-48 xl:w-64 xl:h-64">
              <CircularProgressbar
                value={percentage}
                text={`${percentage}%`}
                styles={buildStyles({
                  pathColor: getProgressColor(percentage),
                  textColor: getProgressColor(percentage),
                  trailColor: '#e5e7eb',
                  textSize: '16px',
                  fontWeight: 'bold',
                })}
              />
            </div>
          </div>
        </div>

        {/* Debug Info - Remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Debug Info:</h4>
            <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
              <p>Goal Status: <span className="font-mono">{goal.status}</span></p>
              <p>Current Amount: <span className="font-mono">{goal.currentAmount}</span></p>
              <p>Can Withdraw: <span className="font-mono">{(goal.status === 'active' || goal.status === 'cancelled') && goal.currentAmount > 0 ? 'YES' : 'NO'}</span></p>
              <p>Show Withdrawal Button: <span className="font-mono">{(goal.status === 'active' || goal.status === 'cancelled') && goal.currentAmount > 0 ? 'YES' : 'NO'}</span></p>
              <p>Auto-Refund on Completion: <span className="font-mono">YES (funds go back to wallet)</span></p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setShowDepositModal(true)}
            className="flex items-center justify-center space-x-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm lg:text-base flex-1"
          >
            <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
            <span>Deposit Funds</span>
          </button>
          
          {/* Withdrawal Button - Only show for active/cancelled goals with balance */}
          {(goal.status === 'active' || goal.status === 'cancelled') && goal.currentAmount > 0 && (
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="flex items-center justify-center space-x-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm lg:text-base flex-1"
            >
              <Minus className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>Withdraw Funds</span>
            </button>
          )}
          
          {/* Complete Goal Button - Only show when target is reached */}
          {goal.status === 'active' && goal.currentAmount >= goal.targetAmount && (
            <button
              onClick={() => {
                // TODO: Implement complete goal functionality
                toast.success('Goal completion feature coming soon!');
              }}
              className="flex items-center justify-center space-x-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm lg:text-base flex-1"
            >
              <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>Complete Goal</span>
            </button>
          )}
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-3 lg:mb-4">
              Progress Overview
            </h3>
            <div className="space-y-3 lg:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm lg:text-base text-gray-600 dark:text-gray-400">Current Amount</span>
                <span className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(goal.currentAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm lg:text-base text-gray-600 dark:text-gray-400">Target Amount</span>
                <span className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(goal.targetAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm lg:text-base text-gray-600 dark:text-gray-400">Remaining</span>
                <span className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(amountLeft)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 lg:h-3">
                <div
                  className="h-2 lg:h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: getProgressColor(percentage)
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-3 lg:mb-4">
              Milestones
            </h3>
            <div className="space-y-3">
              {(goal.milestones || []).map((milestone, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center ${
                    milestone.reached ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {milestone.reached ? (
                      <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                    ) : (
                      <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 bg-gray-400 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm lg:text-base font-medium text-gray-900 dark:text-white">
                      {formatCurrency(milestone.amount)}
                    </p>
                    {milestone.reached && milestone.date && (
                      <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
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
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-4 lg:mb-6">
            Transaction History
          </h3>
          <div className="space-y-3">
            {(goal.transactions || []).length > 0 ? (
              goal.transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 lg:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'deposit' 
                        ? 'bg-green-100 dark:bg-green-900/20' 
                        : 'bg-red-100 dark:bg-red-900/20'
                    }`}>
                      {transaction.type === 'deposit' ? (
                        <Plus className="w-4 h-4 lg:w-5 lg:h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Minus className="w-4 h-4 lg:w-5 lg:h-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white text-sm lg:text-base">
                        {transaction.description || (transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal')}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className={`font-semibold text-sm lg:text-base ${
                    transaction.type === 'deposit' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 lg:py-12">
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                  <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-gray-400" />
                </div>
                <h4 className="text-sm lg:text-base font-semibold text-gray-900 dark:text-white mb-2">
                  No transactions yet
                </h4>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                  Start by making your first deposit to this goal
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 w-full max-w-md shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
                Deposit Funds
              </h3>
              <button
                onClick={() => {
                  setShowDepositModal(false);
                  setDepositAmount('');
                }}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4 lg:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount (CELO) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    max="10"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="Enter amount in CELO (0.001 - 10)"
                    className="w-full pl-9 lg:pl-10 pr-4 py-2.5 lg:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm lg:text-base"
                  />
                </div>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Minimum: 0.001 CELO, Maximum: 10 CELO
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-2 lg:pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowDepositModal(false);
                    setDepositAmount('');
                  }}
                  className="flex items-center justify-center space-x-2 px-4 py-2.5 lg:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm lg:text-base flex-1"
                >
                  <X className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span>Cancel</span>
                </button>
                
                <button
                  onClick={handleDeposit}
                  disabled={isDepositing}
                  className="flex items-center justify-center space-x-2 px-4 py-2.5 lg:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors text-sm lg:text-base flex-1"
                >
                  {isDepositing ? (
                    <>
                      <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Depositing...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
                      <span>Deposit</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 w-full max-w-md shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
                Withdraw Funds
              </h3>
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount('');
                  setWithdrawDescription('');
                }}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="space-y-4 lg:space-y-6">
              {/* Withdrawal Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Withdrawal Amount (CELO) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    max={goal.currentAmount}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder={`Enter amount (max: ${goal.currentAmount.toFixed(3)} CELO)`}
                    className="w-full pl-9 lg:pl-10 pr-4 py-2.5 lg:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm lg:text-base"
                  />
                </div>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Available: {formatCurrency(goal.currentAmount)}
                </p>
              </div>

              {/* Fee Calculation Display */}
              {withdrawAmount && parseFloat(withdrawAmount) > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 lg:p-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Withdrawal Amount:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(parseFloat(withdrawAmount))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Withdrawal Fee (5%):</span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      -{formatCurrency(calculateWithdrawalFee(parseFloat(withdrawAmount)))}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                    <div className="flex justify-between items-center text-sm font-semibold">
                      <span className="text-gray-900 dark:text-white">You'll Receive:</span>
                      <span className="text-green-600 dark:text-green-400">
                        {formatCurrency(getNetWithdrawalAmount(parseFloat(withdrawAmount)))}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Withdrawal Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                  <textarea
                    value={withdrawDescription}
                    onChange={(e) => setWithdrawDescription(e.target.value)}
                    placeholder="Reason for withdrawal..."
                    rows="2"
                    className="w-full pl-9 lg:pl-10 pr-4 py-2.5 lg:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm lg:text-base"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-2 lg:pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setWithdrawAmount('');
                    setWithdrawDescription('');
                  }}
                  className="flex items-center justify-center space-x-2 px-4 py-2.5 lg:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm lg:text-base flex-1"
                >
                  <X className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span>Cancel</span>
                </button>
                
                <button
                  onClick={handleWithdraw}
                  disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > goal.currentAmount}
                  className="flex items-center justify-center space-x-2 px-4 py-2.5 lg:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors text-sm lg:text-base flex-1"
                >
                  <Minus className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span>Continue</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Confirmation Modal */}
      {showWithdrawConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 w-full max-w-md shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-4 lg:mb-6">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <Minus className="w-6 h-6 lg:w-8 lg:h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Confirm Withdrawal
              </h3>
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
                Are you sure you want to withdraw from this goal? This action cannot be undone.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 lg:p-4 mb-4 lg:mb-6 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Goal:</span>
                <span className="font-medium text-gray-900 dark:text-white">{goal.name}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Withdrawal Amount:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(parseFloat(withdrawAmount))}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">Withdrawal Fee (5%):</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  -{formatCurrency(calculateWithdrawalFee(parseFloat(withdrawAmount)))}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-gray-900 dark:text-white">You'll Receive:</span>
                  <span className="text-green-600 dark:text-green-400">
                    {formatCurrency(getNetWithdrawalAmount(parseFloat(withdrawAmount)))}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
              <button
                onClick={() => setShowWithdrawConfirm(false)}
                className="flex items-center justify-center space-x-2 px-4 py-2.5 lg:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm lg:text-base flex-1"
              >
                <X className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>Cancel</span>
              </button>
              
              <button
                onClick={confirmWithdraw}
                disabled={isWithdrawing}
                className="flex items-center justify-center space-x-2 px-4 py-2.5 lg:py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors text-sm lg:text-base flex-1"
              >
                {isWithdrawing ? (
                  <>
                    <div className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Withdrawing...</span>
                  </>
                ) : (
                  <>
                    <Minus className="w-4 h-4 lg:w-5 lg:h-5" />
                    <span>Confirm Withdrawal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalDetail;
