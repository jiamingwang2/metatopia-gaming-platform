#!/usr/bin/env node

/**
 * Metatopia API Server
 * 服务器启动入口文件
 */

import { startServer } from './app';
import { logger } from '@/utils';

// 启动服务器
startServer().catch((error) => {
  logger.error('Failed to start server', {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});
