import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Transaction, TransactionFilters, CryptoCurrency, TransactionType, TransactionStatus } from '../types/wallet';
import {
  History,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Copy,
  Calendar,
  Bitcoin,
  DollarSign,
  RefreshCw
} from 'lucide-react';

interface TransactionHistoryProps {
  isModal?: boolean;
  onClose?: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  isModal = false,
  onClose
}) => {
  const {
    transactions,
    getTransactions,
    config,
    isLoading
  } = useWallet();

  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<TransactionFilters>({
    limit: 20,
    offset: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  // 获取币种图标
  const getCurrencyIcon = (currency: CryptoCurrency) => {
    const icons = {
      BTC: <Bitcoin className="w-4 h-4 text-orange-500" />,
      ETH: <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Ξ</div>,
      USDT: <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">₮</div>,
      BNB: <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold">B</div>,
      ADA: <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>,
      DOT: <div className="w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">•</div>
    };
    return icons[currency] || <DollarSign className="w-4 h-4 text-gray-500" />;
  };

  // 获取交易类型图标和颜色
  const getTransactionTypeInfo = (type: TransactionType) => {
    const typeInfo = {
      deposit: {
        icon: <ArrowDownLeft className="w-4 h-4" />,
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        label: '充值'
      },
      withdraw: {
        icon: <ArrowUpRight className="w-4 h-4" />,
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/20',
        label: '提现'
      },
      transfer: {
        icon: <ArrowUpRight className="w-4 h-4" />,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        label: '转账'
      },
      trade: {
        icon: <ArrowUpRight className="w-4 h-4" />,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/20',
        label: '交易'
      }
    };
    return typeInfo[type];
  };

  // 获取交易状态信息
  const getTransactionStatusInfo = (status: TransactionStatus) => {
    const statusInfo = {
      pending: {
        icon: <Clock className="w-4 h-4" />,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        label: '处理中'
      },
      confirmed: {
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        label: '已确认'
      },
      failed: {
        icon: <XCircle className="w-4 h-4" />,
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        label: '失败'
      },
      cancelled: {
        icon: <AlertTriangle className="w-4 h-4" />,
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20',
        label: '已取消'
      }
    };
    return statusInfo[status];
  };

  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('zh-CN'),
      time: date.toLocaleTimeString('zh-CN', { hour12: false })
    };
  };

  // 格式化地址
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  // 复制文本
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 应用筛选
  const applyFilters = () => {
    let filtered = [...transactions];

    // 搜索筛选
    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.txHash?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.toAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.fromAddress?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 币种筛选
    if (filters.currency) {
      filtered = filtered.filter(tx => tx.currency === filters.currency);
    }

    // 类型筛选
    if (filters.type) {
      filtered = filtered.filter(tx => tx.type === filters.type);
    }

    // 状态筛选
    if (filters.status) {
      filtered = filtered.filter(tx => tx.status === filters.status);
    }

    // 时间筛选
    if (filters.startDate) {
      filtered = filtered.filter(tx => new Date(tx.createdAt) >= new Date(filters.startDate!));
    }
    if (filters.endDate) {
      filtered = filtered.filter(tx => new Date(tx.createdAt) <= new Date(filters.endDate!));
    }

    // 排序（最新的在前）
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredTransactions(filtered);
  };

  // 重置筛选
  const resetFilters = () => {
    setFilters({ limit: 20, offset: 0 });
    setSearchTerm('');
    setShowFilters(false);
  };

  // 刷新交易记录
  const handleRefresh = () => {
    getTransactions(filters);
  };

  // 应用筛选效果
  useEffect(() => {
    applyFilters();
  }, [transactions, searchTerm, filters]);

  // 初始化加载
  useEffect(() => {
    getTransactions(filters);
  }, []);

  const content = (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <History className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-bold text-white">交易记录</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${
              showFilters ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <XCircle className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜索交易ID、哈希或地址..."
          className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-colors"
        />
      </div>

      {/* 筛选器 */}
      {showFilters && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 币种筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">币种</label>
              <select
                value={filters.currency || ''}
                onChange={(e) => setFilters({ ...filters, currency: e.target.value as CryptoCurrency || undefined })}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="">全部</option>
                {config.supportedCurrencies.map(currency => (
                  <option key={currency.symbol} value={currency.symbol}>{currency.symbol}</option>
                ))}
              </select>
            </div>

            {/* 类型筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">类型</label>
              <select
                value={filters.type || ''}
                onChange={(e) => setFilters({ ...filters, type: e.target.value as TransactionType || undefined })}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="">全部</option>
                <option value="deposit">充值</option>
                <option value="withdraw">提现</option>
                <option value="transfer">转账</option>
                <option value="trade">交易</option>
              </select>
            </div>

            {/* 状态筛选 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">状态</label>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as TransactionStatus || undefined })}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                <option value="">全部</option>
                <option value="pending">处理中</option>
                <option value="confirmed">已确认</option>
                <option value="failed">失败</option>
                <option value="cancelled">已取消</option>
              </select>
            </div>

            {/* 重置按钮 */}
            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full p-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
              >
                重置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 交易列表 */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
            <div className="text-gray-400">加载中...</div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="p-8 text-center">
            <History className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <div className="text-gray-400 mb-2">暂无交易记录</div>
            <div className="text-gray-500 text-sm">您的交易记录将在这里显示</div>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {filteredTransactions.map((transaction) => {
              const typeInfo = getTransactionTypeInfo(transaction.type);
              const statusInfo = getTransactionStatusInfo(transaction.status);
              const dateTime = formatDate(transaction.createdAt);

              return (
                <div
                  key={transaction.id}
                  className="p-4 hover:bg-gray-700/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedTransaction(transaction)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* 类型图标 */}
                      <div className={`p-2 rounded-lg ${typeInfo.bgColor}`}>
                        <div className={typeInfo.color}>
                          {typeInfo.icon}
                        </div>
                      </div>

                      {/* 交易信息 */}
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-white">{typeInfo.label}</span>
                          {getCurrencyIcon(transaction.currency)}
                          <span className="text-sm text-gray-400">{transaction.currency}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <span>{dateTime.date} {dateTime.time}</span>
                          {transaction.txHash && (
                            <>
                              <span>•</span>
                              <span className="font-mono">{formatAddress(transaction.txHash)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {/* 金额 */}
                      <div className={`font-medium ${
                        transaction.type === 'deposit' ? 'text-green-400' : 'text-white'
                      }`}>
                        {transaction.type === 'deposit' ? '+' : '-'}{transaction.amount} {transaction.currency}
                      </div>
                      
                      {/* 状态 */}
                      <div className="flex items-center justify-end space-x-1 mt-1">
                        <div className={`p-1 rounded ${statusInfo.bgColor}`}>
                          <div className={statusInfo.color}>
                            {statusInfo.icon}
                          </div>
                        </div>
                        <span className={`text-sm ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 交易详情模态框 */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* 头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 className="text-lg font-bold text-white">交易详情</h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* 基本信息 */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">交易ID:</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-mono text-sm">{selectedTransaction.id}</span>
                    <button
                      onClick={() => copyToClipboard(selectedTransaction.id, 'id')}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                    >
                      <Copy className="w-3 h-3 text-gray-400" />
                    </button>
                    {copySuccess === 'id' && (
                      <span className="text-xs text-green-400">已复制</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">类型:</span>
                  <span className="text-white">{getTransactionTypeInfo(selectedTransaction.type).label}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">币种:</span>
                  <div className="flex items-center space-x-2">
                    {getCurrencyIcon(selectedTransaction.currency)}
                    <span className="text-white">{selectedTransaction.currency}</span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">金额:</span>
                  <span className="text-white font-medium">
                    {selectedTransaction.amount} {selectedTransaction.currency}
                  </span>
                </div>

                {selectedTransaction.fee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">手续费:</span>
                    <span className="text-white">
                      {selectedTransaction.fee} {selectedTransaction.currency}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-gray-400">状态:</span>
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded ${getTransactionStatusInfo(selectedTransaction.status).bgColor}`}>
                      <div className={getTransactionStatusInfo(selectedTransaction.status).color}>
                        {getTransactionStatusInfo(selectedTransaction.status).icon}
                      </div>
                    </div>
                    <span className={getTransactionStatusInfo(selectedTransaction.status).color}>
                      {getTransactionStatusInfo(selectedTransaction.status).label}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">网络:</span>
                  <span className="text-white">{selectedTransaction.network}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">确认数:</span>
                  <span className="text-white">
                    {selectedTransaction.confirmations}/{selectedTransaction.requiredConfirmations}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">创建时间:</span>
                  <span className="text-white">
                    {formatDate(selectedTransaction.createdAt).date} {formatDate(selectedTransaction.createdAt).time}
                  </span>
                </div>

                {selectedTransaction.txHash && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">交易哈希:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-mono text-sm">
                        {formatAddress(selectedTransaction.txHash)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(selectedTransaction.txHash!, 'hash')}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                      >
                        <Copy className="w-3 h-3 text-gray-400" />
                      </button>
                      <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </button>
                      {copySuccess === 'hash' && (
                        <span className="text-xs text-green-400">已复制</span>
                      )}
                    </div>
                  </div>
                )}

                {selectedTransaction.toAddress && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">接收地址:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-mono text-sm">
                        {formatAddress(selectedTransaction.toAddress)}
                      </span>
                      <button
                        onClick={() => copyToClipboard(selectedTransaction.toAddress!, 'address')}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                      >
                        <Copy className="w-3 h-3 text-gray-400" />
                      </button>
                      {copySuccess === 'address' && (
                        <span className="text-xs text-green-400">已复制</span>
                      )}
                    </div>
                  </div>
                )}

                {selectedTransaction.note && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">备注:</span>
                    <span className="text-white">{selectedTransaction.note}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
      {content}
    </div>
  );
};

export default TransactionHistory;