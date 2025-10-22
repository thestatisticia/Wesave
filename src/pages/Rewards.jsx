import { useState, useEffect } from 'react';
import { 
  Award, 
  Trophy, 
  Star, 
  Zap, 
  Crown,
  Target,
  Calendar,
  Share2,
  Download,
  Filter,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';

const Rewards = () => {
  const [rewards, setRewards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockRewards = [
      {
        id: 1,
        name: 'First Goal Achiever',
        description: 'Completed your first savings goal',
        type: 'milestone',
        rarity: 'common',
        earnedDate: '2024-03-10',
        goalName: 'New Laptop',
        image: '🏆',
        color: 'emerald'
      },
      {
        id: 2,
        name: 'Emergency Fund Master',
        description: 'Built a $5,000 emergency fund',
        type: 'achievement',
        rarity: 'rare',
        earnedDate: '2024-04-15',
        goalName: 'Emergency Fund',
        image: '🛡️',
        color: 'blue'
      },
      {
        id: 3,
        name: 'Consistent Saver',
        description: 'Made deposits for 30 consecutive days',
        type: 'streak',
        rarity: 'epic',
        earnedDate: '2024-05-01',
        goalName: 'Multiple Goals',
        image: '⚡',
        color: 'purple'
      },
      {
        id: 4,
        name: 'Goal Crusher',
        description: 'Completed 5 savings goals',
        type: 'achievement',
        rarity: 'legendary',
        earnedDate: '2024-05-20',
        goalName: 'Various Goals',
        image: '👑',
        color: 'gold'
      },
      {
        id: 5,
        name: 'Community Helper',
        description: 'Helped 3 friends reach their goals',
        type: 'social',
        rarity: 'rare',
        earnedDate: '2024-06-01',
        goalName: 'Community Goals',
        image: '🤝',
        color: 'pink'
      },
      {
        id: 6,
        name: 'Early Bird',
        description: 'Completed a goal 30 days early',
        type: 'achievement',
        rarity: 'epic',
        earnedDate: '2024-06-10',
        goalName: 'Vacation Fund',
        image: '🐦',
        color: 'orange'
      }
    ];
    
    setTimeout(() => {
      setRewards(mockRewards);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredRewards = rewards.filter(reward => {
    const matchesSearch = reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reward.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || reward.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 dark:text-gray-400';
      case 'rare': return 'text-blue-600 dark:text-blue-400';
      case 'epic': return 'text-purple-600 dark:text-purple-400';
      case 'legendary': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getRarityBg = (rarity) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 dark:bg-gray-800';
      case 'rare': return 'bg-blue-100 dark:bg-blue-900/20';
      case 'epic': return 'bg-purple-100 dark:bg-purple-900/20';
      case 'legendary': return 'bg-yellow-100 dark:bg-yellow-900/20';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'milestone': return Target;
      case 'achievement': return Trophy;
      case 'streak': return Zap;
      case 'social': return Share2;
      default: return Award;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShareReward = (reward) => {
    if (navigator.share) {
      navigator.share({
        title: `I earned "${reward.name}" on Celo Savings Rings!`,
        text: reward.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`I earned "${reward.name}" on Celo Savings Rings! ${reward.description}`);
      toast.success('Reward copied to clipboard!');
    }
  };

  const handleDownloadNFT = (reward) => {
    toast.success('NFT download started!');
    // In a real app, this would trigger NFT download
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-accent-600 dark:text-accent-400">Loading your rewards...</p>
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
            Your Rewards 🏆
          </h1>
          <p className="text-accent-600 dark:text-accent-400">
            Celebrate your savings achievements with unique NFT badges
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-emerald rounded-xl flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-accent-900 dark:text-white">
              {rewards.length}
            </p>
            <p className="text-sm text-accent-600 dark:text-accent-400">
              Total Rewards
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-teal rounded-xl flex items-center justify-center mx-auto mb-3">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-accent-900 dark:text-white">
              {rewards.filter(r => r.type === 'achievement').length}
            </p>
            <p className="text-sm text-accent-600 dark:text-accent-400">
              Achievements
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-accent-900 dark:text-white">
              {rewards.filter(r => r.type === 'streak').length}
            </p>
            <p className="text-sm text-accent-600 dark:text-accent-400">
              Streaks
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-accent-900 dark:text-white">
              {rewards.filter(r => r.rarity === 'legendary').length}
            </p>
            <p className="text-sm text-accent-600 dark:text-accent-400">
              Legendary
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search rewards..."
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
              <option value="all">All Types</option>
              <option value="milestone">Milestones</option>
              <option value="achievement">Achievements</option>
              <option value="streak">Streaks</option>
              <option value="social">Social</option>
            </select>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map((reward) => {
            const TypeIcon = getTypeIcon(reward.type);
            
            return (
              <div
                key={reward.id}
                className={`card hover:shadow-2xl transition-all duration-300 ${getRarityBg(reward.rarity)}`}
              >
                <div className="text-center mb-4">
                  <div className="text-6xl mb-4">{reward.image}</div>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <TypeIcon className="w-5 h-5 text-accent-500" />
                    <span className={`text-sm font-medium uppercase tracking-wide ${getRarityColor(reward.rarity)}`}>
                      {reward.rarity}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-accent-900 dark:text-white mb-2">
                    {reward.name}
                  </h3>
                  <p className="text-accent-600 dark:text-accent-400 mb-4">
                    {reward.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-accent-600 dark:text-accent-400">Earned</span>
                    <span className="text-accent-900 dark:text-white font-medium">
                      {formatDate(reward.earnedDate)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-accent-600 dark:text-accent-400">Goal</span>
                    <span className="text-accent-900 dark:text-white font-medium">
                      {reward.goalName}
                    </span>
                  </div>

                  <div className="flex space-x-2 pt-3">
                    <button
                      onClick={() => handleShareReward(reward)}
                      className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-white dark:bg-accent-800 border border-accent-200 dark:border-accent-700 rounded-lg hover:bg-accent-50 dark:hover:bg-accent-700 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-sm">Share</span>
                    </button>
                    <button
                      onClick={() => handleDownloadNFT(reward)}
                      className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-gradient-emerald text-white rounded-lg hover:bg-gradient-teal transition-all duration-300"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Download</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredRewards.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-accent-100 dark:bg-accent-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-12 h-12 text-accent-400" />
            </div>
            <h3 className="text-xl font-semibold text-accent-900 dark:text-white mb-2">
              No rewards found
            </h3>
            <p className="text-accent-600 dark:text-accent-400 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Complete your first savings goal to earn your first reward!'
              }
            </p>
            <button className="btn-primary">
              Start Saving
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;
