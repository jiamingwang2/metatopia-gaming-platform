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
      newErrors.phone = '请输入有效的手机号码';
    }

    // 服务条款验证
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = '请同意服务条款和隐私政策';
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
        toast.success('注册成功！欢迎加入METATOPIA！');
        navigate('/', { replace: true });
      } else {
        toast.error(response.error || '注册失败，请稍后重试');
      }
    } catch (error) {
      console.error('Register error:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 获取密码强度颜色和文本
  const getPasswordStrengthInfo = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return { color: 'bg-red-500', text: '弱', width: '20%' };
      case 2:
        return { color: 'bg-yellow-500', text: '一般', width: '40%' };
      case 3:
        return { color: 'bg-blue-500', text: '良好', width: '60%' };
      case 4:
        return { color: 'bg-green-500', text: '强', width: '80%' };
      case 5:
        return { color: 'bg-green-600', text: '很强', width: '100%' };
      default:
        return { color: 'bg-gray-500', text: '', width: '0%' };
    }
  };

  const passwordStrengthInfo = getPasswordStrengthInfo(passwordStrength);

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
            加入 <span className="text-gradient">METATOPIA</span>
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            创建您的账户，开启GameFi新世界
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

        {/* Register Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Username Field */}
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
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-primary-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-500 focus:border-transparent transition-all duration-200 ${
                    errors.username ? 'border-red-500' : 'border-primary-600'
                  }`}
                  placeholder="请输入用户名"
                />
              </div>
              {errors.username && (
                <div className="mt-1 flex items-center space-x-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.username}</span>
                </div>
              )}
            </div>

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
                  placeholder="请输入邮箱地址"
                />
              </div>
              {errors.email && (
                <div className="mt-1 flex items-center space-x-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                手机号码 <span className="text-gray-500">(可选)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-primary-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-500 focus:border-transparent transition-all duration-200 ${
                    errors.phone ? 'border-red-500' : 'border-primary-600'
                  }`}
                  placeholder="请输入手机号码"
                />
              </div>
              {errors.phone && (
                <div className="mt-1 flex items-center space-x-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.phone}</span>
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg bg-primary-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-500 focus:border-transparent transition-all duration-200 ${
                    errors.password ? 'border-red-500' : 'border-primary-600'
                  }`}
                  placeholder="请输入密码"
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>密码强度</span>
                    <span className={`font-medium ${
                      passwordStrength <= 1 ? 'text-red-400' :
                      passwordStrength <= 2 ? 'text-yellow-400' :
                      passwordStrength <= 3 ? 'text-blue-400' :
                      'text-green-400'
                    }`}>
                      {passwordStrengthInfo.text}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrengthInfo.color}`}
                      style={{ width: passwordStrengthInfo.width }}
                    ></div>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <div className="mt-1 flex items-center space-x-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                确认密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg bg-primary-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-500 focus:border-transparent transition-all duration-200 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-primary-600'
                  }`}
                  placeholder="请再次输入密码"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="mt-1 flex items-center space-x-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agreeToTerms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="h-4 w-4 text-neon-500 focus:ring-neon-500 border-primary-600 rounded bg-primary-800"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreeToTerms" className="text-gray-300">
                我已阅读并同意{' '}
                <Link to="/terms" className="text-neon-500 hover:text-neon-400">
                  服务条款
                </Link>
                {' '}和{' '}
                <Link to="/privacy" className="text-neon-500 hover:text-neon-400">
                  隐私政策
                </Link>
              </label>
              {errors.agreeToTerms && (
                <div className="mt-1 flex items-center space-x-1 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.agreeToTerms}</span>
                </div>
              )}
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
                  <span>注册中...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <UserPlus className="w-4 h-4" />
                  <span>创建账户</span>
                </div>
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              已有账户？{' '}
              <Link
                to="/login"
                className="font-medium text-neon-500 hover:text-neon-400 transition-colors duration-200"
              >
                立即登录
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;