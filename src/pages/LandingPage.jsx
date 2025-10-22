import { useState } from 'react';
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
  const { isDark, toggleTheme } = useTheme();
  const { connectWallet, isConnected, isCorrectNetwork, switchToCeloTestnet, isConnecting } = useWallet();

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
    <div className="min-h-screen bg-accent-900">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-neon rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">WeSave</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-accent-800 shadow-lg border border-accent-700 hover:shadow-xl transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 text-neon-green" />
            </button>
            
            <div className="flex items-center space-x-3">
              {/* Wallet Info (if connected) */}
              {isConnected && (
                <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-accent-800 rounded-xl shadow-lg border border-accent-700">
                  <Wallet className="w-4 h-4 text-neon-green" />
                  <div className="text-sm">
                    <p className="font-medium text-white">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </p>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <p className="text-xs text-gray-400">
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
                className="btn-secondary flex items-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>
                  {isConnecting 
                    ? 'Connecting...' 
                    : !isConnected 
                      ? 'Connect Wallet' 
                      : !isCorrectNetwork 
                        ? 'Switch Network' 
                        : 'Connected'
                  }
                </span>
              </button>

              {/* Go to App Button */}
              <button
                onClick={handleGetStarted}
                className="btn-primary flex items-center space-x-2"
              >
                <span>Go to App</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">WeSave</span>
              <br />
              <span className="text-white">Together</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your savings journey with decentralized goal tracking, 
              visual progress rings, and rewarding NFT achievements on Celo.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <button
              onClick={handleGetStarted}
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-3"
            >
              <span>Start Saving Today</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button className="btn-secondary text-lg px-8 py-4 flex items-center space-x-3">
              <span>Learn More</span>
              <TrendingUp className="w-5 h-5" />
            </button>
          </div>

          {/* Hero Image/Animation */}
          <div className="relative max-w-4xl mx-auto">
            <div className="relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card animate-fade-in" style={{ animationDelay: `${i * 0.2}s` }}>
                    <div className="w-24 h-24 mx-auto mb-4 relative">
                      <div className="w-full h-full rounded-full bg-gradient-emerald flex items-center justify-center animate-pulse-ring">
                        <Target className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Goal {i}</h3>
                    <p className="text-sm text-accent-600 dark:text-accent-400">$1,000 Target</p>
                    <div className="mt-4 w-full bg-accent-200 dark:bg-accent-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-emerald h-2 rounded-full transition-all duration-1000"
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
      <section className="py-20 px-6 bg-accent-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">Why Choose</span> WeSave?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of decentralized savings with innovative features 
              designed to make your financial goals achievable and rewarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card text-center hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 bg-gradient-neon rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-lg text-accent-600 dark:text-accent-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-emerald">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your Savings Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users already achieving their financial goals with WeSave.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-primary-600 hover:bg-primary-50 font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center space-x-3 mx-auto"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-accent-900 dark:bg-accent-950">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-gradient-emerald rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">WeSave</span>
          </div>
          <p className="text-accent-400">
            Built on Celo • Powered by DeFi • Secured by Blockchain
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
