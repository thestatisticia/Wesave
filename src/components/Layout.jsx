import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { 
  Home, 
  Target, 
  Award, 
  User, 
  Users, 
  Wallet, 
  Moon, 
  Sun, 
  Menu, 
  X,
  LogOut,
  Coins
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useWallet } from '../contexts/WalletContext';
import TestnetFaucet from './TestnetFaucet';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { isConnected, address, balance, disconnectWallet, isCorrectNetwork, connectWallet, switchToCeloTestnet, isConnecting } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFaucet, setShowFaucet] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/app', icon: Home },
    { name: 'Goals', href: '/app/goals', icon: Target },
    { name: 'Rewards', href: '/app/rewards', icon: Award },
    { name: 'Community', href: '/app/community', icon: Users },
    { name: 'Profile', href: '/app/profile', icon: User },
  ];

  const isActive = (path) => {
    if (path === '/app') {
      return location.pathname === '/app';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    disconnectWallet();
    navigate('/');
  };

  const handleWalletAction = async () => {
    if (!isConnected) {
      // Connect wallet
      try {
        await connectWallet();
      } catch (error) {
        console.error('Failed to connect wallet:', error);
      }
    } else if (!isCorrectNetwork) {
      // Switch to correct network
      try {
        await switchToCeloTestnet();
      } catch (error) {
        console.error('Failed to switch network:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-accent-900 dark:to-accent-800">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-xl bg-white dark:bg-accent-800 shadow-lg border border-accent-200 dark:border-accent-700"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Wallet Connection Button - Top Right */}
      <div className="fixed top-4 right-4 z-50">
        {isConnected ? (
          <div className="flex items-center space-x-3">
            {/* Wallet Info */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-white dark:bg-accent-800 rounded-xl shadow-lg border border-accent-200 dark:border-accent-700">
              <Wallet className="w-4 h-4 text-neon-green" />
              <div className="text-sm">
                <p className="font-medium text-accent-900 dark:text-white">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <p className="text-xs text-accent-600 dark:text-accent-400">
                    {balance} CELO
                  </p>
                </div>
              </div>
            </div>

            {/* Network Switch Button */}
            {!isCorrectNetwork && (
              <button
                onClick={handleWalletAction}
                disabled={isConnecting}
                className="px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white text-sm font-medium rounded-xl transition-colors"
              >
                {isConnecting ? 'Switching...' : 'Switch Network'}
              </button>
            )}

            {/* Faucet Button for Zero Balance */}
            {isCorrectNetwork && parseFloat(balance) === 0 && (
              <button
                onClick={() => setShowFaucet(true)}
                className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                <Coins className="w-4 h-4 inline mr-1" />
                Get Tokens
              </button>
            )}

            {/* Disconnect Button */}
            <button
              onClick={handleLogout}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
              title="Disconnect Wallet"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleWalletAction}
            disabled={isConnecting}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-neon text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-neon-green/25 disabled:opacity-50"
          >
            <Wallet className="w-4 h-4" />
            <span className="font-medium">
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </span>
          </button>
        )}
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-accent-800 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-6 border-b border-accent-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-neon rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">WeSave</span>
            </div>
          </div>


          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-neon text-white shadow-lg shadow-neon-green/25'
                      : 'text-gray-300 hover:bg-accent-700 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Theme toggle and logout */}
          <div className="p-4 border-t border-accent-700 space-y-2">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-accent-700 hover:text-white transition-all duration-200"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
              <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            
            {isConnected && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all duration-200"
              >
                <LogOut size={20} />
                <span className="font-medium">Disconnect</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-accent-900 dark:to-accent-800">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Testnet Faucet Modal */}
      {showFaucet && (
        <TestnetFaucet
          address={address}
          onClose={() => setShowFaucet(false)}
        />
      )}
    </div>
  );
};

export default Layout;
