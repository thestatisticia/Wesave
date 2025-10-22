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
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/app')}
            className="flex items-center space-x-2 text-accent-600 dark:text-accent-400 hover:text-accent-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-emerald rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-accent-900 dark:text-white">
              Create New Goal
            </h1>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Goal Name */}
            <div>
              <label htmlFor="goal-name" className="block text-sm font-medium text-accent-700 dark:text-accent-300 mb-2">
                Goal Name *
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-400 w-5 h-5" />
                <input
                  type="text"
                  id="goal-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Emergency Fund, Vacation to Japan"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-accent-900 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="goal-description" className="block text-sm font-medium text-accent-700 dark:text-accent-300 mb-2">
                Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-accent-400 w-5 h-5" />
                <textarea
                  id="goal-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your goal and why it's important to you..."
                  rows="3"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-accent-900 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Target Amount */}
            <div>
              <label htmlFor="target-amount" className="block text-sm font-medium text-accent-700 dark:text-accent-300 mb-2">
                Target Amount *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-400 w-5 h-5" />
                <input
                  type="number"
                  id="target-amount"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="1"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-accent-900 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              {formData.targetAmount && (
                <p className="mt-2 text-sm text-accent-600 dark:text-accent-400">
                  Target: {formatCurrency(formData.targetAmount)}
                </p>
              )}
            </div>

            {/* Deadline */}
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-accent-700 dark:text-accent-300 mb-2">
                Deadline *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-400 w-5 h-5" />
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-accent-900 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-accent-700 dark:text-accent-300 mb-2">
                Category *
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-400 w-5 h-5" />
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-8 py-3 bg-white dark:bg-accent-900 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
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
              <label className="block text-sm font-medium text-accent-700 dark:text-accent-300 mb-3">
                Color Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                {colors.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.color === color.value 
                        ? 'border-primary-500 shadow-lg' 
                        : 'border-accent-200 dark:border-accent-700 hover:border-accent-300 dark:hover:border-accent-600'
                    }`}
                  >
                    <div className={`w-full h-8 ${color.bg} rounded-lg mb-2`}></div>
                    <span className="text-xs font-medium text-accent-700 dark:text-accent-300 capitalize">
                      {color.name}
                    </span>
                    {formData.color === color.value && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-accent-200 dark:border-accent-700">
              <button
                type="button"
                onClick={() => navigate('/app')}
                className="btn-secondary flex items-center justify-center space-x-2 flex-1"
              >
                <X className="w-5 h-5" />
                <span>Cancel</span>
              </button>
              
              <button
                type="submit"
                disabled={isCreating}
                className="btn-primary flex items-center justify-center space-x-2 flex-1"
              >
                <Save className="w-5 h-5" />
                <span>{isCreating ? 'Creating Goal...' : 'Create Goal'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Preview Card */}
        {formData.name && formData.targetAmount && (
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-accent-900 dark:text-white mb-4">
              Preview
            </h3>
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 ${colors.find(c => c.value === formData.color)?.bg || 'bg-gradient-emerald'} rounded-xl flex items-center justify-center`}>
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-accent-900 dark:text-white">
                  {formData.name}
                </h4>
                <p className="text-accent-600 dark:text-accent-400 mb-2">
                  {formData.category || 'No category selected'}
                </p>
                <p className="text-sm text-accent-700 dark:text-accent-300 mb-3">
                  {formData.description || 'No description provided'}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-accent-600 dark:text-accent-400">
                    Target: {formatCurrency(formData.targetAmount)}
                  </span>
                  {formData.deadline && (
                    <span className="text-accent-600 dark:text-accent-400">
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
