import { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  Target, 
  Award, 
  TrendingUp,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useTheme } from '../contexts/ThemeContext';

const Profile = () => {
  const { address, balance, disconnectWallet } = useWallet();
  const { isDark, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    bio: 'Passionate about financial wellness and decentralized savings.',
    avatar: '👤',
    joinDate: '2024-01-15',
    preferences: {
      notifications: true,
      darkMode: isDark,
      currency: 'USD',
      language: 'en'
    }
  });
  const [editForm, setEditForm] = useState(userProfile);

  const stats = {
    totalGoals: 8,
    completedGoals: 5,
    totalSaved: 15750,
    currentStreak: 45,
    longestStreak: 78,
    rewardsEarned: 12,
    joinDate: '2024-01-15'
  };

  const achievements = [
    { name: 'First Goal', earned: true, date: '2024-02-01' },
    { name: 'Consistent Saver', earned: true, date: '2024-03-15' },
    { name: 'Goal Crusher', earned: true, date: '2024-04-20' },
    { name: 'Community Helper', earned: false, date: null },
    { name: 'Early Bird', earned: true, date: '2024-05-10' },
    { name: 'Legendary Saver', earned: false, date: null }
  ];

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
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSaveProfile = () => {
    setUserProfile(editForm);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm(userProfile);
    setIsEditing(false);
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-accent-900 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-accent-600 dark:text-accent-400">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="card mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="text-center lg:text-left">
              <div className="w-24 h-24 bg-gradient-emerald rounded-2xl flex items-center justify-center text-4xl mb-4 mx-auto lg:mx-0">
                {userProfile.avatar}
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary flex items-center space-x-2 mx-auto lg:mx-0"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-accent-700 dark:text-accent-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full px-4 py-3 bg-white dark:bg-accent-900 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-accent-700 dark:text-accent-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 bg-white dark:bg-accent-900 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveProfile}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="btn-secondary flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-accent-900 dark:text-white mb-2">
                    {userProfile.name}
                  </h2>
                  <p className="text-accent-600 dark:text-accent-400 mb-4">
                    {userProfile.bio}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-accent-600 dark:text-accent-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {formatDate(userProfile.joinDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{address.slice(0, 6)}...{address.slice(-4)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-emerald rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-accent-900 dark:text-white">
              {stats.totalGoals}
            </p>
            <p className="text-sm text-accent-600 dark:text-accent-400">
              Total Goals
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-teal rounded-xl flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-accent-900 dark:text-white">
              {stats.completedGoals}
            </p>
            <p className="text-sm text-accent-600 dark:text-accent-400">
              Completed
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-accent-900 dark:text-white">
              {formatCurrency(stats.totalSaved)}
            </p>
            <p className="text-sm text-accent-600 dark:text-accent-400">
              Total Saved
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-accent-900 dark:text-white">
              {stats.currentStreak}
            </p>
            <p className="text-sm text-accent-600 dark:text-accent-400">
              Day Streak
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-accent-900 dark:text-white">
              {stats.rewardsEarned}
            </p>
            <p className="text-sm text-accent-600 dark:text-accent-400">
              Rewards
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-accent-900 dark:text-white">
              {stats.longestStreak}
            </p>
            <p className="text-sm text-accent-600 dark:text-accent-400">
              Best Streak
            </p>
          </div>
        </div>

        {/* Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-accent-900 dark:text-white mb-4 flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Preferences</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-accent-900 dark:text-white">Dark Mode</p>
                  <p className="text-sm text-accent-600 dark:text-accent-400">Toggle dark theme</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDark ? 'bg-primary-600' : 'bg-accent-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDark ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-accent-900 dark:text-white">Notifications</p>
                  <p className="text-sm text-accent-600 dark:text-accent-400">Get updates about your goals</p>
                </div>
                <button
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    userProfile.preferences.notifications ? 'bg-primary-600' : 'bg-accent-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      userProfile.preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-accent-700 dark:text-accent-300 mb-2">
                  Currency
                </label>
                <select
                  value={userProfile.preferences.currency}
                  className="w-full px-4 py-3 bg-white dark:bg-accent-900 border border-accent-200 dark:border-accent-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CELO">CELO</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-accent-900 dark:text-white mb-4 flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Achievements</span>
            </h3>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-accent-50 dark:bg-accent-800 rounded-lg">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    achievement.earned ? 'bg-green-500' : 'bg-accent-200 dark:bg-accent-700'
                  }`}>
                    {achievement.earned ? (
                      <Award className="w-4 h-4 text-white" />
                    ) : (
                      <div className="w-2 h-2 bg-accent-400 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      achievement.earned ? 'text-accent-900 dark:text-white' : 'text-accent-600 dark:text-accent-400'
                    }`}>
                      {achievement.name}
                    </p>
                    {achievement.earned && achievement.date && (
                      <p className="text-sm text-accent-600 dark:text-accent-400">
                        Earned {formatDate(achievement.date)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-accent-900 dark:text-white mb-4 flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Account Actions</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 bg-accent-50 dark:bg-accent-800 rounded-xl hover:bg-accent-100 dark:hover:bg-accent-700 transition-colors">
              <HelpCircle className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              <div className="text-left">
                <p className="font-medium text-accent-900 dark:text-white">Help & Support</p>
                <p className="text-sm text-accent-600 dark:text-accent-400">Get help</p>
              </div>
            </button>

            <button className="flex items-center space-x-3 p-4 bg-accent-50 dark:bg-accent-800 rounded-xl hover:bg-accent-100 dark:hover:bg-accent-700 transition-colors">
              <Bell className="w-5 h-5 text-accent-600 dark:text-accent-400" />
              <div className="text-left">
                <p className="font-medium text-accent-900 dark:text-white">Notification Settings</p>
                <p className="text-sm text-accent-600 dark:text-accent-400">Manage alerts</p>
              </div>
            </button>

            <button
              onClick={handleDisconnect}
              className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div className="text-left">
                <p className="font-medium text-red-600 dark:text-red-400">Disconnect Wallet</p>
                <p className="text-sm text-red-500 dark:text-red-400">Sign out</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
