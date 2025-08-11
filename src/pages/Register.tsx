import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, UserPlus, AlertCircle, CheckCircle, Shield, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { RegisterForm, FormErrors } from '../types/auth';
import { toast } from 'sonner';
import { checkNetworkStatus, getNetworkDiagnostics, getErrorMessage } from '../utils/networkUtils';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, authState } = useAuth();
  
  const [formData, setFormData] = useState<RegisterForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    agreeToTerms: false,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isOnline, setIsOnline] = useState(checkNetworkStatus());

  // 如果已经登录，重定向到首页
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      navigate('/', { replace: true });
    }
  }, [authState.isAuthenticated, authState.isLoading, navigate]);

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

  // 密码强度检查
  const checkPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^\w\s]/.test(password)) strength += 1;
    return strength;
  };

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 用户名验证
    if (!formData.username) {
      newErrors.username = '请输入用户名';
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名至少3位';
    } else if (formData.username.length > 20) {
      newErrors.username = '用户名不能超过20位';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = '用户名只能包含字母、数字和下划线';
    }

    // 邮箱验证
    if (!formData.email) {
      newErrors.email = '请输入邮箱地址';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 8) {
      newErrors.password = '密码至少8位';
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = '密码必须包含字母和数字';
    }

    // 确认密码验证
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    // 手机号验证（可选）
    if (formData.phone && !/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的手机号';
    }

    // 用户协议验证
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = '请同意用户协议和隐私政策';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));

    // 密码强度检查
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }

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
      const response = await register(formData);
      
      if (response.success) {
        toast.success('注册成功！', {
          description: '欢迎加入 METATOPIA',
        });
        navigate('/', { replace: true });
      } else {
        toast.error('注册失败', {
          description: response.error || '请检查您的信息',
        });
      }
    } catch (error: any) {
      console.error('Register error:', error);
      
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
      
      toast.error('注册失败', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 密码强度颜色
  const getPasswordStrengthColor = (strength: number): string => {
    if (strength <= 1) return 'bg-red-500';
    if (strength <= 2) return 'bg-orange-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // 密码强度文本
  const getPasswordStrengthText = (strength: number): string => {
    if (strength <= 1) return '弱';
    if (strength <= 2) return '一般';
    if (strength <= 3) return '中等';
    if (strength <= 4) return '强';
    return '很强';
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
        {/* 注册卡片 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* 头部 */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">创建账户</h1>
            <p className="text-gray-300">加入 METATOPIA 游戏世界</p>
            
            {/* 网络状态指示器 */}
            <div className={`mt-4 flex items-center justify-center gap-2 text-sm ${
              isOnline ? 'text-green-400' : 'text-red-400'
            }`}>
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              <span>{isOnline ? '网络连接正常' : '网络连接异常'}</span>
            </div>
          </div>

          {/* 注册表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 用户名输入 */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                用户名
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.username
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-gray-600 focus:ring-purple-400 focus:border-purple-400'
                  }`}
                  placeholder="请输入用户名"
                  autoComplete="username"
                />
              </div>
              {errors.username && (
                <div className="mt-2 flex items-center gap-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.username}</span>
                </div>
              )}
            </div>

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
                  placeholder="请输入邮箱地址"
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

            {/* 手机号输入（可选） */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                手机号 <span className="text-gray-500">(可选)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.phone
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-gray-600 focus:ring-purple-400 focus:border-purple-400'
                  }`}
                  placeholder="请输入手机号"
                  autoComplete="tel"
                />
              </div>
              {errors.phone && (
                <div className="mt-2 flex items-center gap-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.phone}</span>
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
                  placeholder="请输入密码"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {/* 密码强度指示器 */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength)}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400">
                      强度: {getPasswordStrengthText(passwordStrength)}
                    </span>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <div className="mt-2 flex items-center gap-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* 确认密码输入 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                确认密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.confirmPassword
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-gray-600 focus:ring-purple-400 focus:border-purple-400'
                  }`}
                  placeholder="请再次输入密码"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="mt-2 flex items-center gap-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
            </div>

            {/* 用户协议 */}
            <div>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-purple-600 bg-white/10 border-gray-600 rounded focus:ring-purple-500 focus:ring-2 mt-1"
                />
                <span className="text-sm text-gray-300 leading-relaxed">
                  我已阅读并同意{' '}
                  <Link to="/terms" className="text-purple-400 hover:text-purple-300 underline">
                    用户协议
                  </Link>
                  {' '}和{' '}
                  <Link to="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                    隐私政策
                  </Link>
                </span>
              </label>
              {errors.agreeToTerms && (
                <div className="mt-2 flex items-center gap-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.agreeToTerms}</span>
                </div>
              )}
            </div>

            {/* 注册按钮 */}
            <button
              type="submit"
              disabled={isSubmitting || authState.isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              {isSubmitting || authState.isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>注册中...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>创建账户</span>
                </>
              )}
            </button>
          </form>

          {/* 登录链接 */}
          <div className="mt-8 text-center">
            <p className="text-gray-300">
              已有账户？{' '}
              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                立即登录
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

export default Register;