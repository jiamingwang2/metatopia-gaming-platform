import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import helmet from 'helmet';
import cors from 'cors';
import { config } from '@/config';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils';

/**
 * 速率限制配置
 */
const rateLimiter = new RateLimiterMemory({
  points: config.security.rateLimit.maxRequests, // 请求次数
  duration: config.security.rateLimit.windowMs / 1000, // 时间窗口（秒）
});

/**
 * 联系表单专用速率限制（更严格）
 */
const contactRateLimiter = new RateLimiterMemory({
  points: 5, // 每15分钟最多5次提交
  duration: 900, // 15分钟
});

/**
 * 通用速率限制中间件
 */
export const rateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    await rateLimiter.consume(clientIp);
    next();
  } catch (rejRes: any) {
    const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
    
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
      url: req.url,
      method: req.method,
      userAgent: req.get('User-Agent'),
    });
    
    res.set('Retry-After', String(secs));
    throw new AppError(
      `Too many requests. Please try again in ${secs} seconds.`,
      429,
      'RATE_LIMIT_EXCEEDED'
    );
  }
};

/**
 * 联系表单速率限制中间件
 */
export const contactRateLimitMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    await contactRateLimiter.consume(clientIp);
    next();
  } catch (rejRes: any) {
    const secs = Math.round(rejRes.msBeforeNext / 1000) || 1;
    
    logger.warn(`Contact form rate limit exceeded for IP: ${req.ip}`, {
      email: req.body?.email,
      userAgent: req.get('User-Agent'),
    });
    
    res.set('Retry-After', String(secs));
    throw new AppError(
      `Too many contact form submissions. Please try again in ${Math.ceil(secs / 60)} minutes.`,
      429,
      'CONTACT_RATE_LIMIT_EXCEEDED'
    );
  }
};

/**
 * CORS配置
 */
export const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    // 允许的源列表
    const allowedOrigins = [
      config.cors.origin,
      'http://localhost:3000',
      'http://localhost:3001',
      'https://localhost:3000',
      'https://localhost:3001',
    ];
    
    // 开发环境允许所有源
    if (config.server.nodeEnv === 'development') {
      return callback(null, true);
    }
    
    // 生产环境检查源 - 支持Vercel和其他部署平台
    const isVercelDomain = origin && (origin.includes('.vercel.app') || origin.includes('.netlify.app'));
    const isCustomDomain = origin && (origin.includes('metatopia.com') || origin.includes('mtp.com'));
    
    if (!origin || allowedOrigins.includes(origin) || isVercelDomain || isCustomDomain) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24小时
};

/**
 * Helmet安全配置
 */
export const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", 'https://api.coingecko.com'],
    },
  },
  crossOriginEmbedderPolicy: false,
};

/**
 * 请求日志中间件
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    };
    
    if (res.statusCode >= 400) {
      logger.warn('Request completed with error', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });
  
  next();
};

/**
 * 健康检查中间件
 */
export const healthCheck = (req: Request, res: Response) => {
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.server.nodeEnv,
    version: process.env.npm_package_version || '1.0.0',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
    },
  };
  
  res.json(healthData);
};

/**
 * 输入清理中间件
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // 递归清理对象中的字符串值
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      // 移除潜在的XSS攻击字符
      return obj
        .replace(/<script[^>]*>.*?<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .trim();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    
    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = sanitize(obj[key]);
        }
      }
      return sanitized;
    }
    
    return obj;
  };
  
  if (req.body) {
    req.body = sanitize(req.body);
  }
  
  if (req.query) {
    req.query = sanitize(req.query);
  }
  
  next();
};

export default {
  rateLimitMiddleware,
  contactRateLimitMiddleware,
  corsOptions,
  helmetOptions,
  requestLogger,
  healthCheck,
  sanitizeInput,
};
