import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: User['role'];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requiredRole,
  redirectTo = '/login',
}) => {
  const { authState } = useAuth();
  const location = useLocation();

  // 如果正在加载认证状态，显示加载界面
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">正在验证身份...</p>
        </div>
      </div>
    );
  }

  // 如果需要认证但用户未登录，重定向到登录页
  if (requireAuth && !authState.isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // 如果需要特定角色但用户角色不匹配，显示无权限页面
  if (requiredRole && authState.user && authState.user.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">访问被拒绝</h1>
          <p className="text-gray-300 mb-6">
            您没有权限访问此页面。需要 {requiredRole} 角色权限。
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
          >
            返回上一页
          </button>
        </div>
      </div>
    );
  }

  // 如果不需要认证或用户已通过认证，渲染子组件
  return <>{children}</>;
};

export default ProtectedRoute;