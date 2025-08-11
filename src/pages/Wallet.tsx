import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { CryptoCurrency } from '../types/wallet';
import { userApiService, WalletBalance, Transaction, TransactionStats } from '../services/userApi';
import DepositModal from '../components/DepositModal';
import WithdrawModal from '../components/WithdrawModal';
import TransactionHistory from '../components/TransactionHistory';
import { toast } from '../utils/toast';
import {
  Wallet as WalletIcon,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Eye,
  EyeOff,
  Plus,
  History,
  Settings,
  Shield,
  DollarSign,
  Bitcoin,
  Zap
} from 'lucide-react';

const Wallet: React.FC = () => {
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBalances, setShowBalances] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('BTC');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);

  // 加载数据
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [balancesData, statsData] = await Promise.all([
        userApiService.getWalletBalances(),
        userApiService.getTransactionStats()
      ]);
      
      setBalances(balancesData);
      setStats(statsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '加载数据失败';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 格式化金额
  const formatAmount = (amount: number, decimals: number = 4) => {
    return amount.toFixed(decimals);
  };

  // 格式化USD价值（模拟汇率）
  const formatUSDValue = (amount: number, currency: string) => {
    const rates: { [key: string]: number } = {
      BTC: 45000,
      ETH: 3000,
      USDT: 1,
      BNB: 300,
      ADA: 0.5,
      DOT: 8
    };
    const rate = rates[currency] || 1;
    const usdValue = amount * rate;
    return `$${usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // 获取币种图标
  const getCurrencyIcon = (currency: string) => {
    const icons: { [key: string]: JSX.Element } = {
      BTC: <Bitcoin className="w-6 h-6 text-orange-500" />,
      ETH: <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Ξ</div>,
      USDT: <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">₮</div>,
      BNB: <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">B</div>,
      ADA: <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>,
      DOT: <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">•</div>
    };
    return icons[currency] || <DollarSign className="w-6 h-6 text-gray-500" />;
  };

  const handleRefresh = () => {
    loadData();
  };

  // 处理充值
  const handleDeposit = (currency: string) => {
    setSelectedCurrency(currency);
    setShowDepositModal(true);
  };

  // 处理提现
  const handleWithdraw = (currency: string) => {
    setSelectedCurrency(currency);
    setShowWithdrawModal(true);
  };

  // 处理交易完成
  const handleTransactionComplete = () => {
    loadData(); // 重新加载数据
    toast.success('交易提交成功');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
            <div className="text-red-400 text-lg font-medium mb-2">加载失败</div>
            <div className="text-red-300 mb-4">{error}</div>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 头部 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <WalletIcon className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">我的钱包</h1>
              <p className="text-gray-400">管理您的数字资产</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowBalances(!showBalances)}
              className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              {showBalances ? (
                <Eye className="w-5 h-5 text-gray-400" />
              ) : (
                <EyeOff className="w-5 h-5 text-gray-400" />
              )}
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* 总资产概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">总资产价值</h3>
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">
                {showBalances ? (
                  isLoading ? (
                    <div className="animate-pulse bg-gray-600 h-8 w-32 rounded"></div>
                  ) : (
                    `$${balances.reduce((total, balance) => {
                      const rates: { [key: string]: number } = {
                        BTC: 45000, ETH: 3000, USDT: 1, BNB: 300, ADA: 0.5, DOT: 8
                      };
                      return total + (balance.total * (rates[balance.currency] || 1));
                    }, 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                  )
                ) : '****'}
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">
                  +2.5% (24h)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">总充值</h3>
              <ArrowDownLeft className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {isLoading ? (
                <div className="animate-pulse bg-gray-600 h-6 w-16 rounded"></div>
              ) : (
                stats?.total_deposits || 0
              )}
            </div>
            <div className="text-sm text-gray-400">笔交易</div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">总提现</h3>
              <ArrowUpRight className="w-6 h-6 text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {isLoading ? (
                <div className="animate-pulse bg-gray-600 h-6 w-16 rounded"></div>
              ) : (
                stats?.total_withdrawals || 0
              )}
            </div>
            <div className="text-sm text-gray-400">笔交易</div>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">快捷操作</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => handleDeposit('USDT')}
              className="flex flex-col items-center space-y-2 p-4 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg transition-colors group"
            >
              <ArrowDownLeft className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-green-400">充值</span>
            </button>
            <button 
              onClick={() => handleWithdraw('USDT')}
              className="flex flex-col items-center space-y-2 p-4 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg transition-colors group"
            >
              <ArrowUpRight className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-orange-400">提现</span>
            </button>
            <button 
              onClick={() => setShowTransactionHistory(true)}
              className="flex flex-col items-center space-y-2 p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors group"
            >
              <History className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-blue-400">交易记录</span>
            </button>
            <button 
              onClick={handleRefresh}
              className="flex flex-col items-center space-y-2 p-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg transition-colors group"
            >
              <RefreshCw className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-purple-400">刷新数据</span>
            </button>
          </div>
        </div>

        {/* 资产列表 */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">资产列表</h3>
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">安全保护</span>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-4 p-4 bg-gray-700/30 rounded-lg">
                    <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-600 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-600 rounded w-1/6"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-600 rounded w-20"></div>
                      <div className="h-3 bg-gray-600 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {balances.map((balance) => {
                const currencyNames: { [key: string]: string } = {
                  BTC: 'Bitcoin',
                  ETH: 'Ethereum',
                  USDT: 'Tether USD',
                  BNB: 'Binance Coin',
                  ADA: 'Cardano',
                  DOT: 'Polkadot'
                };
                return (
                  <div
                    key={balance.currency}
                    className="flex items-center justify-between p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {getCurrencyIcon(balance.currency)}
                        {balance.frozen > 0 && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-white">{balance.currency}</h4>
                          <span className="text-sm text-gray-400">{currencyNames[balance.currency] || balance.currency}</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          可用: {showBalances ? formatAmount(balance.available) : '****'}
                          {balance.frozen > 0 && (
                            <span className="ml-2 text-yellow-400">
                              冻结: {showBalances ? formatAmount(balance.frozen) : '****'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-semibold text-white">
                          {showBalances ? formatAmount(balance.total) : '****'} {balance.currency}
                        </div>
                        <div className="text-sm text-gray-400">
                          {showBalances ? formatUSDValue(balance.total, balance.currency) : '****'}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDeposit(balance.currency)}
                          className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 text-xs rounded-lg transition-colors"
                        >
                          充值
                        </button>
                        <button
                          onClick={() => handleWithdraw(balance.currency)}
                          className="px-3 py-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 text-xs rounded-lg transition-colors"
                          disabled={balance.available <= 0}
                        >
                          提现
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 安全提示 */}
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
      </div>

      {/* 模态框 */}
      {showDepositModal && (
        <DepositModal
          isOpen={showDepositModal}
          currency={selectedCurrency}
          onClose={() => setShowDepositModal(false)}
          onDeposit={async (amount, address) => {
            // 处理充值逻辑
            console.log('Deposit:', { amount, address, currency: selectedCurrency });
            handleTransactionComplete();
          }}
        />
      )}

      {showWithdrawModal && (
        <WithdrawModal
          isOpen={showWithdrawModal}
          currency={selectedCurrency}
          availableBalance={balances.find(b => b.currency === selectedCurrency)?.available || 0}
          onClose={() => setShowWithdrawModal(false)}
          onWithdraw={async (amount, address, memo) => {
            // 处理提现逻辑
            console.log('Withdraw:', { amount, address, memo, currency: selectedCurrency });
            handleTransactionComplete();
          }}
        />
      )}

      {showTransactionHistory && (
        <TransactionHistory
          onClose={() => setShowTransactionHistory(false)}
        />
      )}
    </div>
  );
};

export default Wallet;