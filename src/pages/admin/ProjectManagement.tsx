import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Gamepad2,
  Star,
  DollarSign,
  Calendar,
  Users,
  TrendingUp,
  Download,
  Plus
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { projectApi, Project } from '../../services/adminApi';

interface ProjectStats {
  total: number;
  pending: number;
  active: number;
  completed: number;
  totalFunding: number;
}

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ProjectStats>({
    total: 0,
    pending: 0,
    active: 0,
    completed: 0,
    totalFunding: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

  // 加载项目数据
  const loadProjects = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined
      };
      
      const response = await projectApi.getProjects(params);
      if (response.success) {
        setProjects(response.data.projects);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
      toast.error('加载项目数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载统计数据
  const loadStats = async () => {
    try {
      const response = await projectApi.getProjectStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [currentPage, searchTerm, statusFilter, categoryFilter]);

  useEffect(() => {
    loadStats();
  }, []);

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

  // 处理类别过滤
  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  // 重置过滤器
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setCurrentPage(1);
  };

  // 项目操作
  const handleProjectAction = async (projectId: string, action: 'approve' | 'reject' | 'launch' | 'delete') => {
    try {
      switch (action) {
        case 'approve':
          await projectApi.updateProjectStatus(projectId, 'active');
          toast.success('项目已批准');
          break;
        case 'reject':
          await projectApi.updateProjectStatus(projectId, 'cancelled');
          toast.success('项目已拒绝');
          break;
        case 'launch':
          await projectApi.updateProjectStatus(projectId, 'active');
          toast.success('项目已上线');
          break;
        case 'delete':
          await projectApi.deleteProject(projectId);
          toast.success('项目已删除');
          break;
        default:
          console.log(`执行操作: ${action} 项目ID: ${projectId}`);
      }
      // 重新加载数据
      await Promise.all([loadProjects(), loadStats()]);
    } catch (error) {
      console.error('操作失败:', error);
      toast.error('操作失败，请重试');
    }
  };

  // 切换特色推荐
  const handleToggleFeatured = async (projectId: string, currentFeatured: boolean) => {
    try {
      await projectApi.updateProject(projectId, { is_featured: !currentFeatured });
      toast.success(currentFeatured ? '已取消特色推荐' : '已设为特色推荐');
      await loadProjects();
    } catch (error) {
      console.error('操作失败:', error);
      toast.error('操作失败，请重试');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: '待审核' },
      active: { color: 'bg-green-100 text-green-800', text: '进行中' },
      cancelled: { color: 'bg-red-100 text-red-800', text: '已取消' },
      completed: { color: 'bg-blue-100 text-blue-800', text: '已完成' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'bg-gray-100 text-gray-800', text: status };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      rpg: { color: 'bg-purple-100 text-purple-800', text: 'RPG游戏' },
      strategy: { color: 'bg-blue-100 text-blue-800', text: '策略游戏' },
      nft: { color: 'bg-pink-100 text-pink-800', text: 'NFT项目' },
      metaverse: { color: 'bg-indigo-100 text-indigo-800', text: '元宇宙' },
      defi: { color: 'bg-green-100 text-green-800', text: 'DeFi' }
    };
    
    const config = categoryConfig[category as keyof typeof categoryConfig];
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
    const fundingPercentage = project.target_amount > 0 ? (project.raised_amount / project.target_amount) * 100 : 0;
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* 项目图片 */}
        <div className="h-48 bg-gray-200 relative">
          {(project.banner_url || project.logo_url) ? (
            <img 
              src={project.banner_url || project.logo_url || ''} 
              alt={project.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Gamepad2 size={48} className="text-gray-400" />
            </div>
          )}
          <div className="absolute top-3 left-3">
            {getStatusBadge(project.status)}
          </div>
          <div className="absolute top-3 right-3">
            {getCategoryBadge(project.category)}
          </div>
          {project.is_featured && (
            <div className="absolute bottom-3 left-3">
              <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
                特色推荐
              </span>
            </div>
          )}
        </div>
        
        {/* 项目信息 */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{project.name}</h3>
            {project.rating && project.rating > 0 && (
              <div className="flex items-center text-yellow-500">
                <Star size={16} className="fill-current" />
                <span className="text-sm text-gray-600 ml-1">{project.rating}</span>
              </div>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
          
          <div className="space-y-3">
            {/* 融资进度 */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">融资进度</span>
                <span className="font-medium">
                  ${project.raised_amount.toLocaleString()} / ${project.target_amount.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{project.metrics?.total_investors || 0} 投资者</span>
                <span>{fundingPercentage.toFixed(1)}%</span>
              </div>
            </div>
            
            {/* 时间信息 */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>创建：{new Date(project.created_at).toLocaleDateString('zh-CN')}</span>
              <span>周期：{new Date(project.start_date).toLocaleDateString('zh-CN')} - {new Date(project.end_date).toLocaleDateString('zh-CN')}</span>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => {
                setSelectedProject(project);
                setShowProjectModal(true);
              }}
              className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Eye size={16} className="mr-1" />
              查看详情
            </button>
            
            {project.status === 'pending' && (
              <>
                <button
                  onClick={() => handleProjectAction(project.id, 'approve')}
                  className="flex items-center justify-center px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle size={16} />
                </button>
                <button
                  onClick={() => handleProjectAction(project.id, 'reject')}
                  className="flex items-center justify-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle size={16} />
                </button>
              </>
            )}
            
            <button
              onClick={() => handleToggleFeatured(project.id, project.is_featured)}
              className={`flex items-center justify-center px-3 py-2 text-sm rounded-lg transition-colors ${
                project.is_featured 
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Star size={16} className={project.is_featured ? 'fill-current' : ''} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">项目管理</h1>
          <p className="text-gray-600 mt-1">审核和管理平台上的游戏项目</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus size={16} className="mr-2" />
            添加项目
          </button>
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
              <p className="text-sm font-medium text-gray-600">总项目数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Gamepad2 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">待审核</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">活跃项目</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">已完成</p>
              <p className="text-2xl font-bold text-purple-600">{stats.completed}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">总融资额</p>
              <p className="text-2xl font-bold text-indigo-600">${(stats.totalFunding / 1000000).toFixed(1)}M</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <DollarSign className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索项目名称、描述..."
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
            <option value="pending">待审核</option>
            <option value="active">进行中</option>
            <option value="cancelled">已取消</option>
            <option value="completed">已完成</option>
          </select>
          
          {/* 类别过滤 */}
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">所有类别</option>
            <option value="rpg">RPG游戏</option>
            <option value="strategy">策略游戏</option>
            <option value="nft">NFT项目</option>
            <option value="metaverse">元宇宙</option>
            <option value="defi">DeFi</option>
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

      {/* 项目网格 */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          
          {/* 分页 */}
          {totalPages > 1 && (
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
          )}
        </>
      )}
    </div>
  );
};

export default ProjectManagement;