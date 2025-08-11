import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface LoadingState {
  [key: string]: boolean;
}

interface LoadingContextType {
  loadingStates: LoadingState;
  setLoading: (key: string, loading: boolean) => void;
  isLoading: (key?: string) => boolean;
  isAnyLoading: boolean;
  clearLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useGlobalLoading = (key?: string): boolean => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useGlobalLoading must be used within a LoadingProvider');
  }
  
  if (key) {
    return context.isLoading(key);
  }
  
  return context.isAnyLoading;
};

// 专门用于特定key的加载状态管理
export const useKeyedLoading = (key: string) => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useKeyedLoading must be used within a LoadingProvider');
  }
  
  return {
    isLoading: context.isLoading(key),
    setLoading: (loading: boolean) => context.setLoading(key, loading),
  };
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState<LoadingState>({});

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => {
      if (loading) {
        return { ...prev, [key]: true };
      } else {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      }
    });
  }, []);

  const isLoading = useCallback((key?: string) => {
    if (key) {
      return loadingStates[key] || false;
    }
    return Object.keys(loadingStates).length > 0;
  }, [loadingStates]);

  const clearLoading = useCallback(() => {
    setLoadingStates({});
  }, []);

  const isAnyLoading = Object.keys(loadingStates).length > 0;

  const value: LoadingContextType = {
    loadingStates,
    setLoading,
    isLoading,
    isAnyLoading,
    clearLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

// 便捷的加载状态管理Hook
export const useLoadingState = (key: string) => {
  const { isLoading, setLoading } = useKeyedLoading(key);
  
  const startLoading = useCallback(() => {
    setLoading(true);
  }, [setLoading]);
  
  const stopLoading = useCallback(() => {
    setLoading(false);
  }, [setLoading]);
  
  const withLoading = useCallback(async (asyncFn: () => Promise<any>): Promise<any> => {
    startLoading();
    try {
      const result = await asyncFn();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);
  
  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
};

// 用于API调用的加载状态Hook
export const useApiLoading = () => {
  const { setLoading } = useKeyedLoading('api');
  
  const withApiLoading = useCallback(async (asyncFn: () => Promise<any>): Promise<any> => {
    setLoading(true);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      setLoading(false);
    }
  }, [setLoading]);
  
  return { withApiLoading };
};
