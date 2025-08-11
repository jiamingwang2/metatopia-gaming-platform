// Vercel Serverless Function for Backend API
// 生产环境：导入后端应用
const { createApp } = require('../backend/dist/app.js');

// 创建并导出应用实例
module.exports = createApp();