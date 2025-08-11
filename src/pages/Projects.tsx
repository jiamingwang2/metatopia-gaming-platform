import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Users, Clock, Star, ArrowRight, DollarSign, Target, Zap } from 'lucide-react';
import { projectApiService, Project, ProjectCategory } from '@/services/projectApi';
import { investmentApiService } from '../services/investmentApi';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import ScrollReveal, { FadeInUp, CascadeReveal } from '../components/ui/ScrollReveal';
import InvestmentModal from '../components/InvestmentModal';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'trending' | 'newest' | 'ending_soon' | 'funding_goal'>('trending');
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadProjects();
  }, [searchTerm, selectedCategory, sortBy]);

  const loadInitialData = async () => {
    try {
      const [categoriesData, featuredData] = await Promise.all([
        projectApiService.getCategories(),
        projectApiService.getFeaturedProjects()
      ]);
      setCategories(categoriesData);
      setFeaturedProjects(featuredData);
    } catch (error) {
      console.error('Failed to load initial data:', error);
      toast.error('加载数据失败');
    }
  };

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      let projectsData: Project[];
      
      if (searchTerm) {
        const response = await projectApiService.searchProjects(searchTerm, {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          limit: 20
        });
        projectsData = response.projects;
      } else {
        switch (sortBy) {
          case 'trending':
            projectsData = await projectApiService.getTrendingProjects();
            break;
          case 'newest':
            projectsData = await projectApiService.getNewProjects();
            break;
          case 'ending_soon':
            projectsData = await projectApiService.getEndingSoonProjects();
            break;
          default:
            const response = await projectApiService.getProjects({
              category: selectedCategory !== 'all' ? selectedCategory : undefined,
              limit: 20
            });
            projectsData = response.projects;
        }
      }
      
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to load projects:', error);
      toast.error('加载项目失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvest = (project: Project) => {
    setSelectedProject(project);
    setShowInvestmentModal(true);
  };

  const handleInvestmentSuccess = () => {
    toast.success('投资申请已提交');
    setShowInvestmentModal(false);
    setSelectedProject(null);
    // 重新加载项目数据以更新投资状态
    loadProjects();
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const calculateProgress = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return '已结束';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days}天`;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    return `${hours}小时`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'completed': return 'text-blue-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '进行中';
      case 'pending': return '即将开始';
      case 'completed': return '已完成';
      case 'cancelled': return '已取消';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <FadeInUp className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-gaming font-bold text-white mb-4">
            加密项目
            <span className="text-gradient">投资平台</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            发现最具潜力的区块链项目，参与早期投资，获得丰厚回报
          </p>
        </FadeInUp>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section className="mb-16">
            <FadeInUp delay={0.2}>
              <h2 className="text-2xl font-gaming font-bold text-white mb-8 flex items-center">
                <Star className="w-6 h-6 text-yellow-400 mr-2" />
                精选项目
              </h2>
            </FadeInUp>
            <CascadeReveal className="grid grid-cols-1 lg:grid-cols-2 gap-8" cascadeDelay={0.1}>
              {featuredProjects.slice(0, 2).map((project) => (
                <AnimatedCard
                  key={project.id}
                  className="bg-gradient-to-br from-primary-800/50 to-primary-900/50 border border-primary-700 p-6 rounded-xl"
                  hoverScale={1.02}
                  glowEffect={true}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={project.logo_url || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cryptocurrency%20project%20logo%20modern%20design&image_size=square'}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-white">{project.name}</h3>
                        <span className={cn('text-sm font-medium', getStatusColor(project.status))}>
                          {getStatusText(project.status)}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-gray-400 mb-1">融资目标</div>
                          <div className="text-lg font-bold text-white">
                            {formatAmount(project.funding_goal)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">已筹集</div>
                          <div className="text-lg font-bold text-green-400">
                            {formatAmount(project.funding_raised)}
                          </div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">进度</span>
                          <span className="text-white">
                            {calculateProgress(project.funding_raised, project.funding_goal).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${calculateProgress(project.funding_raised, project.funding_goal)}%`
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{project.metrics?.total_investors || 0} 投资者</span>
                          </div>
                          {project.end_date && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{getTimeRemaining(project.end_date)}</span>
                            </div>
                          )}
                        </div>
                        <AnimatedButton
                          onClick={() => handleInvest(project)}
                          variant="primary"
                          size="sm"
                          disabled={project.status !== 'active'}
                          className="flex items-center space-x-1"
                        >
                          <DollarSign className="w-4 h-4" />
                          <span>投资</span>
                        </AnimatedButton>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </CascadeReveal>
          </section>
        )}

        {/* Filters and Search */}
        <FadeInUp delay={0.3} className="mb-8">
          <div className="bg-primary-800/30 rounded-xl p-6 border border-primary-700">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="搜索项目..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-primary-700 border border-primary-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-primary-700 border border-primary-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">全部分类</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Sort Filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-primary-700 border border-primary-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="trending">热门项目</option>
                <option value="newest">最新项目</option>
                <option value="ending_soon">即将结束</option>
                <option value="funding_goal">按目标排序</option>
              </select>

              {/* Filter Button */}
              <AnimatedButton
                onClick={loadProjects}
                variant="secondary"
                className="flex items-center justify-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>筛选</span>
              </AnimatedButton>
            </div>
          </div>
        </FadeInUp>

        {/* Projects Grid */}
        <section>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-primary-800/30 rounded-xl p-6 border border-primary-700 animate-pulse">
                  <div className="w-full h-48 bg-gray-700 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-700 rounded mb-2" />
                  <div className="h-3 bg-gray-700 rounded mb-4 w-3/4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-700 rounded" />
                    <div className="h-3 bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">暂无项目</div>
              <p className="text-gray-500">请尝试调整搜索条件或稍后再试</p>
            </div>
          ) : (
            <CascadeReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" cascadeDelay={0.1}>
              {projects.map((project) => (
                <AnimatedCard
                  key={project.id}
                  className="bg-primary-800/30 rounded-xl overflow-hidden border border-primary-700 group"
                  hoverScale={1.03}
                  glowEffect={true}
                >
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.banner_url || project.logo_url || 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=blockchain%20cryptocurrency%20project%20banner%20futuristic%20design&image_size=landscape_4_3'}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(project.status))}>
                        {getStatusText(project.status)}
                      </span>
                    </div>
                    {project.category && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-1 bg-blue-500/80 text-white rounded-full text-xs font-medium">
                          {project.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                      {project.name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">目标</div>
                        <div className="text-sm font-bold text-white">
                          {formatAmount(project.funding_goal)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">已筹集</div>
                        <div className="text-sm font-bold text-green-400">
                          {formatAmount(project.funding_raised)}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">进度</span>
                        <span className="text-white">
                          {calculateProgress(project.funding_raised, project.funding_goal).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${calculateProgress(project.funding_raised, project.funding_goal)}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{project.metrics?.total_investors || 0}</span>
                        </div>
                        {project.end_date && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{getTimeRemaining(project.end_date)}</span>
                          </div>
                        )}
                      </div>
                      <AnimatedButton
                        onClick={() => handleInvest(project)}
                        variant="primary"
                        size="sm"
                        disabled={project.status !== 'active'}
                        className="flex items-center space-x-1"
                      >
                        <span>投资</span>
                        <ArrowRight className="w-3 h-3" />
                      </AnimatedButton>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </CascadeReveal>
          )}
        </section>
      </div>

      {/* Investment Modal */}
      {showInvestmentModal && selectedProject && (
        <InvestmentModal
          project={selectedProject}
          onClose={() => {
            setShowInvestmentModal(false);
            setSelectedProject(null);
          }}
          onSuccess={handleInvestmentSuccess}
        />
      )}
    </div>
  );
};

export default Projects;