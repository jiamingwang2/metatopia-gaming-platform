// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
}

// 分页信息
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
  totalPages: number;
}

// 简化的新闻文章类型（用于列表显示）
export interface NewsArticleSummary {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  published_at?: string;
  category?: NewsCategory;
}

// 新闻文章类型
export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category_id?: string;
  category?: NewsCategory;
  author: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  lang: string;
  is_featured: boolean;
  tags?: NewsTag[];
}

// 新闻分类类型
export interface NewsCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

// 新闻标签类型
export interface NewsTag {
  id: string;
  news_id: string;
  tag_name: string;
  created_at: string;
}

// 团队成员类型
export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  avatar_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  sort_order: number;
  created_at: string;
}

// 路线图项目类型
export interface RoadmapItem {
  id: string;
  title: string;
  description?: string;
  phase: string;
  status: 'completed' | 'in-progress' | 'planned';
  target_date?: string;
  progress_percentage: number;
  created_at: string;
}

// 联系表单提交类型
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  phone?: string;
  ip_address?: string;
  contact_type?: string;
  status: 'pending' | 'replied' | 'resolved';
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

// 代币价格数据类型
export interface TokenPriceData {
  id: string;
  symbol: string;
  name: string;
  current_price_usd: number;
  current_price_cny: number;
  market_cap_usd: number;
  market_cap_cny: number;
  volume_24h_usd: number;
  volume_24h_cny: number;
  price_change_24h_usd: number;
  price_change_24h_cny: number;
  last_updated: string;
}

// 请求查询参数类型
export interface QueryParams {
  page?: number;
  limit?: number;
  category?: string;
  lang?: string;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

// 联系表单请求类型
export interface ContactFormRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  phone?: string;
  type?: string;
}

// 错误类型
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Express扩展类型
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
      pagination?: PaginationInfo;
    }
  }
}
