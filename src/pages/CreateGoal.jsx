import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoals } from '../contexts/GoalsContext';
import { 
  ArrowLeft, 
  Target, 
  DollarSign, 
  Calendar, 
  FileText,
  Tag,
  Save,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const CreateGoal = () => {
  const navigate = useNavigate();
  const { addGoal } = useGoals();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetAmount: '',
    deadline: '',
    category: '',
    color: 'emerald'
  });

  const categories = [
    'Emergency',
    'Travel',
    'Technology',
    'Home',
    'Education',
    'Health',
    'Entertainment',
    'Investment',
    'Other'
  ];

  const colors = [
    { name: 'emerald', value: 'emerald', bg: 'bg-gradient-emerald' },
    { name: 'blue', value: 'blue', bg: 'bg-gradient-blue' },
    { name: 'purple', value: 'purple', bg: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { name: 'orange', value: 'orange', bg: 'bg-gradient-to-r from-orange-500 to-red-500' },
    { name: 'teal', value: 'teal', bg: 'bg-gradient-teal' },
    { name: 'indigo', value: 'indigo', bg: 'bg-gradient-to-r from-indigo-500 to-purple-500' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter a goal name');
      return;
    }
    
    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      toast.error('Please enter a valid target amount');
      return;
    }
    
    if (!formData.deadline) {
      toast.error('Please select a deadline');
      return;
    }
    
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    console.log('Validation passed, starting goal creation...');
    setIsCreating(true);
    try {
      // Create new goal object for smart contract
      const newGoal = {
        title: formData.name.trim(),
        description: formData.description.trim(),
        targetAmount: parseFloat(formData.targetAmount),
        deadline: new Date(formData.deadline),
        category: formData.category,
        color: formData.color
      };

      console.log('Calling addGoal with:', newGoal);
      // Add goal to smart contract
      const goalId = await addGoal(newGoal);
      console.log('addGoal returned:', goalId);

      if (goalId) {
        toast.success('Goal created successfully! 🎉');
        // Navigate to the new goal's detail page
        navigate(`/app/goal/${goalId}`);
      } else {
        toast.error('Failed to create goal. Please try again.');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen p-4 lg:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 gap-4">
          <button
            onClick={() => navigate('/app')}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm lg:text-base"
          >
            <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
              Create New Goal
            </h1>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Goal Name */}
            <div>
              <label htmlFor="goal-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Goal Name *
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                <input
                  type="text"
                  id="goal-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Emergency Fund, Vacation to Japan"
                  className="w-full pl-9 lg:pl-10 pr-4 py-2.5 lg:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm lg:text-base"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="goal-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                <textarea
                  id="goal-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your goal and why it's important to you..."
                  rows="3"
                  className="w-full pl-9 lg:pl-10 pr-4 py-2.5 lg:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm lg:text-base"
                />
              </div>
            </div>

            {/* Target Amount */}
            <div>
              <label htmlFor="target-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Amount *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                <input
                  type="number"
                  id="target-amount"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="1"
                  step="0.01"
                  className="w-full pl-9 lg:pl-10 pr-4 py-2.5 lg:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm lg:text-base"
                  required
                />
              </div>
              {formData.targetAmount && (
                <p className="mt-2 text-xs lg:text-sm text-gray-600 dark:text-gray-400">
                  Target: {formatCurrency(formData.targetAmount)}
                </p>
              )}
            </div>

            {/* Deadline */}
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deadline *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-9 lg:pl-10 pr-4 py-2.5 lg:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white text-sm lg:text-base"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 lg:w-5 lg:h-5" />
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full pl-9 lg:pl-10 pr-8 py-2.5 lg:py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-900 dark:text-white text-sm lg:text-base"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Color Theme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Color Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {colors.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                    className={`relative p-3 lg:p-4 rounded-lg border-2 transition-all duration-200 ${
                      formData.color === color.value 
                        ? 'border-blue-500 shadow-md' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className={`w-full h-6 lg:h-8 ${color.bg} rounded-md mb-2`}></div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {color.name}
                    </span>
                    {formData.color === color.value && (
                      <div className="absolute top-2 right-2 w-4 h-4 lg:w-5 lg:h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-4 lg:pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => navigate('/app')}
                className="flex items-center justify-center space-x-2 px-4 py-2.5 lg:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm lg:text-base flex-1"
              >
                <X className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>Cancel</span>
              </button>
              
              <button
                type="submit"
                disabled={isCreating}
                className="flex items-center justify-center space-x-2 px-4 py-2.5 lg:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors text-sm lg:text-base flex-1"
              >
                <Save className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>{isCreating ? 'Creating Goal...' : 'Create Goal'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Preview Card */}
        {formData.name && formData.targetAmount && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700 mt-4 lg:mt-6">
            <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-3 lg:mb-4">
              Preview
            </h3>
            <div className="flex items-start space-x-3 lg:space-x-4">
              <div className={`w-10 h-10 lg:w-12 lg:h-12 ${colors.find(c => c.value === formData.color)?.bg || 'bg-blue-600'} rounded-lg flex items-center justify-center`}>
                <Target className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
                  {formData.name}
                </h4>
                <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-1 lg:mb-2">
                  {formData.category || 'No category selected'}
                </p>
                <p className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 mb-2 lg:mb-3">
                  {formData.description || 'No description provided'}
                </p>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs lg:text-sm gap-1 sm:gap-0">
                  <span className="text-gray-600 dark:text-gray-400">
                    Target: {formatCurrency(formData.targetAmount)}
                  </span>
                  {formData.deadline && (
                    <span className="text-gray-600 dark:text-gray-400">
                      Due: {new Date(formData.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateGoal;
