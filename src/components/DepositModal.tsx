import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { CryptoCurrency, WalletAddress } from '../types/wallet';
import {
  X,
  Copy,
  QrCode,
  ArrowDownLeft,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Info,
  Bitcoin,
  DollarSign
} from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCurrency?: CryptoCurrency;
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  initialCurrency = 'BTC'
}) => {
  const {
    config,
    addresses,
    generateAddress,
    getAddresses,
    isLoading
  } = useWallet();

  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency>(initialCurrency);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [depositAddress, setDepositAddress] = useState<WalletAddress | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // 获取币种信息
  const getCurrencyInfo = (symbol: CryptoCurrency) => {
    return config.supportedCurrencies.find(c => c.symbol === symbol);
  };

  // 获取币种图标
  const getCurrencyIcon = (currency: CryptoCurrency) => {
    const icons = {
      BTC: <Bitcoin className="w-5 h-5 text-orange-500" />,
      ETH: <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Ξ</div>,
      USDT: <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">₮</div>,
      BNB: <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">B</div>,
      ADA: <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>,
      DOT: <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">•</div>
    };
    return icons[currency] || <DollarSign className="w-5 h-5 text-gray-500" />;
  };

  // 复制地址
  const copyAddress = async () => {
    if (!depositAddress) return;
    
    try {
      await navigator.clipboard.writeText(depositAddress.address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 生成新地址
  const handleGenerateAddress = async () => {
    if (!selectedNetwork) return;
    
    setIsGenerating(true);
    try {
      const newAddress = await generateAddress(selectedCurrency, selectedNetwork);
      setDepositAddress(newAddress);
    } catch (error) {
      console.error('生成地址失败:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // 获取现有地址
  const getExistingAddress = () => {
    const existingAddress = addresses.find(
      addr => addr.currency === selectedCurrency && addr.network === selectedNetwork
    );
    setDepositAddress(existingAddress || null);
  };

  // 币种变化时重置状态
  useEffect(() => {
    const currencyInfo = getCurrencyInfo(selectedCurrency);
    if (currencyInfo && currencyInfo.network.length > 0) {
      setSelectedNetwork(currencyInfo.network[0]);
    }
    setDepositAddress(null);
  }, [selectedCurrency]);

  // 网络变化时查找现有地址
  useEffect(() => {
    if (selectedNetwork) {
      getExistingAddress();
    }
  }, [selectedNetwork, addresses]);

  // 初始化
  useEffect(() => {
    if (isOpen) {
      getAddresses();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currencyInfo = getCurrencyInfo(selectedCurrency);
  const availableNetworks = config.networks[selectedCurrency] || [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <ArrowDownLeft className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-white">充值</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 币种选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              选择币种
            </label>
            <div className="grid grid-cols-3 gap-3">
              {config.supportedCurrencies.map((currency) => (
                <button
                  key={currency.symbol}
                  onClick={() => setSelectedCurrency(currency.symbol)}
                  className={`flex flex-col items-center space-y-2 p-3 rounded-lg border transition-colors ${
                    selectedCurrency === currency.symbol
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                      : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700/50'
                  }`}
                >
                  {getCurrencyIcon(currency.symbol)}
                  <span className="text-xs font-medium">{currency.symbol}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 网络选择 */}
          {availableNetworks.length > 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                选择网络
              </label>
              <div className="space-y-2">
                {availableNetworks.map((network) => (
                  <button
                    key={network}
                    onClick={() => setSelectedNetwork(network)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      selectedNetwork === network
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                        : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700/50'
                    }`}
                  >
                    <span className="font-medium">{network}</span>
                    {selectedNetwork === network && (
                      <CheckCircle className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 充值信息 */}
          {currencyInfo && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <div className="text-blue-400 font-medium">充值信息</div>
                  <div className="text-blue-300">
                    最小充值金额: {currencyInfo.minDeposit} {selectedCurrency}
                  </div>
                  <div className="text-blue-300">
                    网络: {selectedNetwork}
                  </div>
                  <div className="text-blue-300">
                    确认数: 6个区块确认后到账
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 充值地址 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-300">
                充值地址
              </label>
              {!depositAddress && (
                <button
                  onClick={handleGenerateAddress}
                  disabled={!selectedNetwork || isGenerating}
                  className="flex items-center space-x-2 px-3 py-1 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? '生成中...' : '生成地址'}</span>
                </button>
              )}
            </div>

            {depositAddress ? (
              <div className="space-y-4">
                {/* 地址显示 */}
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">地址</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowQRCode(!showQRCode)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                      >
                        <QrCode className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={copyAddress}
                        className="flex items-center space-x-1 p-1 hover:bg-gray-700 rounded transition-colors"
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                        {copySuccess && (
                          <span className="text-xs text-green-400">已复制</span>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="font-mono text-sm text-white break-all bg-gray-900/50 p-3 rounded border">
                    {depositAddress.address}
                  </div>
                </div>

                {/* 二维码 */}
                {showQRCode && (
                  <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                    <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-gray-400" />
                      <div className="absolute text-xs text-gray-600 mt-20">
                        二维码占位符
                      </div>
                    </div>
                  </div>
                )}

                {/* 重新生成地址 */}
                <button
                  onClick={handleGenerateAddress}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-lg transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? '生成中...' : '重新生成地址'}</span>
                </button>
              </div>
            ) : (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-4">
                  {selectedNetwork ? '点击生成充值地址' : '请先选择网络'}
                </div>
                {selectedNetwork && (
                  <button
                    onClick={handleGenerateAddress}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {isGenerating ? '生成中...' : '生成地址'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 安全提示 */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="space-y-1 text-sm">
                <div className="text-yellow-400 font-medium">安全提示</div>
                <ul className="text-yellow-300 space-y-1">
                  <li>• 请确保转入的是 {selectedCurrency} 资产</li>
                  <li>• 请确保选择正确的网络: {selectedNetwork}</li>
                  <li>• 转入其他资产或错误网络将导致资产丢失</li>
                  <li>• 小额测试后再进行大额转账</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;