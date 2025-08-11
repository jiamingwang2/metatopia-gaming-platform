import { ApiResponse, PaginationInfo } from '@/types';
export { AppError, asyncHandler } from '@/middleware/errorHandler';

/**
 * 创建标准化的API响应
 */
export const createApiResponse = <T>(
  success: boolean,
  data?: T,
  message?: string,
  pagination?: PaginationInfo
): ApiResponse<T> => {
  const response: ApiResponse<T> = { success };
  
  if (data !== undefined) response.data = data;
  if (message) response.message = message;
  if (pagination) response.pagination = pagination;
  
  return response;
};

/**
 * 创建成功响应
 */
export const createSuccessResponse = <T>(
  data?: T,
  message?: string,
  pagination?: PaginationInfo
): ApiResponse<T> => {
  return successResponse(data, message, pagination);
};

export const successResponse = <T>(
  data?: T,
  message?: string,
  pagination?: PaginationInfo
): ApiResponse<T> => {
  return createApiResponse(true, data, message, pagination);
};

/**
 * 创建错误响应
 */
export const errorResponse = (
  message: string,
  error?: string
): ApiResponse => {
  return {
    success: false,
    message,
    error,
  };
};

/**
 * 计算分页信息
 */
export const calculatePagination = (
  page: number,
  limit: number,
  total: number
): PaginationInfo => {
  const totalPages = Math.ceil(total / limit);
  const hasMore = page < totalPages;
  
  return {
    page,
    limit,
    total,
    hasMore,
    totalPages,
  };
};

/**
 * 生成URL友好的slug
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 移除特殊字符
    .replace(/[\s_-]+/g, '-') // 替换空格和下划线为连字符
    .replace(/^-+|-+$/g, ''); // 移除开头和结尾的连字符
};

/**
 * 验证邮箱格式
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 清理HTML标签
 */
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

/**
 * 截取文本并添加省略号
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * 格式化日期
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toISOString();
};

/**
 * 延迟函数
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * 安全的JSON解析
 */
export const safeJsonParse = <T>(json: string, defaultValue: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return defaultValue;
  }
};

/**
 * 生成随机字符串
 */
export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * 验证UUID格式
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * 获取客户端IP地址
 */
export const getClientIp = (req: any): string => {
  return getClientIP(req);
};

export const getClientIP = (req: any): string => {
  return req.ip || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress || 
         req.headers['x-forwarded-for']?.split(',')[0] || 
         'unknown';
};

/**
 * 日志工具
 */
export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
};
