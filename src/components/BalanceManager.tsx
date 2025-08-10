import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { CryptoCurrency, WalletBalance } from '../types/wallet';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  RefreshCw,
  PieChart,
  BarChart3,
  DollarSign,
  Bitcoin,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Minus
} from 'lucide-react';

interface BalanceManagerProps {
  showActions?: boolean;
  compact?: boolean;
  onDeposit?: (currency: CryptoCurrency) => void;
  onWithdraw?: (currency: CryptoCurrency) => void;
}

const BalanceManager: React.FC<BalanceManagerProps> = ({
  showActions = true,
  compact = false,
  onDeposit,
  onWithdraw
}) => {
  const {
    balances,
    stats,
    config,
    isLoading,
    fetchBalances,
    refreshBalance
  } = useWallet();

  const [showBalances, setShowBalances] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
  const [sortBy, setSortBy] = useState<'value' | 'amount' | 'name'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCurrency, setSelectedCurrency] = useState<CryptoCurrency | null>(null);

  // 获取币种信息
  const getCurrencyInfo = (symbol: CryptoCurrency) => {
    return config.supportedCurrencies.find(c => c.symbol === symbol);
  };

  // 获取币种图标
  const getCurrencyIcon = (currency: CryptoCurrency, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    };
    
    const icons = {
      BTC: <Bitcoin className={`${sizeClasses[size]} text-orange-500`} />,
      ETH: <div className={`${sizeClasses[size]} bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold`}>Ξ</div>,
      USDT: <div className={`${sizeClasses[size]} bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold`}>₮</div>,
      BNB: <div className={`${sizeClasses[size]} bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold`}>B</div>,
      ADA: <div className={`${sizeClasses[size]} bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold`}>A</div>,
      DOT: <div className={`${sizeClasses[size]} bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold`}>•</div>
    };
    return icons[currency] || <DollarSign className={`${sizeClasses[size]} text-gray-500`} />;
  };

  // 计算USD价值
  const calculateUSDValue = (balance: WalletBalance) => {
    const currencyInfo = getCurrencyInfo(balance.currency);
    if (!currencyInfo) return 0;
    return balance.total * currencyInfo.price;
  };

  // 格式化金额
  const formatAmount = (amount: number, currency: CryptoCurrency) => {
    const info = getCurrencyInfo(currency);
    if (!info) return amount.toString();
    return amount.toFixed(info.decimals > 4 ? 4 : info.decimals);
  };

  // 格式化USD价值
  const formatUSDValue = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // 计算资产分布百分比
  const calculatePercentage = (balance: WalletBalance) => {
    const value = calculateUSDValue(balance);
    return stats.totalValueUSD > 0 ? (value / stats.totalValueUSD) * 100 : 0;
  };

  // 排序余额
  const sortedBalances = [...balances].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'value':
        aValue = calculateUSDValue(a);
        bValue = calculateUSDValue(b);
        break;
      case 'amount':
        aValue = a.total;
        bValue = b.total;
        break;
      case 'name':
        aValue = a.currency;
        bValue = b.currency;
        break;
      default:
        aValue = calculateUSDValue(a);
        bValue = calculateUSDValue(b);
    }
    
    if (sortBy === 'name') {
      return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // 刷新余额
  const handleRefresh = () => {
    fetchBalances();
  };

  // 刷新单个币种
  const handleRefreshSingle = (currency: CryptoCurrency) => {
    refreshBalance(currency);
  };

  // 生成随机颜色
  const getRandomColor = (index: number) => {
    const colors = [
      'bg-orange-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500'
    ];
    return colors[index % colors.length];
  };

  if (compact) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">资产概览</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowBalances(!showBalances)}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              {showBalances ? (
                <Eye className="w-4 h-4 text-gray-400" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-1 hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {sortedBalances.slice(0, 3).map((balance) => (
            <div key={balance.currency} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getCurrencyIcon(balance.currency, 'sm')}
                <div>
                  <div className="font-medium text-white">{balance.currency}</div>
                  <div className="text-xs text-gray-400">
                    {showBalances ? formatAmount(balance.total, balance.currency) : '****'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-white">
                  {showBalances ? formatUSDValue(calculateUSDValue(balance)) : '****'}
                </div>
                <div className="text-xs text-gray-400">
                  {calculatePercentage(balance).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Wallet className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white">余额管理</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'chart' : 'list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'chart' ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
            }`}
          >
            {viewMode === 'list' ? <PieChart className="w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors"
          >
            {showBalances ? (
              <Eye className="w-4 h-4 text-gray-400" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 总资产 */}
      <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-green-300 mb-1">总资产价值</div>
            <div className="text-3xl font-bold text-white">
              {showBalances ? formatUSDValue(stats.totalValueUSD) : '****'}
            </div>
            <div className="flex items-center space-x-2 mt-2">
              {stats.profitLoss >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm font-medium ${
                stats.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {stats.profitLoss >= 0 ? '+' : ''}${stats.profitLoss.toLocaleString('en-US', { minimumFractionDigits: 2 })} ({stats.profitLossPercentage >= 0 ? '+' : ''}{stats.profitLossPercentage.toFixed(2)}%)
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">资产数量</div>
            <div className="text-xl font-bold text-white">{balances.length}</div>
            <div className="text-sm text-gray-400">种币种</div>
          </div>
        </div>
      </div>

      {/* 排序控制 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">排序:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'value' | 'amount' | 'name')}
              className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="value">按价值</option>
              <option value="amount">按数量</option>
              <option value="name">按名称</option>
            </select>
          </div>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            {sortOrder === 'asc' ? (
              <TrendingUp className="w-4 h-4 text-gray-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* 余额列表/图表 */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
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
            sortedBalances.map((balance) => {
              const currencyInfo = getCurrencyInfo(balance.currency);
              const usdValue = calculateUSDValue(balance);
              const percentage = calculatePercentage(balance);
              
              return (
                <div
                  key={balance.currency}
                  className="flex items-center justify-between p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {getCurrencyIcon(balance.currency, 'lg')}
                      {balance.frozen > 0 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-white text-lg">{balance.currency}</h4>
                        <span className="text-sm text-gray-400">{currencyInfo?.name}</span>
                      </div>
                      <div className="text-sm text-gray-400 space-y-1">
                        <div>
                          可用: {showBalances ? formatAmount(balance.available, balance.currency) : '****'}
                          {balance.frozen > 0 && (
                            <span className="ml-2 text-yellow-400">
                              冻结: {showBalances ? formatAmount(balance.frozen, balance.currency) : '****'}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getRandomColor(sortedBalances.indexOf(balance))}`}></div>
                          <span>{percentage.toFixed(1)}% 占比</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-semibold text-white text-lg">
                        {showBalances ? formatAmount(balance.total, balance.currency) : '****'} {balance.currency}
                      </div>
                      <div className="text-sm text-gray-400">
                        {showBalances ? formatUSDValue(usdValue) : '****'}
                      </div>
                    </div>
                    
                    {showActions && (
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleRefreshSingle(balance.currency)}
                          className="p-2 bg-gray-600/50 hover:bg-gray-500/50 rounded-lg transition-colors"
                        >
                          <RefreshCw className="w-4 h-4 text-gray-400" />
                        </button>
                        {onDeposit && (
                          <button
                            onClick={() => onDeposit(balance.currency)}
                            className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                          >
                            <ArrowDownLeft className="w-4 h-4 text-green-400" />
                          </button>
                        )}
                        {onWithdraw && (
                          <button
                            onClick={() => onWithdraw(balance.currency)}
                            className="p-2 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg transition-colors"
                          >
                            <ArrowUpRight className="w-4 h-4 text-orange-400" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* 饼图视图 */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 饼图占位符 */}
          <div className="bg-gray-700/30 rounded-lg p-6 flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-400">资产分布图</div>
              <div className="text-sm text-gray-500 mt-2">图表功能开发中</div>
            </div>
          </div>
          
          {/* 图例 */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white mb-4">资产分布</h4>
            {sortedBalances.map((balance, index) => {
              const percentage = calculatePercentage(balance);
              const usdValue = calculateUSDValue(balance);
              
              return (
                <div key={balance.currency} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getRandomColor(index)}`}></div>
                    <div className="flex items-center space-x-2">
                      {getCurrencyIcon(balance.currency, 'sm')}
                      <span className="text-white font-medium">{balance.currency}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">{percentage.toFixed(1)}%</div>
                    <div className="text-sm text-gray-400">
                      {showBalances ? formatUSDValue(usdValue) : '****'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BalanceManager;