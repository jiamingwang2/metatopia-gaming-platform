// API配置文件
// 支持开发环境和生产环境的动态配置

// 获取API基础URL
const getApiBaseUrl = (): string => {
  // 优先使用环境变量
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // 根据当前域名自动判断
  if (typeof window !== 'undefined') {
    const { hostname, protocol } = window.location;
    
    // 生产环境域名检测
    if (hostname.includes('vercel.app') || hostname.includes('netlify.app') || hostname.includes('metatopia.com')) {
      // 生产环境使用同域名的API路径
      return `${protocol}//${hostname}/api`;
    }
    
    // 本地开发环境
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3001/api';
    }
    
    // 其他域名也使用同域名的API路径
    return `${protocol}//${hostname}/api`;
  }
  
  // 服务端渲染或其他情况，默认回退到本地开发环境
  return 'http://localhost:3001/api';
};

// API配置
export const apiConfig = {
  baseURL: getApiBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  // 重试配置
  retries: 3,
  retryDelay: 1000,
};

// 环境检测
export const isProduction = (): boolean => {
  return import.meta.env.PROD || 
         (typeof window !== 'undefined' && 
          !window.location.hostname.includes('localhost') && 
          !window.location.hostname.includes('127.0.0.1'));
};

// 调试模式
export const isDebugMode = (): boolean => {
  return import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true';
};

// 日志输出
export const logApiConfig = (): void => {
  if (isDebugMode()) {
    console.log('🔧 API Configuration:', {
      baseURL: apiConfig.baseURL,
      isProduction: isProduction(),
      environment: import.meta.env.MODE,
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown'
    });
  }
};

// 导出默认配置
export default apiConfig;