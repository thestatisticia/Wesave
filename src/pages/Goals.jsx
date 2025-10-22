import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Target, 
  TrendingUp, 
  Calendar, 
  Filter,
  Search,
  ArrowRight,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useGoals } from '../contexts/GoalsContext';

const Goals = () => {
  const navigate = useNavigate();
  const { goals, isLoading, deleteGoal } = useGoals();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  const categories = ['Emergency', 'Travel', 'Technology', 'Home', 'Education', 'Health', 'Entertainment', 'Investment', 'Other'];

  const filteredAndSortedGoals = goals
    .filter(goal => {
      const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           goal.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || goal.status === filterStatus;
      const matchesCategory = filterCategory === 'all' || goal.category === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'amount':
          return b.targetAmount - a.targetAmount;
        case 'progress':
          return (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount);
        case 'deadline':
          return new Date(a.deadline) - new Date(b.deadline);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  const activeGoals = goals.filter(goal => goal.status === 'active').length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return '#10b981';
    if (percentage >= 75) return '#3b82f6';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleDeleteGoal = (goalId, goalName) => {
    if (window.confirm(`Are you sure you want to delete "${goalName}"? This action cannot be undone.`)) {
      deleteGoal(goalId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-accent-600 dark:text-accent-400">Loading your goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-accent-900 dark:text-white mb-2">
                All Goals 🎯
              </h1>
              <p className="text-accent-600 dark:text-accent-400">
                Manage and track all your savings goals
              </p>
            </div>
            <button
              onClick={() => navigate('/app/goal/new')}
              className="btn-primary flex items-center space-x-2 px-6 py-3"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Goal</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-accent-600 dark:text-accent-400 mb-1">Total Goals</p>
                <p className="text-2xl font-bold text-accent-900 dark:text-white">
                  {goals.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-emerald rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-accent-600 dark:text-accent-400 mb-1">Active Goals</p>
                <p className="text-2xl font-bold text-accent-900 dark:text-white">
                  {activeGoals}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-teal rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-accent-600 dark:text-accent-400 mb-1">Completed</p>
                <p className="text-2xl font-bold text-accent-900 dark:text-white">
                  {completedGoals}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-accent-600 dark:text-accent-400 mb-1">Total Saved</p>
                <p className="text-2xl font-bold text-accent-900 dark:text-white">
                  {formatCurrency(totalSaved)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-accent-800 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-400 w-5 h-5" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-3 bg-white dark:bg-accent-800 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="pl-4 pr-8 py-3 bg-white dark:bg-accent-800 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-4 pr-8 py-3 bg-white dark:bg-accent-800 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
            >
              <option value="createdAt">Newest First</option>
              <option value="name">Name A-Z</option>
              <option value="amount">Amount</option>
              <option value="progress">Progress</option>
              <option value="deadline">Deadline</option>
            </select>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedGoals.map((goal) => {
            const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
            const daysLeft = getDaysLeft(goal.deadline);
            
            return (
              <div
                key={goal.id}
                className="card hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-accent-900 dark:text-white mb-1">
                      {goal.title}
                    </h3>
                    <p className="text-sm text-accent-600 dark:text-accent-400 mb-2">
                      {goal.category}
                    </p>
                    <p className="text-sm text-accent-700 dark:text-accent-300 line-clamp-2">
                      {goal.description}
                    </p>
                  </div>
                  <div className="w-16 h-16">
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

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-accent-600 dark:text-accent-400">Progress</span>
                    <span className="text-sm font-medium text-accent-900 dark:text-white">
                      {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>

                  <div className="w-full bg-accent-200 dark:bg-accent-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getProgressColor(percentage)
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center space-x-1 text-accent-600 dark:text-accent-400">
                      <Calendar className="w-4 h-4" />
                      <span>{daysLeft} days left</span>
                    </div>
                    <div className="flex items-center space-x-1 text-accent-600 dark:text-accent-400">
                      <TrendingUp className="w-4 h-4" />
                      <span>{percentage}%</span>
                    </div>
                  </div>
                </div>

                {goal.status === 'completed' && (
                  <div className="mt-4 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium text-center">
                      🎉 Goal Completed!
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => navigate(`/app/goal/${goal.id}`)}
                    className="flex-1 btn-primary flex items-center justify-center space-x-2 py-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id, goal.title)}
                    className="p-2 btn-secondary hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAndSortedGoals.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-accent-100 dark:bg-accent-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-12 h-12 text-accent-400" />
            </div>
            <h3 className="text-xl font-semibold text-accent-900 dark:text-white mb-2">
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'No goals match your criteria'
                : 'No goals found'
              }
            </h3>
            <p className="text-accent-600 dark:text-accent-400 mb-6">
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Start your savings journey by creating your first goal'
              }
            </p>
            <button
              onClick={() => navigate('/app/goal/new')}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Goal</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
