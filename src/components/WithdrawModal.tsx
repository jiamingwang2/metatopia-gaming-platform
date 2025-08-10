import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { CryptoCurrency, WithdrawRequest } from '../types/wallet';
import {
  X,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle,
  Calculator,
  Shield,
  Info,
  Bitcoin,
  DollarSign,
  Eye,
  EyeOff
} from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCurrency?: CryptoCurrency;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  initialCurrency = 'BTC'
}) => {
  const {
    config,
    balances,
    withdraw,
    validateAddress,
    estimateFee,
    isLoading
  } = useWallet();

  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency>(initialCurrency);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [estimatedFee, setEstimatedFee] = useState<number>(0);
  const [isValidAddress, setIsValidAddress] = useState<boolean | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 获取币种信息
  const getCurrencyInfo = (symbol: CryptoCurrency) => {
    return config.supportedCurrencies.find(c => c.symbol === symbol);
  };

  // 获取余额
  const getBalance = (currency: CryptoCurrency) => {
    return balances.find(b => b.currency === currency);
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

  // 验证表单
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!toAddress.trim()) {
      newErrors.toAddress = '请输入提现地址';
    } else if (!isValidAddress) {
      newErrors.toAddress = '地址格式不正确';
    }
    
    if (!amount.trim()) {
      newErrors.amount = '请输入提现金额';
    } else {
      const numAmount = parseFloat(amount);
      const currencyInfo = getCurrencyInfo(selectedCurrency);
      const balance = getBalance(selectedCurrency);
      
      if (isNaN(numAmount) || numAmount <= 0) {
        newErrors.amount = '请输入有效金额';
      } else if (currencyInfo && numAmount < currencyInfo.minWithdraw) {
        newErrors.amount = `最小提现金额为 ${currencyInfo.minWithdraw} ${selectedCurrency}`;
      } else if (currencyInfo && numAmount > config.limits.maxWithdraw[selectedCurrency]) {
        newErrors.amount = `最大提现金额为 ${config.limits.maxWithdraw[selectedCurrency]} ${selectedCurrency}`;
      } else if (balance && numAmount > balance.available) {
        newErrors.amount = '余额不足';
      }
    }
    
    if (!selectedNetwork) {
      newErrors.network = '请选择网络';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 地址验证
  useEffect(() => {
    if (toAddress.trim()) {
      const isValid = validateAddress(toAddress, selectedCurrency);
      setIsValidAddress(isValid);
    } else {
      setIsValidAddress(null);
    }
  }, [toAddress, selectedCurrency]);

  // 估算手续费
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      estimateFee(selectedCurrency, parseFloat(amount))
        .then(setEstimatedFee)
        .catch(() => setEstimatedFee(0));
    } else {
      setEstimatedFee(0);
    }
  }, [amount, selectedCurrency]);

  // 币种变化时重置状态
  useEffect(() => {
    const currencyInfo = getCurrencyInfo(selectedCurrency);
    if (currencyInfo && currencyInfo.network.length > 0) {
      setSelectedNetwork(currencyInfo.network[0]);
    }
    setToAddress('');
    setAmount('');
    setNote('');
    setErrors({});
    setShowConfirmation(false);
  }, [selectedCurrency]);

  // 提交提现
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setShowConfirmation(true);
  };

  // 确认提现
  const handleConfirmWithdraw = async () => {
    setIsSubmitting(true);
    try {
      const request: WithdrawRequest = {
        currency: selectedCurrency,
        network: selectedNetwork,
        toAddress,
        amount: parseFloat(amount),
        note: note.trim() || undefined,
        twoFactorCode: twoFactorCode.trim() || undefined
      };
      
      await withdraw(request);
      
      // 重置表单
      setToAddress('');
      setAmount('');
      setNote('');
      setTwoFactorCode('');
      setShowConfirmation(false);
      setShowTwoFactor(false);
      
      onClose();
    } catch (error) {
      console.error('提现失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 设置最大金额
  const setMaxAmount = () => {
    const balance = getBalance(selectedCurrency);
    if (balance) {
      const maxAmount = Math.max(0, balance.available - estimatedFee);
      setAmount(maxAmount.toString());
    }
  };

  if (!isOpen) return null;

  const currencyInfo = getCurrencyInfo(selectedCurrency);
  const balance = getBalance(selectedCurrency);
  const availableNetworks = config.networks[selectedCurrency] || [];
  const totalAmount = parseFloat(amount) + estimatedFee;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <ArrowUpRight className="w-5 h-5 text-orange-400" />
            </div>
            <h2 className="text-xl font-bold text-white">提现</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!showConfirmation ? (
            <>
              {/* 币种选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  选择币种
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {config.supportedCurrencies.map((currency) => {
                    const currBalance = getBalance(currency.symbol);
                    return (
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
                        <div className="text-center">
                          <div className="text-xs font-medium">{currency.symbol}</div>
                          <div className="text-xs text-gray-500">
                            {currBalance ? currBalance.available.toFixed(4) : '0'}
                          </div>
                        </div>
                      </button>
                    );
                  })}
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

              {/* 提现地址 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  提现地址
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    placeholder={`请输入 ${selectedCurrency} 地址`}
                    className={`w-full p-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                      errors.toAddress
                        ? 'border-red-500 focus:ring-red-500/50'
                        : isValidAddress === true
                        ? 'border-green-500 focus:ring-green-500/50'
                        : isValidAddress === false
                        ? 'border-red-500 focus:ring-red-500/50'
                        : 'border-gray-700 focus:ring-purple-500/50'
                    }`}
                  />
                  {isValidAddress !== null && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isValidAddress ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
                {errors.toAddress && (
                  <div className="text-red-400 text-sm mt-1">{errors.toAddress}</div>
                )}
              </div>

              {/* 提现金额 */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-300">
                    提现金额
                  </label>
                  <div className="text-sm text-gray-400">
                    可用: {balance ? balance.available.toFixed(8) : '0'} {selectedCurrency}
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="any"
                    min="0"
                    className={`w-full p-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                      errors.amount
                        ? 'border-red-500 focus:ring-red-500/50'
                        : 'border-gray-700 focus:ring-purple-500/50'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                    <button
                      onClick={setMaxAmount}
                      className="px-2 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 text-xs rounded transition-colors"
                    >
                      最大
                    </button>
                    <span className="text-gray-400 text-sm">{selectedCurrency}</span>
                  </div>
                </div>
                {errors.amount && (
                  <div className="text-red-400 text-sm mt-1">{errors.amount}</div>
                )}
              </div>

              {/* 手续费信息 */}
              {amount && parseFloat(amount) > 0 && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Calculator className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">费用明细</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">提现金额:</span>
                      <span className="text-white">{amount} {selectedCurrency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">网络手续费:</span>
                      <span className="text-white">{estimatedFee} {selectedCurrency}</span>
                    </div>
                    <div className="border-t border-gray-700 pt-2">
                      <div className="flex justify-between font-medium">
                        <span className="text-gray-300">总计:</span>
                        <span className="text-white">{totalAmount.toFixed(8)} {selectedCurrency}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 备注 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  备注 (可选)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="添加备注信息..."
                  rows={3}
                  className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors resize-none"
                />
              </div>

              {/* 提现限制信息 */}
              {currencyInfo && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div className="space-y-1 text-sm">
                      <div className="text-blue-400 font-medium">提现限制</div>
                      <div className="text-blue-300">
                        最小提现: {currencyInfo.minWithdraw} {selectedCurrency}
                      </div>
                      <div className="text-blue-300">
                        最大提现: {config.limits.maxWithdraw[selectedCurrency]} {selectedCurrency}
                      </div>
                      <div className="text-blue-300">
                        网络: {selectedNetwork}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 提交按钮 */}
              <button
                onClick={handleSubmit}
                disabled={!toAddress || !amount || !isValidAddress || isLoading}
                className="w-full p-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
              >
                {isLoading ? '处理中...' : '确认提现'}
              </button>
            </>
          ) : (
            /* 确认页面 */
            <div className="space-y-6">
              <div className="text-center">
                <div className="p-4 bg-orange-500/20 rounded-full w-16 h-16 mx-auto mb-4">
                  <Shield className="w-8 h-8 text-orange-400 mx-auto" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">确认提现</h3>
                <p className="text-gray-400 text-sm">请仔细核对以下信息</p>
              </div>

              {/* 提现详情 */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">币种:</span>
                  <span className="text-white font-medium">{selectedCurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">网络:</span>
                  <span className="text-white">{selectedNetwork}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">提现地址:</span>
                  <span className="text-white font-mono text-sm break-all">
                    {toAddress.slice(0, 10)}...{toAddress.slice(-10)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">提现金额:</span>
                  <span className="text-white font-medium">{amount} {selectedCurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">手续费:</span>
                  <span className="text-white">{estimatedFee} {selectedCurrency}</span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between font-medium">
                    <span className="text-gray-300">总计:</span>
                    <span className="text-white text-lg">{totalAmount.toFixed(8)} {selectedCurrency}</span>
                  </div>
                </div>
              </div>

              {/* 双重验证 */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-300">
                    双重验证码 (可选)
                  </label>
                  <button
                    onClick={() => setShowTwoFactor(!showTwoFactor)}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    {showTwoFactor ? '隐藏' : '显示'}
                  </button>
                </div>
                {showTwoFactor && (
                  <input
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    placeholder="请输入6位验证码"
                    maxLength={6}
                    className="w-full p-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors"
                  />
                )}
              </div>

              {/* 安全提示 */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div className="space-y-1 text-sm">
                    <div className="text-red-400 font-medium">重要提示</div>
                    <ul className="text-red-300 space-y-1">
                      <li>• 提现操作不可撤销，请仔细核对地址</li>
                      <li>• 确保地址支持所选网络</li>
                      <li>• 转账到错误地址将导致资产丢失</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  返回修改
                </button>
                <button
                  onClick={handleConfirmWithdraw}
                  disabled={isSubmitting}
                  className="flex-1 p-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
                >
                  {isSubmitting ? '提现中...' : '确认提现'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;