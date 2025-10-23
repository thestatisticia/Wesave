import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Target, 
  TrendingUp, 
  Calendar, 
  Wallet,
  Award,
  Users,
  ArrowRight,
  Filter,
  Search,
  Trash2,
  X
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useWallet } from '../contexts/WalletContext';
import { useGoals } from '../contexts/GoalsContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { address, balance, isConnected } = useWallet();
  const { goals, isLoading, fetchGoals, deleteGoal } = useGoals();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Debug logging
  console.log('Dashboard render:', { 
    isLoading, 
    goalsLength: goals?.length, 
    goals: goals,
    address,
    balance,
    isConnected
  });

  // Add error boundary for debugging
  if (!goals && !isLoading) {
    console.error('Dashboard: No goals data and not loading');
  }

  // Auto-refresh goals when component mounts and wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      console.log('Dashboard: Auto-refreshing goals on mount');
      fetchGoals();
    }
  }, [isConnected, address, fetchGoals]);

  const handleDeleteGoal = async (goalId, goalTitle) => {
    if (window.confirm(`Are you sure you want to delete "${goalTitle}"? This action cannot be undone.`)) {
      const success = await deleteGoal(goalId);
      if (success) {
        await fetchGoals(); // Refresh the goals list
      }
    }
  };

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || goal.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  const activeGoals = goals.filter(goal => goal.status === 'active').length;

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return '#10b981';
    if (percentage >= 75) return '#3b82f6';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const formatCurrency = (amount) => {
    const celoAmount = parseFloat(amount);
    const usdEstimate = celoAmount * 0.5; // Rough estimate: 1 CELO ≈ $0.50
    return `${celoAmount.toFixed(3)} CELO (≈$${usdEstimate.toFixed(2)})`;
  };

  const getDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-accent-600 dark:text-accent-400">Loading your savings goals...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen p-4 lg:p-6 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {isConnected ? 'Welcome back! 👋' : 'Welcome to WeSave! 🎯'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
            {isConnected 
              ? 'Track your progress and manage your savings goals'
              : 'Connect your wallet to start managing your savings goals'
            }
          </p>
        </div>

        {isConnected ? (
          <>
            {/* Stats Cards - Responsive grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-1">Total Saved</p>
                    <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(totalSaved)}
                    </p>
                  </div>
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <Wallet className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-1">Active Goals</p>
                    <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                      {activeGoals}
                    </p>
                  </div>
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-1">Completed</p>
                    <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                      {completedGoals}
                    </p>
                  </div>
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-1">Progress</p>
                    <p className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round((totalSaved / totalTarget) * 100)}%
                    </p>
                  </div>
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Goals List - Mobile optimized */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6 lg:mb-8">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4">Your Goals ({goals.length})</h3>
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div key={goal.id} className="bg-gray-50 dark:bg-gray-700 p-3 lg:p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h4 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-1">{goal.title}</h4>
                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-1">{goal.category}</p>
                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)} ({(goal.currentAmount / goal.targetAmount * 100).toFixed(1)}%)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Welcome Content - Mobile optimized */
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 lg:p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-6 lg:mb-8 text-center">
            <div className="text-4xl lg:text-6xl mb-4 lg:mb-5">🎯</div>
            <h2 className="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4">Connect Your Wallet to Get Started</h2>
            <p className="text-sm lg:text-lg text-gray-600 dark:text-gray-400 mb-4 lg:mb-6 max-w-2xl mx-auto">
              Connect your MetaMask wallet to Celo Alfajores testnet to start creating and managing your savings goals.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 lg:p-6 rounded-lg">
                <div className="text-2xl lg:text-4xl mb-2 lg:mb-3">💎</div>
                <h3 className="text-base lg:text-xl font-semibold text-gray-900 dark:text-white mb-1 lg:mb-2">Create Goals</h3>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Set personalized savings targets</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 lg:p-6 rounded-lg">
                <div className="text-2xl lg:text-4xl mb-2 lg:mb-3">📊</div>
                <h3 className="text-base lg:text-xl font-semibold text-gray-900 dark:text-white mb-1 lg:mb-2">Track Progress</h3>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Monitor your savings journey</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 lg:p-6 rounded-lg">
                <div className="text-2xl lg:text-4xl mb-2 lg:mb-3">🏆</div>
                <h3 className="text-base lg:text-xl font-semibold text-gray-900 dark:text-white mb-1 lg:mb-2">Earn Rewards</h3>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Get NFT badges for milestones</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter - Only show when wallet is connected */}
        {isConnected && (
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
            <input
              type="text"
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 lg:pl-10 pr-4 py-2.5 lg:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm lg:text-base"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-9 lg:pl-10 pr-8 py-2.5 lg:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-900 dark:text-white text-sm lg:text-base"
            >
              <option value="all">All Goals</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          <button
            onClick={() => fetchGoals()}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 lg:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm lg:text-base"
            disabled={isLoading}
          >
            <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5" />
            <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={() => navigate('/app/goal/new')}
            className="flex items-center justify-center space-x-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm lg:text-base"
          >
            <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
            <span>Create Goal</span>
          </button>
        </div>
        )}

        {/* Goals Grid - Only show when wallet is connected */}
        {isConnected && (
          <>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
          {filteredGoals.map((goal) => {
            const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
            const daysLeft = getDaysLeft(goal.deadline);
            
            return (
              <div
                key={goal.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group relative"
              >
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteGoal(goal.id, goal.title);
                  }}
                  className="absolute top-3 right-3 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Goal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div 
                  className="cursor-pointer"
                onClick={() => navigate(`/app/goal/${goal.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 pr-2">
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {goal.title}
                    </h3>
                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                      {goal.category}
                    </p>
                  </div>
                  <div className="w-12 h-12 lg:w-16 lg:h-16">
                    <CircularProgressbar
                      value={percentage}
                      text={`${percentage}%`}
                      styles={buildStyles({
                        pathColor: getProgressColor(percentage),
                        textColor: getProgressColor(percentage),
                        trailColor: '#e5e7eb',
                        textSize: '12px',
                        fontWeight: 'bold',
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getProgressColor(percentage)
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs lg:text-sm">
                    <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span>{daysLeft} days left</span>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-600">
                      <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

                {goal.status === 'completed' && (
                  <div className="mt-4 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-xs lg:text-sm text-green-600 dark:text-green-400 font-medium text-center">
                      🎉 Goal Completed! Funds returned to wallet
                    </p>
                  </div>
                )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredGoals.length === 0 && (
          <div className="text-center py-8 lg:py-12">
            <div className="w-16 h-16 lg:w-24 lg:h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 lg:w-12 lg:h-12 text-gray-400" />
            </div>
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No goals found
            </h3>
            <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 mb-4 lg:mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start your savings journey by creating your first goal'
              }
            </p>
            <button
              onClick={() => navigate('/app/goal/new')}
              className="flex items-center justify-center space-x-2 px-4 lg:px-6 py-2.5 lg:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mx-auto text-sm lg:text-base"
            >
              <Plus className="w-4 h-4 lg:w-5 lg:h-5" />
              <span>Create Your First Goal</span>
            </button>
          </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
