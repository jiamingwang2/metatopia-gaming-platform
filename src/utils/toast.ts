import { toast } from 'sonner';

interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  dismissible?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    return toast.success(message, {
      duration: options?.duration || 3000,
      position: options?.position || 'top-right',
      dismissible: options?.dismissible !== false,
      action: options?.action,
      style: {
        background: '#10b981',
        color: 'white',
        border: 'none'
      }
    });
  },

  error: (message: string, options?: ToastOptions) => {
    return toast.error(message, {
      duration: options?.duration || 5000,
      position: options?.position || 'top-right',
      dismissible: options?.dismissible !== false,
      action: options?.action,
      style: {
        background: '#ef4444',
        color: 'white',
        border: 'none'
      }
    });
  },

  info: (message: string, options?: ToastOptions) => {
    return toast.info(message, {
      duration: options?.duration || 3000,
      position: options?.position || 'top-right',
      dismissible: options?.dismissible !== false,
      action: options?.action,
      style: {
        background: '#3b82f6',
        color: 'white',
        border: 'none'
      }
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    return toast.warning(message, {
      duration: options?.duration || 4000,
      position: options?.position || 'top-right',
      dismissible: options?.dismissible !== false,
      action: options?.action,
      style: {
        background: '#f59e0b',
        color: 'white',
        border: 'none'
      }
    });
  },

  loading: (message: string, options?: Omit<ToastOptions, 'duration'>) => {
    return toast.loading(message, {
      position: options?.position || 'top-right',
      dismissible: options?.dismissible !== false,
      action: options?.action
    });
  },

  promise: <T>(promise: Promise<T>, messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  }, options?: ToastOptions) => {
    return toast.promise(promise, messages, {
      duration: options?.duration,
      position: options?.position || 'top-right',
      dismissible: options?.dismissible !== false,
      action: options?.action
    });
  }
};