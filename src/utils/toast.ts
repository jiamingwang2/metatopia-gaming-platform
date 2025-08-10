import { toast } from 'sonner'

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      style: {
        background: 'rgb(34, 197, 94)', // bg-green-500
        border: '1px solid rgb(34, 197, 94)',
        color: 'white',
      },
    })
  },
  
  error: (message: string) => {
    toast.error(message, {
      style: {
        background: 'rgb(239, 68, 68)', // bg-red-500
        border: '1px solid rgb(239, 68, 68)',
        color: 'white',
      },
    })
  },
  
  info: (message: string) => {
    toast.info(message, {
      style: {
        background: 'rgb(59, 130, 246)', // bg-blue-500
        border: '1px solid rgb(59, 130, 246)',
        color: 'white',
      },
    })
  },
  
  warning: (message: string) => {
    toast.warning(message, {
      style: {
        background: 'rgb(245, 158, 11)', // bg-yellow-500
        border: '1px solid rgb(245, 158, 11)',
        color: 'white',
      },
    })
  },
  
  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        background: 'rgb(107, 114, 128)', // bg-gray-500
        border: '1px solid rgb(107, 114, 128)',
        color: 'white',
      },
    })
  },
  
  promise: <T>(promise: Promise<T>, messages: {
    loading: string
    success: string
    error: string
  }) => {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
      style: {
        background: 'rgb(17, 24, 39)',
        border: '1px solid rgb(55, 65, 81)',
        color: 'white',
      },
    })
  }
}