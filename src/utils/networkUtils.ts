// 网络工具函数
// 用于生产环境的网络诊断和错误处理

import { apiConfig, isProduction, isDebugMode } from '../config/api';

/**
 * 网络连接状态检测
 */
export const checkNetworkStatus = (): boolean => {
  return navigator.onLine;
};

/**
 * API连通性测试
 */
export const testApiConnectivity = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${apiConfig.baseURL.replace('/api', '')}`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: 'API连接正常',
        details: data,
      };
    } else {
      return {
        success: false,
        message: `API响应错误: ${response.status} ${response.statusText}`,
        details: {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        },
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: '无法连接到API服务器',
      details: {
        error: error.message,
        name: error.name,
        baseURL: apiConfig.baseURL,
        isProduction: isProduction(),
        networkOnline: checkNetworkStatus(),
      },
    };
  }
};

/**
 * 生产环境错误报告
 */
export const reportProductionError = (error: any, context: string): void => {
  if (isProduction() && !isDebugMode()) {
    // 在生产环境中，可以发送错误报告到监控服务
    console.error(`[${context}] Production Error:`, {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      apiBaseURL: apiConfig.baseURL,
    });
  } else {
    // 开发环境显示详细错误信息
    console.error(`[${context}] Error:`, error);
  }
};

/**
 * 网络重试机制
 */
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      if (i === maxRetries) {
        throw error;
      }
      
      // 检查是否是网络错误，如果是则重试
      if (error instanceof TypeError && error.message.includes('fetch')) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        continue;
      }
      
      // 其他错误直接抛出
      throw error;
    }
  }
  
  throw lastError;
};

/**
 * 获取详细的网络诊断信息
 */
export const getNetworkDiagnostics = async (): Promise<{
  networkStatus: boolean;
  apiConnectivity: any;
  configuration: any;
}> => {
  const networkStatus = checkNetworkStatus();
  const apiConnectivity = await testApiConnectivity();
  
  return {
    networkStatus,
    apiConnectivity,
    configuration: {
      baseURL: apiConfig.baseURL,
      timeout: apiConfig.timeout,
      isProduction: isProduction(),
      isDebugMode: isDebugMode(),
      hostname: window.location.hostname,
      protocol: window.location.protocol,
    },
  };
};

/**
 * 显示用户友好的错误信息
 */
export const getErrorMessage = (error: any): string => {
  // 网络离线
  if (!checkNetworkStatus()) {
    return '网络连接已断开，请检查网络设置后重试';
  }
  
  // 超时错误
  if (error.name === 'AbortError' || error.message.includes('timeout')) {
    return '请求超时，请检查网络连接或稍后重试';
  }
  
  // 连接错误
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return '无法连接到服务器，请检查网络连接';
  }
  
  // 服务器错误
  if (error.response) {
    const status = error.response.status;
    if (status >= 500) {
      return '服务器暂时不可用，请稍后重试';
    } else if (status === 404) {
      return '请求的资源不存在';
    } else if (status === 401) {
      return '身份验证失败，请重新登录';
    } else if (status === 403) {
      return '没有权限访问此资源';
    }
  }
  
  // 默认错误信息
  return error.message || '发生未知错误，请稍后重试';
};