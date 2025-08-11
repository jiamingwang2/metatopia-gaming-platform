import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  Download,
  Flag,
  Shield,
  Activity
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { transactionApi, alertApi, Transaction, Alert } from '../../services/adminApi';

interface TransactionStats {
  totalTransactions: number;
  pendingTransactions: number;
  completedTransactions: number;
  flaggedTransactions: number;
  totalVolume: number;
  dailyVolume: number;
}

const TransactionMonitoring: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'transactions' | 'alerts'>('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedItem, setSelectedItem] = useState<Transaction | Alert | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [stats, setStats] = useState<TransactionStats>({
    totalTransactions: 0,
    pendingTransactions: 0,
    completedTransactions: 0,
    flaggedTransactions: 0,
    totalVolume: 0,
    dailyVolume: 0
  });

  // 模拟分析数据
  const [dailyVolumeData] = useState([
    { date: '01/01', volume: 125000 },
    { date: '01/02', volume: 142000 },
    { date: '01/03', volume: 138000 },
    { date: '01/04', volume: 156000 },
    { date: '01/05', volume: 167000 },
    { date: '01/06', volume: 145000 },
    { date: '01/07', volume: 178000 }
  ]);

  const [transactionTypeData] = useState([
    { name: '投资', value: 45, color: '#3B82F6' },
    { name: '提现', value: 25, color: '#EF4444' },
    { name: '转账', value: 20, color: '#10B981' },
    { name: '其他', value: 10, color: '#F59E0B' }
  ]);

  // 获取交易数据
  const loadTransactions = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        type: filterType !== 'all' ? filterType : undefined
      };
      
      const response = await transactionApi.getTransactions(params);
      if (response.success) {
        setTransactions(response.data.transactions);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to load transactions:', error);
      toast.error('加载交易数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取警报数据
  const loadAlerts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        severity: filterType !== 'all' ? filterType : undefined
      };
      
      const response = await alertApi.getAlerts(params);
      if (response.success) {
        setAlerts(response.data.alerts);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to load alerts:', error);
      toast.error('加载警报数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取统计数据
  const loadStats = async () => {
    try {
      const response = await transactionApi.getTransactionStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'transactions') {
      loadTransactions();
    } else {
      loadAlerts();
    }
  }, [activeTab, currentPage, searchTerm, filterStatus, filterType]);

  useEffect(() => {
    loadStats();
  }, []);

  // 处理交易操作
  const handleTransactionAction = async (transactionId: string, action: 'approve' | 'flag' | 'block') => {
    try {
      switch (action) {
        case 'approve':
          await transactionApi.updateTransactionStatus(transactionId, 'completed');
          toast.success('交易已批准');
          break;
        case 'flag':
          await transactionApi.flagTransaction(transactionId);
          toast.success('交易已标记');
          break;
        case 'block':
          await transactionApi.updateTransactionStatus(transactionId, 'blocked');
          toast.success('交易已阻止');
          break;
        default:
          console.log(`执行操作: ${action} 交易ID: ${transactionId}`);
      }
      await Promise.all([loadTransactions(), loadStats()]);
    } catch (error) {
      console.error('操作失败:', error);
      toast.error('操作失败，请重试');
    }
  };

  // 处理警报操作
  const handleAlertAction = async (alertId: string, action: 'resolve' | 'dismiss') => {
    try {
      const newStatus = action === 'resolve' ? 'resolved' : 'dismissed';
      await alertApi.updateAlertStatus(alertId, newStatus);
      toast.success(action === 'resolve' ? '警报已解决' : '警报已忽略');
      await loadAlerts();
    } catch (error) {
      console.error('操作失败:', error);
      toast.error('操作失败，请重试');
    }
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // 处理状态过滤
  const handleStatusFilter = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  // 处理类型过滤
  const handleTypeFilter = (value: string) => {
    setFilterType(value);
    setCurrentPage(1);
  };

  // 重置过滤器
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterType('all');
    setCurrentPage(1);
  };

  const getTransactionStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: '待处理' },
      completed: { color: 'bg-green-100 text-green-800', text: '已完成' },
      failed: { color: 'bg-red-100 text-red-800', text: '失败' },
      blocked: { color: 'bg-gray-100 text-gray-800', text: '已阻止' },
      flagged: { color: 'bg-orange-100 text-orange-800', text: '已标记' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'bg-gray-100 text-gray-800', text: status };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getAlertSeverityBadge = (severity: string) => {
    const severityConfig = {
      low: { color: 'bg-blue-100 text-blue-800', text: '低' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: '中' },
      high: { color: 'bg-red-100 text-red-800', text: '高' },
      critical: { color: 'bg-purple-100 text-purple-800', text: '严重' }
    };
    
    const config = severityConfig[severity as keyof typeof severityConfig] || { color: 'bg-gray-100 text-gray-800', text: severity };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getAlertStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-red-100 text-red-800', text: '活跃' },
      resolved: { color: 'bg-green-100 text-green-800', text: '已解决' },
      dismissed: { color: 'bg-gray-100 text-gray-800', text: '已忽略' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'bg-gray-100 text-gray-800', text: status };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">交易监控</h1>
          <p className="text-gray-600 mt-1">监控和管理平台交易活动</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={16} className="mr-2" />
            导出报告
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总交易数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">待处理</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingTransactions}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已完成</p>
              <p className="text-2xl font-bold text-green-600">{stats.completedTransactions}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已标记</p>
              <p className="text-2xl font-bold text-orange-600">{stats.flaggedTransactions}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Flag className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总交易量</p>
              <p className="text-2xl font-bold text-purple-600">${(stats.totalVolume / 1000000).toFixed(1)}M</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">日交易量</p>
              <p className="text-2xl font-bold text-indigo-600">${(stats.dailyVolume / 1000).toFixed(0)}K</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 分析图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 每日交易量趋势 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">每日交易量趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyVolumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '交易量']} />
              <Line type="monotone" dataKey="volume" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* 交易类型分布 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">交易类型分布</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={transactionTypeData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {transactionTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 标签页和数据表格 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              交易记录
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'alerts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              安全警报
            </button>
          </nav>
        </div>

        {/* 搜索和过滤 */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 搜索框 */}
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={activeTab === 'transactions' ? "搜索交易ID、用户..." : "搜索警报内容..."}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* 状态过滤 */}
            <select
              value={filterStatus}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">所有状态</option>
              {activeTab === 'transactions' ? (
                <>
                  <option value="pending">待处理</option>
                  <option value="completed">已完成</option>
                  <option value="failed">失败</option>
                  <option value="blocked">已阻止</option>
                  <option value="flagged">已标记</option>
                </>
              ) : (
                <>
                  <option value="active">活跃</option>
                  <option value="resolved">已解决</option>
                  <option value="dismissed">已忽略</option>
                </>
              )}
            </select>
            
            {/* 类型过滤 */}
            <select
              value={filterType}
              onChange={(e) => handleTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{activeTab === 'transactions' ? '所有类型' : '所有严重性'}</option>
              {activeTab === 'transactions' ? (
                <>
                  <option value="investment">投资</option>
                  <option value="withdrawal">提现</option>
                  <option value="transfer">转账</option>
                  <option value="refund">退款</option>
                </>
              ) : (
                <>
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                  <option value="critical">严重</option>
                </>
              )}
            </select>
            
            {/* 重置按钮 */}
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              重置筛选
            </button>
          </div>
        </div>

        {/* 数据表格 */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-500">加载中...</p>
            </div>
          ) : (
            <>
              {activeTab === 'transactions' ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">交易ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金额</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-900">{transaction.id.slice(0, 8)}...</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                <Users size={16} className="text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{transaction.user?.username || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{transaction.user?.email || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">${transaction.amount.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{transaction.currency}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getTransactionStatusBadge(transaction.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.created_at).toLocaleString('zh-CN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedItem(transaction);
                                setShowModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye size={16} />
                            </button>
                            {transaction.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleTransactionAction(transaction.id, 'approve')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() => handleTransactionAction(transaction.id, 'flag')}
                                  className="text-yellow-600 hover:text-yellow-900"
                                >
                                  <Flag size={16} />
                                </button>
                                <button
                                  onClick={() => handleTransactionAction(transaction.id, 'block')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">警报类型</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">描述</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">严重性</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">触发时间</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {alerts.map((alert) => (
                      <tr key={alert.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <AlertTriangle size={16} className="text-red-500 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{alert.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{alert.description}</div>
                          {alert.details && (
                            <div className="text-sm text-gray-500 mt-1">{alert.details}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getAlertSeverityBadge(alert.severity)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getAlertStatusBadge(alert.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(alert.created_at).toLocaleString('zh-CN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedItem(alert);
                                setShowModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye size={16} />
                            </button>
                            {alert.status === 'active' && (
                              <>
                                <button
                                  onClick={() => handleAlertAction(alert.id, 'resolve')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() => handleAlertAction(alert.id, 'dismiss')}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  <XCircle size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                显示 {((currentPage - 1) * itemsPerPage) + 1} 到 {Math.min(currentPage * itemsPerPage, totalItems)} 条，共 {totalItems} 条记录
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  上一页
                </button>
                <span className="px-3 py-1 text-sm">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionMonitoring;