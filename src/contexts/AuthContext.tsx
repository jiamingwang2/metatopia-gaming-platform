import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, AuthContextType, LoginForm, RegisterForm, AuthResponse, User } from '../types/auth';
import { authAPI } from '../services/authAPI';
import { tokenUtils } from '../utils/tokenUtils';

// 初始状态
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  token: null,
};

// Action 类型
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// 创建 Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider 组件
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  // 登录函数
  const login = async (credentials: LoginForm): Promise<AuthResponse> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await authAPI.login(credentials);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // 保存 token 到本地存储
        tokenUtils.setToken(token);
        if (response.data.refreshToken) {
          tokenUtils.setRefreshToken(response.data.refreshToken);
        }
        
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user, token } 
        });
        
        return response;
      } else {
        dispatch({ 
          type: 'AUTH_FAILURE', 
          payload: response.error || '登录失败' 
        });
        return response;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '网络错误';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };
    }
  };

  // 注册函数
  const register = async (userData: RegisterForm): Promise<AuthResponse> => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await authAPI.register(userData);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // 保存 token 到本地存储
        tokenUtils.setToken(token);
        if (response.data.refreshToken) {
          tokenUtils.setRefreshToken(response.data.refreshToken);
        }
        
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user, token } 
        });
        
        return response;
      } else {
        dispatch({ 
          type: 'AUTH_FAILURE', 
          payload: response.error || '注册失败' 
        });
        return response;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '网络错误';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };
    }
  };

  // 登出函数
  const logout = () => {
    tokenUtils.removeToken();
    dispatch({ type: 'LOGOUT' });
  };

  // 更新用户信息
  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  // 刷新 token
  const refreshToken = async (): Promise<boolean> => {
    try {
      const currentRefreshToken = tokenUtils.getRefreshToken();
      if (!currentRefreshToken) {
        console.log('No refresh token found');
        return false;
      }

      const response = await authAPI.refreshToken();
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        tokenUtils.setToken(token);
        if (response.data.refreshToken) {
          tokenUtils.setRefreshToken(response.data.refreshToken);
        }
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user, token } 
        });
        return true;
      }
      
      console.log('Refresh token failed:', response.message);
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  // 检查认证状态
  const checkAuth = async (): Promise<boolean> => {
    try {
      const token = tokenUtils.getToken();
      
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return false;
      }

      // 检查 token 是否过期
      if (tokenUtils.isTokenExpired(token)) {
        console.log('Token expired, attempting refresh...');
        const refreshed = await refreshToken();
        if (!refreshed) {
          console.log('Token refresh failed, logging out');
          dispatch({ type: 'SET_LOADING', payload: false });
          logout();
          return false;
        }
        return true;
      }

      // 验证 token 并获取用户信息
      const response = await authAPI.getCurrentUser();
      
      if (response.success && response.data) {
        dispatch({ 
          type: 'AUTH_SUCCESS', 
          payload: { user: response.data.user, token } 
        });
        return true;
      } else {
        console.log('Get current user failed:', response.message);
        // 不要立即登出，可能是网络问题
        dispatch({ type: 'SET_LOADING', payload: false });
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // 网络错误不应该导致登出
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };

  // 初始化时检查认证状态
  useEffect(() => {
    checkAuth();
  }, []);

  // Context 值
  const contextValue: AuthContextType = {
    authState,
    login,
    register,
    logout,
    updateUser,
    refreshToken,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook 用于使用 AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
