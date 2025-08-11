import axios from 'axios';
import { tokenUtils } from '../utils/tokenUtils';
import { handleApiError } from '../utils/errorHandler';
import { apiConfig } from '../config/api';

// 创建axios实例
const investmentApi = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
});

// 请求拦截器 - 添加认证token
investmentApi.interceptors.request.use(
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
investmentApi.interceptors.response.use(
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

// 投资接口类型定义
export interface Investment {
  id: string;
  project_id: string;
  user_id: string;
  amount: number;
  currency: string;
  investment_type: 'seed' | 'private' | 'public' | 'ido';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  expected_return: number;
  actual_return?: number;
  vesting_schedule?: {
    total_amount: number;
    released_amount: number;
    next_release_date?: string;
    release_percentage: number;
  };
  transaction_hash?: string;
  created_at: string;
  updated_at: string;
  project?: {
    id: string;
    name: string;
    slug: string;
    logo_url?: string;
    category: string;
    status: string;
  };
}

export interface InvestmentStats {
  total_investments: number;
  total_invested_amount: number;
  total_returns: number;
  active_investments: number;
  completed_investments: number;
  pending_investments: number;
  average_return_rate: number;
  best_performing_project?: {
    name: string;
    return_rate: number;
  };
}

export interface KYCStatus {
  status: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  submitted_at?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  documents: {
    identity_document: boolean;
    proof_of_address: boolean;
    selfie_verification: boolean;
  };
}

export interface KYCSubmission {
  identity_document: File;
  proof_of_address: File;
  selfie_verification: File;
  personal_info: {
    full_name: string;
    date_of_birth: string;
    nationality: string;
    address: string;
    phone_number: string;
  };
}

// 投资API服务
export const investmentApiService = {
  // 获取用户投资列表
  getInvestments: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    project_id?: string;
    investment_type?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }): Promise<{
    investments: Investment[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> => {
    const response = await investmentApi.get('/investments', { params });
    return response.data;
  },

  // 获取投资统计信息
  getInvestmentStats: async (): Promise<InvestmentStats> => {
    const response = await investmentApi.get('/investments/stats');
    return response.data;
  },

  // 获取单个投资详情
  getInvestment: async (id: string): Promise<Investment> => {
    const response = await investmentApi.get(`/investments/${id}`);
    return response.data;
  },

  // 创建新投资
  createInvestment: async (data: {
    project_id: string;
    amount: number;
    currency: string;
    investment_type: 'seed' | 'private' | 'public' | 'ido';
  }): Promise<Investment> => {
    const response = await investmentApi.post('/investments', data);
    return response.data;
  },

  // 更新投资
  updateInvestment: async (id: string, data: Partial<Investment>): Promise<Investment> => {
    const response = await investmentApi.put(`/investments/${id}`, data);
    return response.data;
  },

  // 获取KYC状态
  getKYCStatus: async (): Promise<KYCStatus> => {
    const response = await investmentApi.get('/investments/kyc/status');
    return response.data;
  },

  // 提交KYC申请
  submitKYC: async (data: KYCSubmission): Promise<{ success: boolean; message: string }> => {
    const formData = new FormData();
    
    // 添加文件
    formData.append('identity_document', data.identity_document);
    formData.append('proof_of_address', data.proof_of_address);
    formData.append('selfie_verification', data.selfie_verification);
    
    // 添加个人信息
    Object.entries(data.personal_info).forEach(([key, value]) => {
      formData.append(`personal_info[${key}]`, value);
    });

    const response = await investmentApi.post('/investments/kyc', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default investmentApiService;