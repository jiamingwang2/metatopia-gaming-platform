import axios from 'axios';
import { tokenUtils } from '../utils/tokenUtils';
import { handleApiError } from '../utils/errorHandler';
import { apiConfig } from '../config/api';

// 创建axios实例
const projectApi = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
});

// 请求拦截器 - 添加认证token（可选）
projectApi.interceptors.request.use(
  (config) => {
    const token = tokenUtils.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
projectApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      tokenUtils.removeToken();
      window.location.href = '/login';
    }
    
    // 统一处理API错误
    const appError = handleApiError(error);
    return Promise.reject(appError);
  }
);

// 项目接口类型定义
export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  logo_url?: string;
  banner_url?: string;
  website_url?: string;
  whitepaper_url?: string;
  github_url?: string;
  twitter_url?: string;
  telegram_url?: string;
  discord_url?: string;
  category: string;
  tags: string[];
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  featured: boolean;
  developer_id: string;
  developer?: {
    id: string;
    name: string;
    avatar_url?: string;
    verified: boolean;
  };
  funding_goal: number;
  funding_raised: number;
  funding_currency: string;
  min_investment: number;
  max_investment?: number;
  investment_types: ('seed' | 'private' | 'public' | 'ido')[];
  token_info?: {
    name: string;
    symbol: string;
    total_supply: number;
    initial_price: number;
    listing_price?: number;
  };
  roadmap?: {
    phase: string;
    title: string;
    description: string;
    status: 'completed' | 'in_progress' | 'upcoming';
    target_date?: string;
  }[];
  team_members?: {
    name: string;
    role: string;
    avatar_url?: string;
    bio?: string;
    linkedin_url?: string;
  }[];
  metrics?: {
    total_investors: number;
    funding_progress: number;
    days_remaining?: number;
    roi_estimate?: number;
  };
  created_at: string;
  updated_at: string;
  launch_date?: string;
  end_date?: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  project_count: number;
  icon?: string;
}

export interface ProjectFilters {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  featured?: boolean;
  search?: string;
  sort?: 'name' | 'created_at' | 'funding_raised' | 'funding_progress';
  order?: 'asc' | 'desc';
  min_investment?: number;
  max_investment?: number;
  investment_type?: string;
}

// 项目API服务
export const projectApiService = {
  // 获取项目列表
  getProjects: async (filters?: ProjectFilters): Promise<{
    projects: Project[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> => {
    const response = await projectApi.get('/projects', { params: filters });
    return response.data;
  },

  // 获取精选项目
  getFeaturedProjects: async (limit?: number): Promise<Project[]> => {
    const response = await projectApi.get('/projects/featured', {
      params: { limit },
    });
    if (response.data.success && response.data.data) {
      return response.data.data.projects || [];
    }
    return response.data || [];
  },

  // 获取项目分类
  getCategories: async (): Promise<ProjectCategory[]> => {
    const response = await projectApi.get('/projects/categories');
    if (response.data.success && response.data.data) {
      // 转换后端返回的格式为前端期望的格式
      return response.data.data.categories.map((cat: any) => ({
        id: cat.name,
        name: cat.name,
        slug: cat.name.toLowerCase().replace(/\s+/g, '-'),
        project_count: cat.count
      }));
    }
    return [];
  },

  // 获取开发者的项目
  getProjectsByDeveloper: async (
    developerId: string,
    params?: {
      page?: number;
      limit?: number;
      sort?: string;
      order?: 'asc' | 'desc';
    }
  ): Promise<{
    projects: Project[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> => {
    const response = await projectApi.get(`/projects/developer/${developerId}`, {
      params,
    });
    return response.data;
  },

  // 获取单个项目详情
  getProject: async (idOrSlug: string): Promise<Project> => {
    const response = await projectApi.get(`/projects/${idOrSlug}`);
    return response.data;
  },

  // 创建新项目（需要开发者权限）
  createProject: async (data: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'developer_id'>): Promise<Project> => {
    const response = await projectApi.post('/projects', data);
    return response.data;
  },

  // 更新项目（需要开发者权限）
  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    const response = await projectApi.put(`/projects/${id}`, data);
    return response.data;
  },

  // 删除项目（需要开发者权限）
  deleteProject: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await projectApi.delete(`/projects/${id}`);
    return response.data;
  },

  // 搜索项目
  searchProjects: async (query: string, filters?: Omit<ProjectFilters, 'search'>): Promise<{
    projects: Project[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> => {
    const response = await projectApi.get('/projects', {
      params: { ...filters, search: query },
    });
    return response.data;
  },

  // 获取热门项目
  getTrendingProjects: async (limit: number = 10): Promise<Project[]> => {
    const response = await projectApi.get('/projects', {
      params: {
        sort: 'funding_progress',
        order: 'desc',
        status: 'active',
        limit,
      },
    });
    return response.data.projects;
  },

  // 获取即将结束的项目
  getEndingSoonProjects: async (limit: number = 10): Promise<Project[]> => {
    const response = await projectApi.get('/projects', {
      params: {
        sort: 'end_date',
        order: 'asc',
        status: 'active',
        limit,
      },
    });
    return response.data.projects;
  },

  // 获取新项目
  getNewProjects: async (limit: number = 10): Promise<Project[]> => {
    const response = await projectApi.get('/projects', {
      params: {
        sort: 'created_at',
        order: 'desc',
        status: 'active',
        limit,
      },
    });
    return response.data.projects;
  },
};

export default projectApiService;