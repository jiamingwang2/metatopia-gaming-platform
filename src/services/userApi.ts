import axios from 'axios';
import { tokenUtils } from '../utils/tokenUtils';
import { handleApiError } from '../utils/errorHandler';
import { apiConfig } from '../config/api';

// 创建axios实例
const userApi = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
});

// 请求拦截器 - 添加认证token
userApi.interceptors.request.use(
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
userApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token过期或无效，清除本地存储并跳转到登录页
      tokenUtils.removeToken();
      window.location.href = '/login';
    }
    
    // 统一处理API错误
    const appError = handleApiError(error);
    return Promise.reject(appError);
  }
);

// 用户接口类型定义
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  user_type: 'individual' | 'institution';
  wallet_address?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  total_investments: number;
  total_invested_amount: number;
  total_returns: number;
  active_projects: number;
  completed_projects: number;
  success_rate: number;
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon_url: string;
  earned_at: string;
  category: string;
}

export interface WalletBalance {
  currency: string;
  available: number;
  frozen: number;
  total: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'investment' | 'return' | 'fee';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  fee?: number;
  address?: string;
  tx_hash?: string;
  transaction_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionStats {
  total_transactions: number;
  total_deposits: number;
  total_withdrawals: number;
  total_volume: number;
  pending_transactions: number;
}

// 用户API服务
export const userApiService = {
  // 获取用户资料
  getProfile: async (): Promise<UserProfile> => {
    const response = await userApi.get('/users/profile');
    return response.data;
  },

  // 更新用户资料
  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await userApi.put('/users/profile', data);
    return response.data;
  },

  // 连接钱包地址
  connectWallet: async (walletAddress: string): Promise<{ success: boolean; message: string }> => {
    const response = await userApi.post('/users/connect-wallet', {
      wallet_address: walletAddress,
    });
    return response.data;
  },

  // 获取用户统计信息
  getStats: async (): Promise<UserStats> => {
    const response = await userApi.get('/users/stats');
    return response.data;
  },

  // 获取用户成就
  getAchievements: async (): Promise<UserAchievement[]> => {
    const response = await userApi.get('/users/achievements');
    return response.data;
  },

  // 获取钱包余额
  getWalletBalances: async (): Promise<WalletBalance[]> => {
    const response = await userApi.get('/transactions/balances');
    return response.data;
  },

  // 获取交易记录
  getTransactions: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    currency?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> => {
    const response = await userApi.get('/transactions', { params });
    return response.data;
  },

  // 获取交易统计
  getTransactionStats: async (): Promise<TransactionStats> => {
    const response = await userApi.get('/transactions/stats');
    return response.data;
  },

  // 创建交易（充值/提现）
  createTransaction: async (data: {
    type: 'deposit' | 'withdraw';
    amount: number;
    currency: string;
    wallet_address?: string;
    description?: string;
  }): Promise<Transaction> => {
    const response = await userApi.post('/transactions', data);
    return response.data;
  },

  // 获取单个交易详情
  getTransaction: async (id: string): Promise<Transaction> => {
    const response = await userApi.get(`/transactions/${id}`);
    return response.data;
  },
};

export default userApiService;