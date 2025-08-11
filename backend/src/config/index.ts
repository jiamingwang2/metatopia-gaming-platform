import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

export const config = {
  // 服务器配置
  server: {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    apiVersion: process.env.API_VERSION || 'v1',
  },

  // CORS配置
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },

  // Supabase配置
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  // 邮件服务配置
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASSWORD || '',
    },
    from: process.env.EMAIL_FROM || 'noreply@metatopia.com',
    adminEmail: process.env.EMAIL_ADMIN || 'admin@metatopia.com',
  },

  // 外部API配置
  externalApis: {
    coinGecko: {
      baseUrl: process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3',
      timeout: parseInt(process.env.COINGECKO_TIMEOUT || '10000'),
    },
  },

  // 安全配置
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15分钟
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    },
  },

  // 日志配置
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },
};

// 验证必需的环境变量
export const validateConfig = () => {
  const requiredVars = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

export default config;