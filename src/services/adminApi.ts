import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';
import { apiConfig } from '../config/api';

// 创建axios实例
const adminApi = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
});

// 请求拦截器 - 添加管理员token
adminApi.interceptors.request.use(
  (config) => {
    // 从localStorage获取管理员token
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
      const user = JSON.parse(adminUser);
      // 根据用户角色设置不同的token
      const token = user.role === 'admin' ? 'admin-token-123' : 'super-admin-token-456';
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 未授权，清除本地存储并跳转到登录页
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    } else if (error.response?.status === 403) {
      // 权限不足
      console.error('权限不足');
    }
    
    // 统一处理API错误
    const appError = handleApiError(error);
    return Promise.reject(appError);
  }
);

// 用户相关接口
export interface User {
  id: string;
  email: string;
  username?: string;
  display_name?: string;
  name: string;
  phone?: string;
  role: 'user' | 'vip' | 'project_owner' | 'admin';
  kyc_verified: boolean;
  kyc_level: number;
  balance: number;
  total_investment: number;
  total_earnings: number;
  reputation_score: number;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  user_type: 'player' | 'esports_player' | 'developer' | 'investor' | 'community';
}

export interface UserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  kyc_status?: string;
}

export interface UserListResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface UserStatsResponse {
  success: boolean;
  data: {
    totalUsers: number;
    activeUsers: number;
    kycVerifiedUsers: number;
    newUsersLast30Days: number;
    roleDistribution: Record<string, number>;
  };
}

// 项目相关接口
export interface Project {
  id: string;
  creator_id: string;
  title: string;
  name: string;
  description: string;
  target_amount: number;
  raised_amount: number;
  min_investment: number;
  status: 'pending' | 'cancelled' | 'active' | 'completed';
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  metrics?: {
    total_investors: number;
    funding_progress: number;
    days_remaining: number;
    roi_estimate: number;
  };
  slug?: string;
  detailed_description?: string;
  category?: string;
  logo_url?: string;
  banner_url?: string;
  screenshots?: string[];
  gameplay_video_url?: string;
  whitepaper_url?: string;
  website_url?: string;
  github_url?: string;
  discord_url?: string;
  twitter_url?: string;
  token_symbol?: string;
  token_contract_address?: string;
  total_supply?: number;
  circulating_supply?: number;
  market_cap?: number;
  launch_date?: string;
  funding_goal?: number;
  funding_raised?: number;
  investor_count?: number;
  rating?: number;
  review_count?: number;
  is_featured?: boolean;
  users?: {
    id: string;
    username: string;
    email: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export interface ProjectListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
}

export interface ProjectListResponse {
  success: boolean;
  data: {
    projects: Project[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ProjectStatsResponse {
  success: boolean;
  data: {
    total: number;
    pending: number;
    approved: number;
    active: number;
    completed: number;
    totalFunding: number;
  };
}

// 用户管理API
export const userApi = {
  // 获取用户列表
  getUsers: async (params: UserListParams = {}): Promise<UserListResponse> => {
    const response = await adminApi.get('/admin/users', { params });
    return response.data;
  },

  // 获取用户统计
  getUserStats: async (): Promise<UserStatsResponse> => {
    const response = await adminApi.get('/admin/users/stats');
    return response.data;
  },

  // 获取单个用户
  getUser: async (id: string): Promise<{ success: boolean; data: User }> => {
    const response = await adminApi.get(`/admin/users/${id}`);
    return response.data;
  },

  // 更新用户状态
  updateUserStatus: async (id: string, isActive: boolean): Promise<{ success: boolean; message: string }> => {
    const response = await adminApi.patch(`/admin/users/${id}/status`, { is_active: isActive });
    return response.data;
  },

  // 更新用户KYC状态
  updateUserKYC: async (id: string, kycLevel: number, kycVerified: boolean): Promise<{ success: boolean; message: string }> => {
    const response = await adminApi.patch(`/admin/users/${id}/kyc`, { kyc_level: kycLevel, kyc_verified: kycVerified });
    return response.data;
  },

  // 更新用户角色
  updateUserRole: async (id: string, role: string): Promise<{ success: boolean; message: string }> => {
    const response = await adminApi.patch(`/admin/users/${id}/role`, { role });
    return response.data;
  },

  // 删除用户
  deleteUser: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await adminApi.delete(`/admin/users/${id}`);
    return response.data;
  },
};

// 项目管理API
export const projectApi = {
  // 获取项目列表
  getProjects: async (params: ProjectListParams = {}): Promise<ProjectListResponse> => {
    const response = await adminApi.get('/admin/projects', { params });
    return response.data;
  },

  // 获取项目统计
  getProjectStats: async (): Promise<ProjectStatsResponse> => {
    const response = await adminApi.get('/admin/projects/stats');
    return response.data;
  },

  // 获取单个项目
  getProject: async (id: string): Promise<{ success: boolean; data: Project }> => {
    const response = await adminApi.get(`/admin/projects/${id}`);
    return response.data;
  },

  // 更新项目状态
  updateProjectStatus: async (id: string, status: string): Promise<{ success: boolean; message: string }> => {
    const response = await adminApi.patch(`/admin/projects/${id}/status`, { status });
    return response.data;
  },

  // 更新项目推荐状态
  updateProjectFeatured: async (id: string, isFeatured: boolean): Promise<{ success: boolean; message: string }> => {
    const response = await adminApi.patch(`/admin/projects/${id}/featured`, { is_featured: isFeatured });
    return response.data;
  },

  // 删除项目
  deleteProject: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await adminApi.delete(`/admin/projects/${id}`);
    return response.data;
  },
};

// 投资相关接口
interface Investment {
  id: string;
  user_id: string;
  project_id: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  investment_type?: string;
  currency?: string;
  token_price?: number;
  token_amount?: number;
  transaction_hash?: string;
  created_at: string;
  updated_at: string;
  username?: string;
  email?: string;
  projectName?: string;
  kycStatus?: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

interface KYCDocument {
  id: string;
  userId: string;
  username: string;
  email: string;
  documentType: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  kycLevel?: number;
  documents?: any[];
}

interface InvestmentListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  investment_type?: string;
}

interface InvestmentListResponse {
  success: boolean;
  data: {
    investments: Investment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface KYCListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

interface KYCListResponse {
  success: boolean;
  data: {
    kycDocuments: KYCDocument[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

interface InvestmentStatsResponse {
  success: boolean;
  data: {
    total: number;
    pending: number;
    confirmed: number;
    totalAmount: number;
    pendingKyc: number;
  };
}

export const investmentApi = {
  // 获取投资列表
  getInvestments: async (params: InvestmentListParams = {}): Promise<InvestmentListResponse> => {
    const response = await adminApi.get('/admin/investments', { params });
    return response.data;
  },

  // 获取投资统计
  getInvestmentStats: async (): Promise<InvestmentStatsResponse> => {
    const response = await adminApi.get('/admin/investments/stats');
    return response.data;
  },

  // 获取单个投资记录
  getInvestment: async (id: string): Promise<{ success: boolean; data: Investment }> => {
    const response = await adminApi.get(`/admin/investments/${id}`);
    return response.data;
  },

  // 更新投资状态
  updateInvestmentStatus: async (id: string, status: string, transactionHash?: string): Promise<{ success: boolean; message: string }> => {
    const response = await adminApi.patch(`/admin/investments/${id}/status`, { status, transaction_hash: transactionHash });
    return response.data;
  },

  // 获取KYC文档列表
  getKycDocuments: async (params: KYCListParams = {}): Promise<KYCListResponse> => {
    const response = await adminApi.get('/admin/kyc', { params });
    return response.data;
  },

  // 更新KYC状态
  updateKycStatus: async (id: string, status: string, kycLevel?: number, notes?: string): Promise<{ success: boolean; message: string }> => {
    const response = await adminApi.patch(`/admin/kyc/${id}`, { status, kyc_level: kycLevel, notes });
    return response.data;
  },
};

export default adminApi;