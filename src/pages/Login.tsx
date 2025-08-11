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
        toast.success('登录成功！', {
          description: '欢迎回到 METATOPIA',
        });
        // 导航将由 useEffect 处理
      } else {
        toast.error('登录失败', {
          description: response.error || '请检查您的邮箱和密码',
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // 获取用户友好的错误信息
      const errorMessage = getErrorMessage(error);
      
      // 进行网络诊断（仅在调试模式下）
      if (process.env.NODE_ENV === 'development') {
        try {
          const diagnosis = await getNetworkDiagnostics();
          console.log('网络诊断结果:', diagnosis);
        } catch (diagError) {
          console.error('网络诊断失败:', diagError);
        }
      }
      
      toast.error('登录失败', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 快速登录（演示用）
  const handleQuickLogin = () => {
    setFormData({
      email: 'test@metatopia.com',
      password: 'password123',
      rememberMe: true,
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* 登录卡片 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* 头部 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">欢迎回来</h1>
            <p className="text-gray-300">登录您的 METATOPIA 账户</p>
            
            {/* 网络状态指示器 */}
            <div className={`mt-4 flex items-center justify-center gap-2 text-sm ${
              isOnline ? 'text-green-400' : 'text-red-400'
            }`}>
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span>{isOnline ? '网络连接正常' : '网络连接异常'}</span>
            </div>
          </div>

          {/* 快速登录提示 */}
          <div className="mb-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-lg">
            <div className="flex items-center gap-2 text-blue-300 text-sm mb-2">
              <CheckCircle className="w-4 h-4" />
              <span>演示账户</span>
            </div>
            <p className="text-xs text-blue-200 mb-2">邮箱: test@metatopia.com</p>
            <p className="text-xs text-blue-200 mb-3">密码: password123</p>
            <button
              type="button"
              onClick={handleQuickLogin}
              className="text-xs text-blue-300 hover:text-blue-200 underline"
            >
              点击快速填充
            </button>
          </div>

          {/* 登录表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 邮箱输入 */}
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
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.email
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-gray-600 focus:ring-purple-400 focus:border-purple-400'
                  }`}
                  placeholder="请输入您的邮箱"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <div className="mt-2 flex items-center gap-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* 密码输入 */}
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
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.password
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-gray-600 focus:ring-purple-400 focus:border-purple-400'
                  }`}
                  placeholder="请输入您的密码"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <div className="mt-2 flex items-center gap-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* 记住我和忘记密码 */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 bg-white/10 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-300">记住我</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                忘记密码？
              </Link>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={isSubmitting || authState.isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              {isSubmitting || authState.isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>登录中...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>登录</span>
                </>
              )}
            </button>
          </form>

          {/* 注册链接 */}
          <div className="mt-8 text-center">
            <p className="text-gray-300">
              还没有账户？{' '}
              <Link
                to="/register"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                立即注册
              </Link>
            </p>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 METATOPIA. 保留所有权利.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;