import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  Download,
  AlertTriangle,
  Shield
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { investmentApi, kycApi, Investment, KYCDocument } from '../../services/adminApi';

interface InvestmentStats {
  totalInvestments: number;
  pendingInvestments: number;
  confirmedInvestments: number;
  totalAmount: number;
  pendingKyc: number;
}

const InvestmentManagement: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([]);
  const [stats, setStats] = useState<InvestmentStats>({
    totalInvestments: 0,
    pendingInvestments: 0,
    confirmedInvestments: 0,
    totalAmount: 0,
    pendingKyc: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'investments' | 'kyc'>('investments');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [investmentTypeFilter, setInvestmentTypeFilter] = useState('all');
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Investment | KYCDocument | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 加载投资数据
  const loadInvestments = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        type: investmentTypeFilter !== 'all' ? investmentTypeFilter : undefined
      };
      
      const response = await investmentApi.getInvestments(params);
      if (response.success) {
        setInvestments(response.data.investments);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to load investments:', error);
      toast.error('加载投资数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载KYC数据
  const loadKycDocuments = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      };
      
      const response = await kycApi.getKycDocuments(params);
      if (response.success) {
        setKycDocuments(response.data.documents);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to load KYC documents:', error);
      toast.error('加载KYC数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载统计数据
  const loadStats = async () => {
    try {
      const [investmentStatsResponse, kycStatsResponse] = await Promise.all([
        investmentApi.getInvestmentStats(),
        kycApi.getKycStats()
      ]);
      
      if (investmentStatsResponse.success && kycStatsResponse.success) {
        setStats({
          ...investmentStatsResponse.data,
          pendingKyc: kycStatsResponse.data.pending
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  // 初始化数据
  useEffect(() => {
    if (activeTab === 'investments') {
      loadInvestments();
    } else {
      loadKycDocuments();
    }
  }, [activeTab, currentPage, searchTerm, statusFilter, investmentTypeFilter]);

  useEffect(() => {
    loadStats();
  }, []);

  // 处理投资操作
  const handleInvestmentAction = async (investmentId: string, action: 'confirm' | 'cancel') => {
    try {
      const newStatus = action === 'confirm' ? 'confirmed' : 'cancelled';
      await investmentApi.updateInvestmentStatus(investmentId, newStatus);
      toast.success(action === 'confirm' ? '投资已确认' : '投资已取消');
      await Promise.all([loadInvestments(), loadStats()]);
    } catch (error) {
      console.error('操作失败:', error);
      toast.error('操作失败，请重试');
    }
  };

  // 处理KYC操作
  const handleKycAction = async (kycId: string, action: 'approve' | 'reject') => {
    try {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      await kycApi.updateKycStatus(kycId, newStatus);
      toast.success(action === 'approve' ? 'KYC已批准' : 'KYC已拒绝');
      await Promise.all([loadKycDocuments(), loadStats()]);
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
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // 处理投资类型过滤
  const handleInvestmentTypeFilter = (value: string) => {
    setInvestmentTypeFilter(value);
    setCurrentPage(1);
  };

  // 重置过滤器
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setInvestmentTypeFilter('all');
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: '待确认' },
      confirmed: { color: 'bg-green-100 text-green-800', text: '已确认' },
      cancelled: { color: 'bg-red-100 text-red-800', text: '已取消' },
      approved: { color: 'bg-green-100 text-green-800', text: '已批准' },
      rejected: { color: 'bg-red-100 text-red-800', text: '已拒绝' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'bg-gray-100 text-gray-800', text: status };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getRiskBadge = (riskLevel: string) => {
    const riskConfig = {
      low: { color: 'bg-green-100 text-green-800', text: '低风险' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: '中风险' },
      high: { color: 'bg-red-100 text-red-800', text: '高风险' }
    };
    
    const config = riskConfig[riskLevel as keyof typeof riskConfig] || { color: 'bg-gray-100 text-gray-800', text: riskLevel };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getDocumentTypeName = (type: string) => {
    const typeNames = {
      identity: '身份证明',
      address: '地址证明',
      income: '收入证明',
      bank: '银行证明'
    };
    return typeNames[type as keyof typeof typeNames] || type;
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">投资管理</h1>
          <p className="text-gray-600 mt-1">管理用户投资记录和KYC审核</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={16} className="mr-2" />
            导出数据
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总投资数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInvestments}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">待确认投资</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingInvestments}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已确认投资</p>
              <p className="text-2xl font-bold text-green-600">{stats.confirmedInvestments}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总投资金额</p>
              <p className="text-2xl font-bold text-purple-600">${(stats.totalAmount / 1000000).toFixed(1)}M</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">待审核KYC</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendingKyc}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('investments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'investments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              投资记录
            </button>
            <button
              onClick={() => setActiveTab('kyc')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'kyc'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              KYC审核
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
                placeholder={activeTab === 'investments' ? "搜索用户名、邮箱..." : "搜索用户名、邮箱..."}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* 状态过滤 */}
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">所有状态</option>
              {activeTab === 'investments' ? (
                <>
                  <option value="pending">待确认</option>
                  <option value="confirmed">已确认</option>
                  <option value="cancelled">已取消</option>
                </>
              ) : (
                <>
                  <option value="pending">待审核</option>
                  <option value="approved">已批准</option>
                  <option value="rejected">已拒绝</option>
                </>
              )}
            </select>
            
            {/* 投资类型过滤（仅投资记录） */}
            {activeTab === 'investments' && (
              <select
                value={investmentTypeFilter}
                onChange={(e) => handleInvestmentTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">所有类型</option>
                <option value="seed">种子轮</option>
                <option value="private">私募轮</option>
                <option value="public">公募轮</option>
                <option value="ido">IDO</option>
              </select>
            )}
            
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
              {activeTab === 'investments' ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户信息</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">项目</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">投资金额</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">风险等级</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">投资时间</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {investments.map((investment) => (
                      <tr key={investment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <Users size={20} className="text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{investment.user?.username || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{investment.user?.email || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{investment.project?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{investment.project?.category || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">${investment.amount.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{investment.token_amount} tokens</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {investment.investment_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(investment.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRiskBadge(investment.risk_level)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(investment.created_at).toLocaleDateString('zh-CN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedItem(investment);
                                setShowModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye size={16} />
                            </button>
                            {investment.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleInvestmentAction(investment.id, 'confirm')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() => handleInvestmentAction(investment.id, 'cancel')}
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户信息</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">文档类型</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">提交时间</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">审核时间</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {kycDocuments.map((kyc) => (
                      <tr key={kyc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <Users size={20} className="text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{kyc.user?.username || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{kyc.user?.email || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText size={16} className="text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{getDocumentTypeName(kyc.document_type)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(kyc.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(kyc.created_at).toLocaleDateString('zh-CN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {kyc.reviewed_at ? new Date(kyc.reviewed_at).toLocaleDateString('zh-CN') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedItem(kyc);
                                setShowModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye size={16} />
                            </button>
                            {kyc.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleKycAction(kyc.id, 'approve')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <CheckCircle size={16} />
                                </button>
                                <button
                                  onClick={() => handleKycAction(kyc.id, 'reject')}
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

export default InvestmentManagement;