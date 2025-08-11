import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';
import { AppError, ErrorType, ErrorSeverity, createError, logError } from '../utils/errorHandler';

interface ErrorContextType {
  errors: AppError[];
  addError: (error: AppError | Error | string) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
  hasErrors: boolean;
  showErrorToast: (message: string, options?: { severity?: ErrorSeverity; duration?: number }) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};

interface ErrorProviderProps {
  children: ReactNode;
  maxErrors?: number;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ 
  children, 
  maxErrors = 10 
}) => {
  const [errors, setErrors] = useState<AppError[]>([]);

  const addError = useCallback((error: AppError | Error | string) => {
    let appError: AppError;
    
    if (typeof error === 'string') {
      appError = createError(
        ErrorType.CLIENT,
        ErrorSeverity.MEDIUM,
        error,
        'GENERIC_ERROR'
      );
    } else if (error instanceof Error) {
      appError = createError(
        ErrorType.CLIENT,
        ErrorSeverity.HIGH,
        error.message,
        'UNHANDLED_ERROR',
        { stack: error.stack }
      );
    } else {
      appError = error;
    }

    // 记录错误日志
    logError(appError);

    // 添加到错误列表
    setErrors(prev => {
      const newErrors = [appError, ...prev];
      // 限制错误数量
      return newErrors.slice(0, maxErrors);
    });

    // 根据严重程度显示不同类型的通知
    switch (appError.severity) {
      case ErrorSeverity.LOW:
        toast.info(appError.message);
        break;
      case ErrorSeverity.MEDIUM:
        toast.warning(appError.message);
        break;
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        toast.error(appError.message);
        break;
    }
  }, [maxErrors]);

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const showErrorToast = useCallback((message: string, options: { severity?: ErrorSeverity; duration?: number } = {}) => {
    const { severity = ErrorSeverity.MEDIUM, duration = 4000 } = options;
    
    const toastOptions = {
      duration,
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
      },
    };

    switch (severity) {
      case ErrorSeverity.LOW:
        toast.info(message, toastOptions);
        break;
      case ErrorSeverity.MEDIUM:
        toast.warning(message, toastOptions);
        break;
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        toast.error(message, toastOptions);
        break;
    }
  }, []);

  const hasErrors = errors.length > 0;

  const value: ErrorContextType = {
    errors,
    addError,
    removeError,
    clearErrors,
    hasErrors,
    showErrorToast,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

// 全局错误处理Hook
export const useGlobalErrorHandler = () => {
  const { addError } = useError();

  const handleError = useCallback((error: any, context?: string) => {
    console.error(`Error in ${context || 'unknown context'}:`, error);
    addError(error);
  }, [addError]);

  const handleApiError = useCallback((error: any, fallbackMessage = '操作失败，请稍后重试') => {
    if (error?.response?.data?.message) {
      addError(error.response.data.message);
    } else if (error?.message) {
      addError(error.message);
    } else {
      addError(fallbackMessage);
    }
  }, [addError]);

  const handleNetworkError = useCallback(() => {
    addError(createError(
      ErrorType.NETWORK,
      ErrorSeverity.HIGH,
      '网络连接失败，请检查您的网络设置',
      'NETWORK_ERROR'
    ));
  }, [addError]);

  return {
    handleError,
    handleApiError,
    handleNetworkError,
  };
};
