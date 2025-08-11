import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'super_admin';
}

// 极简版管理员认证hook
export const useAdminAuth = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    // 初始化时从localStorage读取
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // 简单的登录函数
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 简单的账户验证
    if (username === 'admin' && password === 'admin123') {
      const user: AdminUser = {
        id: 'admin-1',
        username: 'admin',
        role: 'admin'
      };
      setAdminUser(user);
      localStorage.setItem('adminUser', JSON.stringify(user));
      toast.success('登录成功');
      setIsLoading(false);
      return true;
    } else if (username === 'superadmin' && password === 'super123') {
      const user: AdminUser = {
        id: 'admin-2',
        username: 'superadmin',
        role: 'super_admin'
      };
      setAdminUser(user);
      localStorage.setItem('adminUser', JSON.stringify(user));
      toast.success('登录成功');
      setIsLoading(false);
      return true;
    } else {
      toast.error('用户名或密码错误');
      setIsLoading(false);
      return false;
    }
  };

  // 简单的登出函数
  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
    toast.success('已退出登录');
  };

  // 检查是否已登录
  const isAuthenticated = adminUser !== null;

  return {
    adminUser,
    isAuthenticated,
    isLoading,
    login,
    logout
  };
};

export default useAdminAuth;