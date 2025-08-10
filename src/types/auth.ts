// 用户信息类型
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  nickname?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  isVerified: boolean;
  role: 'user' | 'admin' | 'vip';
  level: number;
  experience: number;
  balance: {
    usdt: number;
    btc: number;
    eth: number;
  };
  walletAddress?: {
    btc?: string;
    eth?: string;
    usdt?: string;
  };
}

// 认证状态类型
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

// 登录表单类型
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 注册表单类型
export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  agreeToTerms: boolean;
  verificationCode?: string;
}

// 认证响应类型
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
    refreshToken: string;
  };
  error?: string;
}

// JWT Token 载荷类型
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// 认证上下文类型
export interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginForm) => Promise<AuthResponse>;
  register: (userData: RegisterForm) => Promise<AuthResponse>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshToken: () => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
}

// 表单验证错误类型
export interface FormErrors {
  [key: string]: string | undefined;
}

// API 错误类型
export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// 密码重置类型
export interface PasswordResetForm {
  email: string;
}

export interface PasswordResetConfirmForm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// 用户偏好设置类型
export interface UserPreferences {
  language: 'zh' | 'en';
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    showGameStats: boolean;
    allowFriendRequests: boolean;
  };
}

// 安全设置类型
export interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
  trustedDevices: string[];
}