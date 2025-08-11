import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminProtectedRoute from '../../components/AdminProtectedRoute';
import AdminLayout from './AdminLayout';
import AdminLogin from './AdminLogin';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import ProjectManagement from './ProjectManagement';
import InvestmentManagement from './InvestmentManagement';
import TransactionMonitoring from './TransactionMonitoring';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 管理员登录页面 - 不需要认证 */}
      <Route path="/login" element={<AdminLogin />} />
      
      {/* 管理员后台页面 - 需要认证 */}
      <Route path="/" element={
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      }>
        {/* 默认重定向到仪表板 */}
        <Route index element={<Navigate to="dashboard" replace />} />
        
        {/* 仪表板 - 所有管理员都可以访问 */}
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* 用户管理 - 需要用户管理权限 */}
        <Route path="users" element={<UserManagement />} />
        
        {/* 项目管理 - 需要项目管理权限 */}
        <Route path="projects" element={<ProjectManagement />} />
        
        {/* 投资管理 - 需要投资管理权限 */}
        <Route path="investments" element={<InvestmentManagement />} />
        
        {/* 交易监控 - 需要交易监控权限 */}
        <Route path="transactions" element={<TransactionMonitoring />} />
      </Route>
      
      {/* 404页面 */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-gray-600 mb-8">页面未找到</p>
            <a 
              href="/admin/dashboard" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              返回仪表板
            </a>
          </div>
        </div>
      } />
    </Routes>
  );
};

export default AdminRoutes;