import { useState, useCallback, useRef } from 'react';
import { showErrorNotification, withErrorHandling } from '../utils/errorHandler';

// 加载状态接口
interface LoadingState {
  isLoading: boolean;
  error: string | null;
  data: any;
}

// 加载选项
interface LoadingOptions {
  showErrorNotification?: boolean;
  customErrorMessage?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onFinally?: () => void;
}

// 全局加载状态管理
class LoadingManager {
  private loadingStates = new Map<string, boolean>();
  private listeners = new Set<() => void>();

  setLoading(key: string, loading: boolean) {
    this.loadingStates.set(key, loading);
    this.notifyListeners();
  }

  isLoading(key?: string): boolean {
    if (key) {
      return this.loadingStates.get(key) || false;
    }
    // 如果没有指定key，检查是否有任何加载状态
    return Array.from(this.loadingStates.values()).some(loading => loading);
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  clear() {
    this.loadingStates.clear();
    this.notifyListeners();
  }
}

export const loadingManager = new LoadingManager();

// 基础加载状态Hook
export const useLoading = (initialLoading = false) => {
  const [state, setState] = useState<LoadingState>({
    isLoading: initialLoading,
    error: null,
    data: null
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  }, []);

  const setData = useCallback((data: any) => {
    setState(prev => ({ ...prev, data, isLoading: false, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, data: null });
  }, []);

  return {
    ...state,
    setLoading,
    setError,
    setData,
    reset
  };
};

// 异步操作加载Hook
export const useAsyncLoading = <T = any>(options: LoadingOptions = {}) => {
  const { isLoading, error, data, setLoading, setError, setData, reset } = useLoading();
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (asyncFn: () => Promise<T>) => {
    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setLoading(true);
    setError(null);

    try {
       const result = await asyncFn();

       if (!signal.aborted) {
         setData(result);
         options.onSuccess?.(result);
       }

       return result;
     } catch (err: any) {
       if (!signal.aborted) {
         const errorMessage = err.message || '操作失败';
         setError(errorMessage);
         options.onError?.(err);
         
         if (options.showErrorNotification !== false) {
           showErrorNotification(options.customErrorMessage || errorMessage);
         }
       }
       throw err;
     } finally {
      if (!signal.aborted) {
        setLoading(false);
        options.onFinally?.();
      }
    }
  }, [setLoading, setError, setData, options]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setLoading(false);
  }, [setLoading]);

  return {
    isLoading,
    error,
    data,
    execute,
    cancel,
    reset
  };
};

// 全局加载状态Hook
export const useGlobalLoading = (key?: string) => {
  const [, forceUpdate] = useState({});
  
  const rerender = useCallback(() => {
    forceUpdate({});
  }, []);

  // 订阅全局加载状态变化
  useState(() => {
    const unsubscribe = loadingManager.subscribe(rerender);
    return unsubscribe;
  });

  const setLoading = useCallback((loading: boolean) => {
    if (key) {
      loadingManager.setLoading(key, loading);
    }
  }, [key]);

  const isLoading = loadingManager.isLoading(key);

  return {
    isLoading,
    setLoading
  };
};