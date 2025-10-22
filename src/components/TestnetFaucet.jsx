import { useState } from 'react';
import { ExternalLink, Copy, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const TestnetFaucet = ({ address, onClose }) => {
  const [copied, setCopied] = useState(false);

  const faucetUrls = [
    {
      name: 'Celo Faucet',
      url: 'https://faucet.celo.org/alfajores',
      description: 'Official Celo testnet faucet'
    },
    {
      name: 'QuickNode Faucet',
      url: 'https://faucet.quicknode.com/celo/alfajores',
      description: 'Alternative faucet for Celo testnet'
    }
  ];

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success('Address copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy address');
    }
  };

  const openFaucet = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-accent-800 rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-accent-900 dark:text-white">
            Get Testnet Tokens
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent-100 dark:hover:bg-accent-700 rounded-lg transition-colors"
          >
            <span className="text-accent-600 dark:text-accent-400">✕</span>
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <p className="text-sm text-accent-700 dark:text-accent-300">
              You need CELO testnet tokens to use the app
            </p>
          </div>

          <div className="bg-accent-50 dark:bg-accent-900 rounded-lg p-3 mb-4">
            <p className="text-sm text-accent-600 dark:text-accent-400 mb-2">
              Your wallet address:
            </p>
            <div className="flex items-center space-x-2">
              <code className="flex-1 text-xs bg-white dark:bg-accent-800 p-2 rounded border text-accent-900 dark:text-white break-all">
                {address}
              </code>
              <button
                onClick={copyAddress}
                className="p-2 hover:bg-accent-100 dark:hover:bg-accent-700 rounded transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-accent-700 dark:text-accent-300">
              Available Faucets:
            </p>
            {faucetUrls.map((faucet, index) => (
              <div
                key={index}
                className="border border-accent-200 dark:border-accent-700 rounded-lg p-3 hover:bg-accent-50 dark:hover:bg-accent-900 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-accent-900 dark:text-white">
                      {faucet.name}
                    </p>
                    <p className="text-xs text-accent-600 dark:text-accent-400">
                      {faucet.description}
                    </p>
                  </div>
                  <button
                    onClick={() => openFaucet(faucet.url)}
                    className="p-2 hover:bg-primary-100 dark:hover:bg-primary-900 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 <strong>Tip:</strong> Copy your address and paste it into the faucet. You'll receive testnet CELO tokens that you can use to interact with the app.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestnetFaucet;
