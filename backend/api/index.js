const express = require('express');
const cors = require('cors');
const path = require('path');

// 导入路由
const authRoutes = require('../dist/routes/auth');
const userRoutes = require('../dist/routes/users');
const projectRoutes = require('../dist/routes/projects');
const investmentRoutes = require('../dist/routes/investments');
const nftRoutes = require('../dist/routes/nfts');
const transactionRoutes = require('../dist/routes/transactions');
const adminInvestmentRoutes = require('../dist/routes/admin/investments');
const adminProjectRoutes = require('../dist/routes/admin/projects');
const adminTransactionRoutes = require('../dist/routes/adminTransactions');

const app = express();

// 中间件
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://metatopia-platform.vercel.app', 'https://*.vercel.app'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API路由
app.use('/api/auth', authRoutes.default || authRoutes);
app.use('/api/users', userRoutes.default || userRoutes);
app.use('/api/projects', projectRoutes.default || projectRoutes);
app.use('/api/investments', investmentRoutes.default || investmentRoutes);
app.use('/api/nfts', nftRoutes.default || nftRoutes);
app.use('/api/transactions', transactionRoutes.default || transactionRoutes);
app.use('/api/admin/investments', adminInvestmentRoutes.default || adminInvestmentRoutes);
app.use('/api/admin/projects', adminProjectRoutes.default || adminProjectRoutes);
app.use('/api/admin/transactions', adminTransactionRoutes.default || adminTransactionRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

module.exports = app;
