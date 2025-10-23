import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Target, 
  Lock, 
  Award, 
  Users, 
  ArrowRight, 
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  Wallet
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useWallet } from '../contexts/WalletContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
  const { connectWallet, isConnected, isCorrectNetwork, switchToCeloTestnet, isConnecting, address, balance } = useWallet();

  const handleGetStarted = () => {
    // Always navigate to app, regardless of wallet connection status
    navigate('/app');
  };

  const handleConnectWallet = async () => {
    if (!isConnected) {
      try {
        await connectWallet();
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else if (!isCorrectNetwork) {
      try {
        await switchToCeloTestnet();
      } catch (error) {
        console.error('Failed to switch network:', error);
      }
    }
  };

  const features = [
    {
      icon: Target,
      title: 'Smart Goals',
      description: 'Set personalized savings targets with visual progress tracking'
    },
    {
      icon: Lock,
      title: 'Secure Savings',
      description: 'Lock funds until goals are reached or maturity date'
    },
    {
      icon: Award,
      title: 'NFT Rewards',
      description: 'Earn unique badges for completing savings milestones'
    },
    {
      icon: Users,
      title: 'Community Circles',
      description: 'Join group savings challenges with friends and family'
    }
  ];

  const stats = [
    { label: 'Active Savers', value: '10,000+' },
    { label: 'Goals Completed', value: '50,000+' },
    { label: 'Total Saved', value: '$2.5M+' },
    { label: 'NFTs Minted', value: '25,000+' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-4 lg:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <span className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">WeSave</span>
          </div>
          
          <div className="flex items-center space-x-2 lg:space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
            </button>
            
            <div className="flex items-center space-x-2 lg:space-x-3">
              {/* Wallet Info (if connected) */}
              {isConnected && (
                <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <Wallet className="w-4 h-4 text-blue-600" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </p>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {balance} CELO
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Connect Wallet Button */}
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="flex items-center space-x-2 px-3 lg:px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-lg transition-colors text-sm lg:text-base"
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isConnecting 
                    ? 'Connecting...' 
                    : !isConnected 
                      ? 'Connect Wallet' 
                      : !isCorrectNetwork 
                        ? 'Switch Network' 
                        : 'Connected'
                  }
                </span>
                <span className="sm:hidden">
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </span>
              </button>

              {/* Go to App Button */}
              <button
                onClick={handleGetStarted}
                className="flex items-center space-x-2 px-3 lg:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm lg:text-base"
              >
                <span className="hidden sm:inline">Go to App</span>
                <span className="sm:hidden">App</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 lg:pt-32 pb-12 lg:pb-20 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 lg:mb-6">
              <span className="text-blue-600">WeSave</span>
              <br />
              <span className="text-gray-900 dark:text-white">Together</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Transform your savings journey with decentralized goal tracking, 
              visual progress rings, and rewarding NFT achievements on Celo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6 mb-12 lg:mb-16">
            <button
              onClick={handleGetStarted}
              className="flex items-center justify-center space-x-2 px-6 lg:px-8 py-3 lg:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-base lg:text-lg w-full sm:w-auto"
            >
              <span>Start Saving Today</span>
              <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
            
            <button className="flex items-center justify-center space-x-2 px-6 lg:px-8 py-3 lg:py-4 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-base lg:text-lg w-full sm:w-auto">
              <span>Learn More</span>
              <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5" />
            </button>
          </div>

          {/* Hero Image/Animation */}
          <div className="relative max-w-4xl mx-auto">
            <div className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="w-16 h-16 lg:w-24 lg:h-24 mx-auto mb-3 lg:mb-4 relative">
                      <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center">
                        <Target className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
                      </div>
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white mb-2">Goal {i}</h3>
                    <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 mb-3 lg:mb-4">$1,000 Target</p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${i * 30}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 lg:py-20 px-4 lg:px-6 bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 lg:mb-6">
              <span className="text-blue-600">Why Choose</span> WeSave?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Experience the future of decentralized savings with innovative features 
              designed to make your financial goals achievable and rewarding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 lg:p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 lg:mb-6">
                    <Icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="text-base lg:text-xl font-semibold text-gray-900 dark:text-white mb-3 lg:mb-4">{feature.title}</h3>
                  <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 lg:py-20 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm lg:text-lg text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-20 px-4 lg:px-6 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 lg:mb-6">
            Ready to Start Your Savings Journey?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-6 lg:mb-8">
            Join thousands of users already achieving their financial goals with WeSave.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-6 lg:px-8 py-3 lg:py-4 rounded-lg transition-colors text-base lg:text-lg flex items-center justify-center space-x-2 mx-auto"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 lg:py-12 px-4 lg:px-6 bg-gray-900 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4 lg:mb-6">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </div>
            <span className="text-lg lg:text-xl font-bold text-white">WeSave</span>
          </div>
          <p className="text-sm lg:text-base text-gray-400">
            Built on Celo • Powered by DeFi • Secured by Blockchain
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
