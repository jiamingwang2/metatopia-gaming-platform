import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm, FormErrors } from '../types/auth';
import { toast } from 'sonner';
import { checkNetworkStatus, getNetworkDiagnostics, getErrorMessage } from '../utils/networkUtils';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authState } = useAuth();
  
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnline, setIsOnline] = useState(checkNetworkStatus());

  // 获取重定向路径
  const from = (location.state as any)?.from?.pathname || '/';

  // 如果已经登录，重定向到目标页面
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      navigate(from, { replace: true });
    }
  }, [authState.isAuthenticated, authState.isLoading, navigate, from]);

  // 监听网络状态变化
  useEffect(() => {
    const handleNetworkChange = () => {
      const online = checkNetworkStatus();
      setIsOnline(online);
      if (online) {
        toast.success('网络连接已恢复');
      } else {
        toast.error('网络连接已断开');
      }
    };

    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);
    
    return () => {
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, []);

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 邮箱验证
    if (!formData.email) {
      newErrors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少6位';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await login(formData);
      
      if (response.success) {
        toast.success('登录成功！');
        navigate(from, { replace: true });
      } else {
        toast.error(response.error || '登录失败，请检查您的凭据');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 如果正在加载认证状态，显示加载界面
  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-neon-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-gaming font-bold text-white">
            欢迎回到 <span className="text-gradient">METATOPIA</span>
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            登录您的账户，继续您的GameFi之旅
          </p>
          
          {/* Network Status Indicator */}
          <div className="mt-4 flex items-center justify-center space-x-2">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-500">网络连接正常</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-500" />
                <span className="text-xs text-red-500">网络连接异常</span>
              </>
            )}
          </div>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                邮箱地址
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-primary-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-primary-600'
                  }`}
                  placeholder="请输入您的邮箱地址"
                />
              </div>
              {errors.email && (
                <div className="mt-1 flex items-center space-x-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg bg-primary-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-500 focus:border-transparent transition-all duration-200 ${
                    errors.password ? 'border-red-500' : 'border-primary-600'
                  }`}
                  placeholder="请输入您的密码"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="mt-1 flex items-center space-x-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="h-4 w-4 text-neon-500 focus:ring-neon-500 border-primary-600 rounded bg-primary-800"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                记住我
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-neon-500 hover:text-neon-400 transition-colors duration-200"
              >
                忘记密码？
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting || !isOnline}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-neon-500 to-esports-500 hover:from-neon-600 hover:to-esports-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>登录中...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <LogIn className="w-4 h-4" />
                  <span>登录</span>
                </div>
              )}
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              还没有账户？{' '}
              <Link
                to="/register"
                className="font-medium text-neon-500 hover:text-neon-400 transition-colors duration-200"
              >
                立即注册
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;