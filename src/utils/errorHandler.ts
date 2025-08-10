// Error types
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NETWORK = 'NETWORK',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Application error interface
export interface AppError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  code?: string;
  details?: any;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  url?: string;
}

// Error messages mapping
const ERROR_MESSAGES: Record<string, string> = {
  // Authentication errors
  'INVALID_CREDENTIALS': 'Invalid email or password',
  'TOKEN_EXPIRED': 'Your session has expired. Please log in again',
  'TOKEN_INVALID': 'Invalid authentication token',
  'USER_NOT_FOUND': 'User not found',
  'EMAIL_ALREADY_EXISTS': 'Email address is already registered',
  'USERNAME_TAKEN': 'Username is already taken',
  
  // Validation errors
  'INVALID_EMAIL': 'Please enter a valid email address',
  'WEAK_PASSWORD': 'Password must be at least 8 characters with uppercase, lowercase, and number',
  'PASSWORDS_DONT_MATCH': 'Passwords do not match',
  'REQUIRED_FIELD': 'This field is required',
  'INVALID_FORMAT': 'Invalid format',
  
  // Wallet errors
  'INSUFFICIENT_BALANCE': 'Insufficient balance for this transaction',
  'INVALID_ADDRESS': 'Invalid wallet address',
  'TRANSACTION_FAILED': 'Transaction failed. Please try again',
  'NETWORK_ERROR': 'Network error. Please check your connection',
  'INVALID_AMOUNT': 'Invalid amount',
  'MIN_AMOUNT_ERROR': 'Amount is below minimum limit',
  'MAX_AMOUNT_ERROR': 'Amount exceeds maximum limit',
  
  // Server errors
  'SERVER_ERROR': 'Server error. Please try again later',
  'SERVICE_UNAVAILABLE': 'Service temporarily unavailable',
  'RATE_LIMIT_EXCEEDED': 'Too many requests. Please wait and try again',
  
  // Generic errors
  'UNKNOWN_ERROR': 'An unexpected error occurred',
  'CONNECTION_ERROR': 'Connection error. Please check your internet connection'
};

// Create error object
export const createError = (
  type: ErrorType,
  severity: ErrorSeverity,
  message: string,
  code?: string,
  details?: any
): AppError => {
  return {
    type,
    severity,
    message,
    code,
    details,
    timestamp: new Date(),
    userId: getCurrentUserId(),
    sessionId: getSessionId(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };
};

// Get user-friendly error message
export const getErrorMessage = (code: string, fallback?: string): string => {
  return ERROR_MESSAGES[code] || fallback || ERROR_MESSAGES['UNKNOWN_ERROR'];
};

// Helper functions
const getCurrentUserId = (): string | undefined => {
  try {
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = JSON.parse(atob(token));
      return payload.userId;
    }
  } catch (error) {
    // Ignore error
  }
  return undefined;
};

const getSessionId = (): string | undefined => {
  return sessionStorage.getItem('sessionId') || undefined;
};

// Toast notification functions
export const showErrorToast = (message: string, duration: number = 5000) => {
  // Import toast dynamically to avoid circular dependencies
  import('../utils/toast').then(({ showToast }) => {
    showToast.error(message, { duration });
  });
};

export const showSuccessToast = (message: string, duration: number = 3000) => {
  import('../utils/toast').then(({ showToast }) => {
    showToast.success(message, { duration });
  });
};

export const showWarningToast = (message: string, duration: number = 4000) => {
  import('../utils/toast').then(({ showToast }) => {
    showToast.warning(message, { duration });
  });
};

export const showInfoToast = (message: string, duration: number = 3000) => {
  import('../utils/toast').then(({ showToast }) => {
    showToast.info(message, { duration });
  });
};

// Handle API errors
export const handleApiError = (error: any): AppError => {
  let appError: AppError;
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        appError = createError(
          ErrorType.VALIDATION,
          ErrorSeverity.MEDIUM,
          getErrorMessage(data?.code, 'Bad request'),
          data?.code,
          data
        );
        break;
        
      case 401:
        appError = createError(
          ErrorType.AUTHENTICATION,
          ErrorSeverity.HIGH,
          getErrorMessage('TOKEN_EXPIRED'),
          'UNAUTHORIZED',
          data
        );
        break;
        
      case 403:
        appError = createError(
          ErrorType.AUTHORIZATION,
          ErrorSeverity.HIGH,
          'You do not have permission to perform this action',
          'FORBIDDEN',
          data
        );
        break;
        
      case 404:
        appError = createError(
          ErrorType.CLIENT,
          ErrorSeverity.MEDIUM,
          'Resource not found',
          'NOT_FOUND',
          data
        );
        break;
        
      case 429:
        appError = createError(
          ErrorType.CLIENT,
          ErrorSeverity.MEDIUM,
          getErrorMessage('RATE_LIMIT_EXCEEDED'),
          'RATE_LIMIT',
          data
        );
        break;
        
      case 500:
        appError = createError(
          ErrorType.SERVER,
          ErrorSeverity.HIGH,
          getErrorMessage('SERVER_ERROR'),
          'INTERNAL_SERVER_ERROR',
          data
        );
        break;
        
      case 502:
      case 503:
      case 504:
        appError = createError(
          ErrorType.SERVER,
          ErrorSeverity.HIGH,
          getErrorMessage('SERVICE_UNAVAILABLE'),
          'SERVICE_UNAVAILABLE',
          data
        );
        break;
        
      default:
        appError = createError(
          ErrorType.SERVER,
          ErrorSeverity.MEDIUM,
          getErrorMessage('SERVER_ERROR'),
          `HTTP_${status}`,
          data
        );
    }
  } else if (error.request) {
    // Network error
    appError = createError(
      ErrorType.NETWORK,
      ErrorSeverity.HIGH,
      getErrorMessage('CONNECTION_ERROR'),
      'NETWORK_ERROR',
      error.request
    );
  } else {
    // Other error
    appError = createError(
      ErrorType.UNKNOWN,
      ErrorSeverity.MEDIUM,
      error.message || getErrorMessage('UNKNOWN_ERROR'),
      'UNKNOWN',
      error
    );
  }
  
  // Log error
  logError(appError);
  
  // Show toast notification
  showErrorToast(appError.message);
  
  return appError;
};

// Log error function
export const logError = (error: AppError): void => {
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Application Error:', error);
  }
  
  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Send to monitoring service (e.g., Sentry, LogRocket)
    // Example: Sentry.captureException(error);
  }
};

// Global error handler
export const setupGlobalErrorHandler = (): void => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = createError(
      ErrorType.UNKNOWN,
      ErrorSeverity.HIGH,
      'Unhandled promise rejection',
      'UNHANDLED_REJECTION',
      event.reason
    );
    
    logError(error);
    event.preventDefault();
  });
  
  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    const error = createError(
      ErrorType.UNKNOWN,
      ErrorSeverity.HIGH,
      event.message,
      'UNCAUGHT_ERROR',
      {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      }
    );
    
    logError(error);
  });
};

// Error boundary helper
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };
};