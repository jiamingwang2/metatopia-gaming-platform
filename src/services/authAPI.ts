import { User, LoginForm, RegisterForm, AuthResponse } from '../types/auth';

// Mock user data for development
const mockUsers: User[] = [
  {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    avatar: 'https://via.placeholder.com/150',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    preferences: {
      language: 'en',
      currency: 'USD',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        profileVisibility: 'public',
        showOnlineStatus: true,
        allowDirectMessages: true
      }
    },
    securitySettings: {
      twoFactorEnabled: false,
      loginNotifications: true,
      sessionTimeout: 30,
      allowedIPs: [],
      lastPasswordChange: new Date('2024-01-01')
    }
  }
];

// Mock token generation
const generateToken = (user: User): string => {
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  };
  
  // In a real app, this would be a proper JWT
  return btoa(JSON.stringify(payload));
};

const generateRefreshToken = (user: User): string => {
  const payload = {
    userId: user.id,
    type: 'refresh',
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days
  };
  
  return btoa(JSON.stringify(payload));
};

// Validation helpers
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Mock API delay
const mockDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Login function
export const login = async (credentials: LoginForm): Promise<AuthResponse> => {
  await mockDelay(800);
  
  // Validate input
  if (!credentials.email || !credentials.password) {
    throw new Error('Email and password are required');
  }
  
  if (!validateEmail(credentials.email)) {
    throw new Error('Invalid email format');
  }
  
  // Find user
  const user = mockUsers.find(u => u.email === credentials.email);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // In a real app, you would hash and compare passwords
  if (credentials.password !== 'password123') {
    throw new Error('Invalid password');
  }
  
  const token = generateToken(user);
  const refreshToken = generateRefreshToken(user);
  
  return {
    user,
    token,
    refreshToken,
    expiresIn: 86400 // 24 hours in seconds
  };
};

// Register function
export const register = async (userData: RegisterForm): Promise<AuthResponse> => {
  await mockDelay(1000);
  
  // Validate input
  if (!userData.username || !userData.email || !userData.password) {
    throw new Error('Username, email, and password are required');
  }
  
  if (!validateEmail(userData.email)) {
    throw new Error('Invalid email format');
  }
  
  if (!validatePassword(userData.password)) {
    throw new Error('Password must be at least 8 characters with uppercase, lowercase, and number');
  }
  
  if (userData.password !== userData.confirmPassword) {
    throw new Error('Passwords do not match');
  }
  
  // Check if user already exists
  const existingUser = mockUsers.find(u => 
    u.email === userData.email || u.username === userData.username
  );
  
  if (existingUser) {
    if (existingUser.email === userData.email) {
      throw new Error('Email already registered');
    }
    if (existingUser.username === userData.username) {
      throw new Error('Username already taken');
    }
  }
  
  // Create new user
  const newUser: User = {
    id: (mockUsers.length + 1).toString(),
    username: userData.username,
    email: userData.email,
    avatar: 'https://via.placeholder.com/150',
    createdAt: new Date(),
    updatedAt: new Date(),
    preferences: {
      language: 'en',
      currency: 'USD',
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        profileVisibility: 'public',
        showOnlineStatus: true,
        allowDirectMessages: true
      }
    },
    securitySettings: {
      twoFactorEnabled: false,
      loginNotifications: true,
      sessionTimeout: 30,
      allowedIPs: [],
      lastPasswordChange: new Date()
    }
  };
  
  mockUsers.push(newUser);
  
  const token = generateToken(newUser);
  const refreshToken = generateRefreshToken(newUser);
  
  return {
    user: newUser,
    token,
    refreshToken,
    expiresIn: 86400
  };
};

// Get current user
export const getCurrentUser = async (token: string): Promise<User> => {
  await mockDelay(300);
  
  try {
    const payload = JSON.parse(atob(token));
    
    // Check if token is expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }
    
    const user = mockUsers.find(u => u.id === payload.userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Refresh token
export const refreshToken = async (refreshTokenValue: string): Promise<AuthResponse> => {
  await mockDelay(300);
  
  try {
    const payload = JSON.parse(atob(refreshTokenValue));
    
    // Check if refresh token is expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Refresh token expired');
    }
    
    if (payload.type !== 'refresh') {
      throw new Error('Invalid refresh token');
    }
    
    const user = mockUsers.find(u => u.id === payload.userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const newToken = generateToken(user);
    const newRefreshToken = generateRefreshToken(user);
    
    return {
      user,
      token: newToken,
      refreshToken: newRefreshToken,
      expiresIn: 86400
    };
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Update user profile
export const updateUserProfile = async (token: string, updates: Partial<User>): Promise<User> => {
  await mockDelay(500);
  
  try {
    const payload = JSON.parse(atob(token));
    
    // Check if token is expired
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }
    
    const userIndex = mockUsers.findIndex(u => u.id === payload.userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    // Update user data
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    return mockUsers[userIndex];
  } catch (error) {
    throw new Error('Failed to update profile');
  }
};