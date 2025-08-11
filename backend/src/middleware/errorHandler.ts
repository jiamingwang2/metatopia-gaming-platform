import { Request, Response, NextFunction } from 'express';
import { errorResponse, logger } from '@/utils';
import { ApiError } from '@/types';

/**
 * 自定义错误类
 */
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 异步错误处理包装器
 */
export const asyncHandler = (fn: (req: Request, res: Response, next?: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 全局错误处理中间件
 */
export const globalErrorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let code = 'INTERNAL_ERROR';

  // 处理自定义错误
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code || 'APP_ERROR';
  }
  // 处理Supabase错误
  else if (error.message.includes('duplicate key')) {
    statusCode = 409;
    message = 'Resource already exists';
    code = 'DUPLICATE_RESOURCE';
  }
  // 处理验证错误
  else if (error.message.includes('validation')) {
    statusCode = 400;
    message = 'Validation failed';
    code = 'VALIDATION_ERROR';
  }
  // 处理未找到错误
  else if (error.message.includes('not found')) {
    statusCode = 404;
    message = 'Resource not found';
    code = 'NOT_FOUND';
  }

  // 记录错误日志
  logger.error(`${code}: ${message}`, {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // 发送错误响应
  res.status(statusCode).json(
    errorResponse(message, process.env.NODE_ENV === 'development' ? error.message : undefined)
  );
};

/**
 * 404错误处理中间件
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404, 'NOT_FOUND');
  next(error);
};

/**
 * 未捕获异常处理
 */
export const setupUncaughtExceptionHandlers = () => {
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Unhandled Rejection', {
      promise: promise.toString(),
      reason: reason
    });
    process.exit(1);
  });
};

export default {
  AppError,
  asyncHandler,
  globalErrorHandler,
  notFoundHandler,
  setupUncaughtExceptionHandlers,
};
