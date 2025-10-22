/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createPublicClient, http, formatEther } from 'viem';
import { celoAlfajores } from 'viem/chains';
import toast from 'react-hot-toast';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('0');
  const [isConnecting, setIsConnecting] = useState(false);
  const [network, setNetwork] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  // Celo Alfajores testnet configuration
  const CELO_TESTNET_CONFIG = {
    chainId: '0xaef3', // 44787 in decimal
    chainName: 'Celo Alfajores Testnet',
    nativeCurrency: {
      name: 'Celo',
      symbol: 'CELO',
      decimals: 18,
    },
    rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
    blockExplorerUrls: ['https://alfajores.celoscan.io/'],
  };

  // Initialize public client for Celo Alfajores testnet
  const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http(),
  });

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
  };

  // Switch to Celo Alfajores testnet
  const switchToCeloTestnet = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CELO_TESTNET_CONFIG.chainId }],
      });
      return true;
    } catch (switchError) {
      // If the network doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [CELO_TESTNET_CONFIG],
          });
          return true;
        } catch (addError) {
          console.error('Failed to add Celo testnet:', addError);
          throw new Error('Failed to add Celo Alfajores testnet to MetaMask');
        }
      } else {
        throw new Error('Failed to switch to Celo Alfajores testnet');
      }
    }
  };

  // Check current network
  const checkNetwork = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const isCorrect = chainId === CELO_TESTNET_CONFIG.chainId;
        setIsCorrectNetwork(isCorrect);
        setNetwork(chainId);
        return isCorrect;
      } catch (error) {
        console.error('Failed to check network:', error);
        return false;
      }
    }
    return false;
  }, [CELO_TESTNET_CONFIG.chainId]);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      if (!isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts.length > 0) {
        // Check and switch network
        const isCorrectNetwork = await checkNetwork();
        if (!isCorrectNetwork) {
          await switchToCeloTestnet();
          await checkNetwork(); // Re-check after switching
        }

        setAddress(accounts[0]);
        setIsConnected(true);
        
        // Get balance
        await refreshBalance();
        
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      let errorMessage = 'Failed to connect wallet';
      
      if (error.message.includes('User rejected')) {
        errorMessage = 'Connection rejected by user';
      } else if (error.message.includes('MetaMask')) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress('');
    setBalance('0');
  };

  const refreshBalance = useCallback(async () => {
    if (address && isCorrectNetwork) {
      try {
        const balance = await publicClient.getBalance({
          address: address,
        });
        const formattedBalance = formatEther(balance);
        setBalance(parseFloat(formattedBalance).toFixed(4));
      } catch (error) {
        console.error('Failed to refresh balance:', error);
        toast.error('Failed to fetch balance');
      }
    }
  }, [address, isCorrectNetwork, publicClient]);

  useEffect(() => {
    // Check if wallet is already connected
    if (typeof window.ethereum !== 'undefined') {
      const initializeWallet = async () => {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsConnected(true);
            await checkNetwork();
            if (isCorrectNetwork) {
              await refreshBalance();
            }
          }
        } catch (error) {
          console.error('Failed to initialize wallet:', error);
        }
      };

      initializeWallet();

      // Listen for account changes
      window.ethereum.on('accountsChanged', async (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
          toast.info('Wallet disconnected');
        } else {
          setAddress(accounts[0]);
          await checkNetwork();
          if (isCorrectNetwork) {
            await refreshBalance();
          }
          toast.info('Account changed');
        }
      });

      // Listen for network changes
      window.ethereum.on('chainChanged', async (chainId) => {
        setNetwork(chainId);
        const isCorrect = chainId === CELO_TESTNET_CONFIG.chainId;
        setIsCorrectNetwork(isCorrect);
        
        if (isCorrect && address) {
          await refreshBalance();
          toast.success('Switched to Celo Alfajores testnet');
        } else if (address) {
          toast.error('Please switch to Celo Alfajores testnet');
        }
      });
    }

    // Cleanup event listeners
    return () => {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, [address, isCorrectNetwork, CELO_TESTNET_CONFIG.chainId, checkNetwork, refreshBalance]);

  const value = {
    isConnected,
    address,
    balance,
    isConnecting,
    network,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    refreshBalance,
    switchToCeloTestnet,
    checkNetwork,
    publicClient,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
