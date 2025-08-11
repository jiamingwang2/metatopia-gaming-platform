import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { config, validateConfig } from './config';
import { testDatabaseConnection } from './config/database';
import routes from './routes';
import {
  globalErrorHandler,
  notFoundHandler,
  setupUncaughtExceptionHandlers,
} from './middleware/errorHandler';
import {
  corsOptions,
  helmetOptions,
  requestLogger,
  sanitizeInput,
} from './middleware/security';
import { logger } from './utils';
import { AppError } from './middleware/errorHandler';

/**
 * 创建Express应用
 */
function createApp(): express.Application {
  const app = express();

  // 设置未捕获异常处理
  setupUncaughtExceptionHandlers();

  // 信任代理（用于获取真实IP）
  app.set('trust proxy', 1);

  // 安全中间件
  app.use(helmet(helmetOptions));
  app.use(cors(corsOptions));

  // 请求解析中间件
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 压缩响应
  app.use(compression());

  // 输入清理
  app.use(sanitizeInput);

  // 日志中间件
  if (config.server.nodeEnv === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(morgan('combined'));
  }
  app.use(requestLogger);

  // API路由
  app.use('/api', routes);

  // 根路径
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Metatopia API Server is running',
      version: '1.0.0',
      environment: config.server.nodeEnv,
      timestamp: new Date().toISOString(),
    });
  });

  // 404处理
  app.use(notFoundHandler);

  // 全局错误处理
  app.use(globalErrorHandler);

  return app;
}

/**
 * 启动服务器
 */
export async function startServer(): Promise<void> {
  try {
    // 验证配置
  validateConfig();
    logger.info('Configuration validated successfully');

    // 测试数据库连接
    await testDatabaseConnection();
    logger.info('Database connection established successfully');

    // 创建应用
    const app = createApp();

    // 启动服务器
    const server = app.listen(config.server.port, () => {
      logger.info(`Server is running on port ${config.server.port}`, {
        environment: config.server.nodeEnv,
        port: config.server.port,
        apiVersion: config.server.apiVersion,
      });
    });

    // 优雅关闭处理
    const gracefulShutdown = (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully`);
      
      server.close(() => {
        logger.info('Server closed successfully');
        process.exit(0);
      });

      // 强制关闭超时
      setTimeout(() => {
        logger.error('Forced shutdown due to timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error: any) {
    logger.error('Failed to start server', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
}

// 如果直接运行此文件，启动服务器
if (require.main === module) {
  startServer();
}

export { createApp };
export default createApp();
