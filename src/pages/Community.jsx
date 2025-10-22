import { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Crown,
  Target,
  Calendar,
  UserPlus,
  Share2,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const Community = () => {
  const [circles, setCircles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCircle, setNewCircle] = useState({
    name: '',
    description: '',
    targetAmount: '',
    deadline: '',
    maxMembers: '',
    category: 'General'
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockCircles = [
      {
        id: 1,
        name: 'Emergency Fund Squad',
        description: 'Building emergency funds together for financial security',
        targetAmount: 5000,
        currentAmount: 12500,
        deadline: '2024-08-15',
        maxMembers: 10,
        currentMembers: 7,
        category: 'Emergency',
        status: 'active',
        creator: 'Alice Johnson',
        members: [
          { name: 'Alice Johnson', avatar: '👩', role: 'creator' },
          { name: 'Bob Smith', avatar: '👨', role: 'member' },
          { name: 'Carol Davis', avatar: '👩', role: 'member' },
          { name: 'David Wilson', avatar: '👨', role: 'member' },
          { name: 'Eva Brown', avatar: '👩', role: 'member' },
          { name: 'Frank Miller', avatar: '👨', role: 'member' },
          { name: 'Grace Lee', avatar: '👩', role: 'member' }
        ],
        progress: 83,
        color: 'emerald'
      },
      {
        id: 2,
        name: 'Vacation Dreamers',
        description: 'Saving for amazing vacations around the world',
        targetAmount: 3000,
        currentAmount: 2100,
        deadline: '2024-07-20',
        maxMembers: 8,
        currentMembers: 5,
        category: 'Travel',
        status: 'active',
        creator: 'Mike Chen',
        members: [
          { name: 'Mike Chen', avatar: '👨', role: 'creator' },
          { name: 'Sarah Kim', avatar: '👩', role: 'member' },
          { name: 'Tom Anderson', avatar: '👨', role: 'member' },
          { name: 'Lisa Garcia', avatar: '👩', role: 'member' },
          { name: 'John Taylor', avatar: '👨', role: 'member' }
        ],
        progress: 70,
        color: 'blue'
      },
      {
        id: 3,
        name: 'Tech Upgrade Crew',
        description: 'Saving for the latest gadgets and tech upgrades',
        targetAmount: 2000,
        currentAmount: 2000,
        deadline: '2024-05-10',
        maxMembers: 6,
        currentMembers: 6,
        category: 'Technology',
        status: 'completed',
        creator: 'Emma Wilson',
        members: [
          { name: 'Emma Wilson', avatar: '👩', role: 'creator' },
          { name: 'Alex Rodriguez', avatar: '👨', role: 'member' },
          { name: 'Maya Patel', avatar: '👩', role: 'member' },
          { name: 'Ryan O\'Connor', avatar: '👨', role: 'member' },
          { name: 'Zoe Thompson', avatar: '👩', role: 'member' },
          { name: 'Kevin Park', avatar: '👨', role: 'member' }
        ],
        progress: 100,
        color: 'purple'
      },
      {
        id: 4,
        name: 'Home Sweet Home',
        description: 'Saving for home improvements and renovations',
        targetAmount: 10000,
        currentAmount: 3500,
        deadline: '2024-12-31',
        maxMembers: 12,
        currentMembers: 8,
        category: 'Home',
        status: 'active',
        creator: 'Jennifer Adams',
        members: [
          { name: 'Jennifer Adams', avatar: '👩', role: 'creator' },
          { name: 'Robert Clark', avatar: '👨', role: 'member' },
          { name: 'Maria Rodriguez', avatar: '👩', role: 'member' },
          { name: 'James White', avatar: '👨', role: 'member' },
          { name: 'Anna Johnson', avatar: '👩', role: 'member' },
          { name: 'Michael Brown', avatar: '👨', role: 'member' },
          { name: 'Susan Davis', avatar: '👩', role: 'member' },
          { name: 'William Miller', avatar: '👨', role: 'member' }
        ],
        progress: 35,
        color: 'orange'
      }
    ];
    
    setTimeout(() => {
      setCircles(mockCircles);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredCircles = circles.filter(circle => {
    const matchesSearch = circle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         circle.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || circle.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleJoinCircle = (circleId) => {
    toast.success('Successfully joined the savings circle!');
    // In a real app, this would update the circle membership
  };

  const handleCreateCircle = () => {
    if (!newCircle.name || !newCircle.description || !newCircle.targetAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const circle = {
      id: circles.length + 1,
      ...newCircle,
      targetAmount: parseFloat(newCircle.targetAmount),
      maxMembers: parseInt(newCircle.maxMembers),
      currentAmount: 0,
      currentMembers: 1,
      status: 'active',
      creator: 'You',
      members: [{ name: 'You', avatar: '👤', role: 'creator' }],
      progress: 0,
      color: 'emerald'
    };

    setCircles([circle, ...circles]);
    setShowCreateModal(false);
    setNewCircle({
      name: '',
      description: '',
      targetAmount: '',
      deadline: '',
      maxMembers: '',
      category: 'General'
    });
    toast.success('Savings circle created successfully!');
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
          <p className="text-accent-600 dark:text-accent-400">Loading savings circles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-accent-900 dark:text-white mb-2">
            Savings Circles 👥
          </h1>
          <p className="text-accent-600 dark:text-accent-400">
            Join community savings goals and achieve your dreams together
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-emerald rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-accent-900 dark:text-white">
              {circles.length}
            </p>
            <p className="text-sm text-accent-600 dark:text-accent-400">
              Active Circles
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-teal rounded-xl flex items-center justify-center mx-auto mb-3">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-accent-900 dark:text-white">
              {circles.reduce((sum, circle) => sum + circle.currentMembers, 0)}
            </p>
            <p className="text-sm text-accent-600 dark:text-accent-400">
              Total Members
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-accent-900 dark:text-white">
              {formatCurrency(circles.reduce((sum, circle) => sum + circle.currentAmount, 0))}
            </p>
            <p className="text-sm text-accent-600 dark:text-accent-400">
              Total Saved
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-accent-900 dark:text-white">
              {circles.filter(c => c.status === 'completed').length}
            </p>
            <p className="text-sm text-accent-600 dark:text-accent-400">
              Completed
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search circles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-accent-800 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-400 w-5 h-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-3 bg-white dark:bg-accent-800 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Circles</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="recruiting">Recruiting</option>
            </select>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center space-x-2 px-6 py-3"
          >
            <Plus className="w-5 h-5" />
            <span>Create Circle</span>
          </button>
        </div>

        {/* Circles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCircles.map((circle) => {
            const daysLeft = getDaysLeft(circle.deadline);
            const isFull = circle.currentMembers >= circle.maxMembers;
            
            return (
              <div key={circle.id} className="card hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-accent-900 dark:text-white mb-2">
                      {circle.name}
                    </h3>
                    <p className="text-accent-600 dark:text-accent-400 text-sm mb-3">
                      {circle.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-accent-600 dark:text-accent-400">
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4" />
                        <span>{circle.category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{daysLeft} days left</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    circle.status === 'completed' 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  }`}>
                    {circle.status}
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-accent-600 dark:text-accent-400">Progress</span>
                    <span className="text-sm font-medium text-accent-900 dark:text-white">
                      {circle.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-accent-200 dark:bg-accent-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${circle.progress}%`,
                        backgroundColor: getProgressColor(circle.progress)
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-sm">
                    <span className="text-accent-600 dark:text-accent-400">
                      {formatCurrency(circle.currentAmount)}
                    </span>
                    <span className="text-accent-600 dark:text-accent-400">
                      {formatCurrency(circle.targetAmount)}
                    </span>
                  </div>
                </div>

                {/* Members */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-accent-600 dark:text-accent-400">Members</span>
                    <span className="text-sm font-medium text-accent-900 dark:text-white">
                      {circle.currentMembers}/{circle.maxMembers}
                    </span>
                  </div>
                  <div className="flex -space-x-2">
                    {circle.members.slice(0, 5).map((member, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 bg-gradient-emerald rounded-full flex items-center justify-center text-white text-sm border-2 border-white dark:border-accent-800"
                        title={member.name}
                      >
                        {member.avatar}
                      </div>
                    ))}
                    {circle.currentMembers > 5 && (
                      <div className="w-8 h-8 bg-accent-200 dark:bg-accent-700 rounded-full flex items-center justify-center text-accent-600 dark:text-accent-400 text-xs border-2 border-white dark:border-accent-800">
                        +{circle.currentMembers - 5}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  {circle.status === 'active' && !isFull ? (
                    <button
                      onClick={() => handleJoinCircle(circle.id)}
                      className="flex-1 btn-primary text-sm py-2"
                    >
                      Join Circle
                    </button>
                  ) : circle.status === 'completed' ? (
                    <button className="flex-1 btn-secondary text-sm py-2" disabled>
                      Completed
                    </button>
                  ) : (
                    <button className="flex-1 btn-secondary text-sm py-2" disabled>
                      Circle Full
                    </button>
                  )}
                  
                  <button className="p-2 bg-accent-100 dark:bg-accent-800 rounded-lg hover:bg-accent-200 dark:hover:bg-accent-700 transition-colors">
                    <Share2 className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCircles.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-accent-100 dark:bg-accent-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-12 h-12 text-accent-400" />
            </div>
            <h3 className="text-xl font-semibold text-accent-900 dark:text-white mb-2">
              No circles found
            </h3>
            <p className="text-accent-600 dark:text-accent-400 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Be the first to create a savings circle!'
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Circle</span>
            </button>
          </div>
        )}
      </div>

      {/* Create Circle Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-accent-800 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-accent-900 dark:text-white mb-4">
              Create Savings Circle
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-accent-700 dark:text-accent-300 mb-2">
                  Circle Name *
                </label>
                <input
                  type="text"
                  value={newCircle.name}
                  onChange={(e) => setNewCircle({...newCircle, name: e.target.value})}
                  placeholder="Enter circle name"
                  className="w-full px-4 py-3 bg-white dark:bg-accent-900 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-accent-700 dark:text-accent-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={newCircle.description}
                  onChange={(e) => setNewCircle({...newCircle, description: e.target.value})}
                  placeholder="Describe your savings goal"
                  rows={3}
                  className="w-full px-4 py-3 bg-white dark:bg-accent-900 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-accent-700 dark:text-accent-300 mb-2">
                  Target Amount *
                </label>
                <input
                  type="number"
                  value={newCircle.targetAmount}
                  onChange={(e) => setNewCircle({...newCircle, targetAmount: e.target.value})}
                  placeholder="Enter target amount"
                  className="w-full px-4 py-3 bg-white dark:bg-accent-900 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-accent-700 dark:text-accent-300 mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  value={newCircle.deadline}
                  onChange={(e) => setNewCircle({...newCircle, deadline: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-accent-900 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-accent-700 dark:text-accent-300 mb-2">
                  Max Members
                </label>
                <input
                  type="number"
                  value={newCircle.maxMembers}
                  onChange={(e) => setNewCircle({...newCircle, maxMembers: e.target.value})}
                  placeholder="Maximum number of members"
                  className="w-full px-4 py-3 bg-white dark:bg-accent-900 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-accent-700 dark:text-accent-300 mb-2">
                  Category
                </label>
                <select
                  value={newCircle.category}
                  onChange={(e) => setNewCircle({...newCircle, category: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-accent-900 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="General">General</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Travel">Travel</option>
                  <option value="Technology">Technology</option>
                  <option value="Home">Home</option>
                  <option value="Education">Education</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCircle}
                  className="flex-1 btn-primary"
                >
                  Create Circle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;