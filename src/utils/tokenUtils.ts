// Token storage keys
const TOKEN_KEY = 'authToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';

// Token management functions
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
  
  // Extract expiry from token if it's a JWT
  try {
    const payload = parseJWTPayload(token);
    if (payload.exp) {
      localStorage.setItem(TOKEN_EXPIRY_KEY, payload.exp.toString());
    }
  } catch (error) {
    // If token parsing fails, set a default expiry (24 hours)
    const expiry = Math.floor(Date.now() / 1000) + (24 * 60 * 60);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

export const setRefreshToken = (refreshToken: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const removeRefreshToken = (): void => {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// JWT parsing functions
export const parseJWTPayload = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error('Invalid token format');
  }
};

// Token validation functions
export const isTokenExpired = (token?: string): boolean => {
  const tokenToCheck = token || getToken();
  
  if (!tokenToCheck) {
    return true;
  }
  
  try {
    const payload = parseJWTPayload(tokenToCheck);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    // If we can't parse the token, consider it expired
    return true;
  }
};

export const isTokenExpiringSoon = (token?: string, thresholdMinutes: number = 5): boolean => {
  const tokenToCheck = token || getToken();
  
  if (!tokenToCheck) {
    return true;
  }
  
  try {
    const payload = parseJWTPayload(tokenToCheck);
    const currentTime = Math.floor(Date.now() / 1000);
    const thresholdTime = currentTime + (thresholdMinutes * 60);
    return payload.exp < thresholdTime;
  } catch (error) {
    return true;
  }
};

// User information extraction
export const getUserFromToken = (token?: string): any | null => {
  const tokenToCheck = token || getToken();
  
  if (!tokenToCheck || isTokenExpired(tokenToCheck)) {
    return null;
  }
  
  try {
    const payload = parseJWTPayload(tokenToCheck);
    return {
      id: payload.userId,
      username: payload.username,
      email: payload.email,
      exp: payload.exp
    };
  } catch (error) {
    return null;
  }
};

// Token validation
export const isValidTokenFormat = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }
    
    // Try to parse the payload
    parseJWTPayload(token);
    return true;
  } catch (error) {
    return false;
  }
};

// Authorization header
export const getAuthHeader = (): Record<string, string> => {
  const token = getToken();
  
  if (!token || isTokenExpired(token)) {
    return {};
  }
  
  return {
    Authorization: `Bearer ${token}`
  };
};

// Clear all auth data
export const clearAuthData = (): void => {
  removeToken();
  removeRefreshToken();
  localStorage.removeItem('user');
  sessionStorage.clear();
};

// Token refresh logic
export const shouldRefreshToken = (): boolean => {
  const token = getToken();
  const refreshToken = getRefreshToken();
  
  if (!token || !refreshToken) {
    return false;
  }
  
  // Check if token is expired or expiring soon
  return isTokenExpired(token) || isTokenExpiringSoon(token, 10);
};

// Get token expiry time
export const getTokenExpiry = (): number | null => {
  const token = getToken();
  
  if (!token) {
    return null;
  }
  
  try {
    const payload = parseJWTPayload(token);
    return payload.exp;
  } catch (error) {
    return null;
  }
};

// Get remaining token time in seconds
export const getTokenRemainingTime = (): number => {
  const expiry = getTokenExpiry();
  
  if (!expiry) {
    return 0;
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  const remaining = expiry - currentTime;
  
  return Math.max(0, remaining);
};

// Format remaining time for display
export const formatRemainingTime = (): string => {
  const remaining = getTokenRemainingTime();
  
  if (remaining <= 0) {
    return 'Expired';
  }
  
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes}m`;
};

// Auto-refresh token setup
export const setupTokenRefresh = (refreshCallback: () => Promise<void>): (() => void) => {
  const checkInterval = 60000; // Check every minute
  
  const intervalId = setInterval(async () => {
    if (shouldRefreshToken()) {
      try {
        await refreshCallback();
      } catch (error) {
        console.error('Token refresh failed:', error);
        clearAuthData();
        // Redirect to login or show notification
        window.location.href = '/login';
      }
    }
  }, checkInterval);
  
  // Return cleanup function
  return () => clearInterval(intervalId);
};