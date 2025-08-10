import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet as WalletIcon,
  Eye,
  EyeOff,
  Plus,
  Minus,
  History,
  QrCode,
  Shield,
  TrendingUp,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AnimatedButton } from '../components/ui/AnimatedButton';
import { AnimatedCard } from '../components/ui/AnimatedCard';
import { ScrollAnimation } from '../components/ui/ScrollAnimation';

// 货币配置
const currencies = {
  ETH: { name: 'Ethereum', icon: '⟠', color: 'text-blue-400' },
  BTC: { name: 'Bitcoin', icon: '₿', color: 'text-orange-400' },
  USDT: { name: 'Tether', icon: '₮', color: 'text-green-400' },
  USDC: { name: 'USD Coin', icon: '$', color: 'text-blue-500' },
  BNB: { name: 'Binance Coin', icon: 'B', color: 'text-yellow-400' }
};

// 余额数据类型
interface Balance {
  currency: string;
  available: number;
  frozen: number;
  total: number;
}

const Wallet: React.FC = () => {
  const [showBalances, setShowBalances] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('ETH');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 模拟余额数据
  const [balances] = useState<Balance[]>([
    { currency: 'ETH', available: 2.5847, frozen: 0.1, total: 2.6847 },
    { currency: 'BTC', available: 0.0234, frozen: 0, total: 0.0234 },
    { currency: 'USDT', available: 1250.50, frozen: 50, total: 1300.50 },
    { currency: 'USDC', available: 800.25, frozen: 0, total: 800.25 },
    { currency: 'BNB', available: 15.75, frozen: 2.5, total: 18.25 }
  ]);

  // 计算总资产价值（模拟汇率）
  const exchangeRates = {
    ETH: 2000,
    BTC: 45000,
    USDT: 1,
    USDC: 1,
    BNB: 300
  };

  const totalAssetValue = balances.reduce((total, balance) => {
    return total + (balance.total * exchangeRates[balance.currency as keyof typeof exchangeRates]);
  }, 0);

  // 格式化金额
  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'USDT' || currency === 'USDC') {
      return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return amount.toFixed(6);
  };

  // 格式化USD价值
  const formatUSDValue = (amount: number, currency: string) => {
    const usdValue = amount * exchangeRates[currency as keyof typeof exchangeRates];
    return `≈ $${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // 获取货币图标
  const getCurrencyIcon = (currency: string) => {
    return currencies[currency as keyof typeof currencies]?.icon || '?';
  };

  // 获取货币颜色
  const getCurrencyColor = (currency: string) => {
    return currencies[currency as keyof typeof currencies]?.color || 'text-gray-400';
  };

  // 处理错误
  const handleError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  // 快捷操作
  const handleDeposit = () => {
    console.log('Deposit clicked');
  };

  const handleWithdraw = () => {
    console.log('Withdraw clicked');
  };

  const handleTransactionHistory = () => {
    console.log('Transaction history clicked');
  };

  const handleGenerateAddress = () => {
    console.log('Generate address clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-tech font-bold text-white mb-4 flex items-center justify-center">
            <WalletIcon className="w-10 h-10 mr-3 text-neon-500" />
            数字钱包
          </h1>
          <p className="text-gray-400 text-lg">安全管理您的数字资产</p>
        </motion.div>

        {/* 错误提示 */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-red-600/20 border border-red-500/30 rounded-lg flex items-center space-x-3"
          >
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">{error}</span>
          </motion.div>
        )}

        {/* 总资产价值 */}
        <ScrollAnimation>
          <AnimatedCard className="text-center mb-8 bg-gradient-to-r from-neon-500/10 to-accent-400/10 border-neon-500/20">
            <div className="flex items-center justify-center mb-4">
              <h2 className="text-2xl font-tech font-bold text-white mr-4">总资产价值</h2>
              <AnimatedButton
                onClick={() => setShowBalances(!showBalances)}
                variant="ghost"
                size="sm"
                className="p-2"
              >
                {showBalances ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </AnimatedButton>
            </div>
            <div className="text-4xl font-bold text-neon-500 mb-2">
              {showBalances ? `$${totalAssetValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '****'}
            </div>
            <div className="flex items-center justify-center text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+5.67% (24h)</span>
            </div>
          </AnimatedCard>
        </ScrollAnimation>

        {/* 快捷操作 */}
        <ScrollAnimation delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Plus, label: '充值', action: handleDeposit, color: 'text-green-400' },
              { icon: Minus, label: '提现', action: handleWithdraw, color: 'text-red-400' },
              { icon: History, label: '交易记录', action: handleTransactionHistory, color: 'text-blue-400' },
              { icon: QrCode, label: '生成地址', action: handleGenerateAddress, color: 'text-purple-400' }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <AnimatedButton
                  key={index}
                  onClick={item.action}
                  variant="secondary"
                  className="h-20 flex-col space-y-2 bg-primary-800/50 hover:bg-primary-700/50"
                >
                  <Icon className={cn("w-6 h-6", item.color)} />
                  <span className="text-sm">{item.label}</span>
                </AnimatedButton>
              );
            })}
          </div>
        </ScrollAnimation>

        {/* 资产列表 */}
        <ScrollAnimation delay={0.4}>
          <AnimatedCard>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-tech font-bold text-white">我的资产</h3>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">货币选择:</span>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="bg-primary-700 border border-primary-600 rounded px-3 py-1 text-white text-sm focus:outline-none focus:border-neon-500"
                >
                  <option value="all">全部</option>
                  {Object.keys(currencies).map(currency => (
                    <option key={currency} value={currency}>{currency}</option>
                  ))}
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-500 mx-auto"></div>
                <p className="text-gray-400 mt-2">加载中...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {balances
                  .filter(balance => selectedCurrency === 'all' || balance.currency === selectedCurrency)
                  .map((balance, index) => {
                  const currencyInfo = currencies[balance.currency as keyof typeof currencies];
                  return (
                    <div
                      key={balance.currency}
                      className="flex items-center justify-between p-4 bg-primary-800/50 rounded-lg hover:bg-primary-700/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold",
                          "bg-gradient-to-br from-primary-600 to-primary-700",
                          getCurrencyColor(balance.currency)
                        )}>
                          {getCurrencyIcon(balance.currency)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {currencyInfo?.name || balance.currency}
                          </div>
                          <div className="text-sm text-gray-400">
                            可用: {showBalances ? formatAmount(balance.available, balance.currency) : '****'}
                            {balance.frozen > 0 && (
                              <span className="ml-2 text-yellow-400">
                                冻结: {showBalances ? formatAmount(balance.frozen, balance.currency) : '****'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-white">
                          {showBalances ? formatAmount(balance.total, balance.currency) : '****'} {balance.currency}
                        </div>
                        <div className="text-sm text-gray-400">
                          {showBalances ? formatUSDValue(balance.total, balance.currency) : '****'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </AnimatedCard>
        </ScrollAnimation>

        {/* 安全提示 */}
        <ScrollAnimation delay={0.6}>
          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm border border-yellow-500/20 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-yellow-400 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">安全提示</h3>
                <ul className="space-y-1 text-sm text-yellow-300">
                  <li>• 请妥善保管您的私钥和助记词</li>
                  <li>• 大额转账前请先小额测试</li>
                  <li>• 建议开启双重身份验证</li>
                  <li>• 定期检查账户安全设置</li>
                </ul>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default Wallet;