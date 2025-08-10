import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { LoadingSpinner } from './LoadingSpinner'

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  className?: string
  backdrop?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = '加载中...',
  className,
  backdrop = true,
  size = 'md'
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center',
            backdrop && 'bg-black/50 backdrop-blur-sm',
            className
          )}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex flex-col items-center space-y-4 p-6 bg-primary-900/90 rounded-xl border border-primary-700"
          >
            <LoadingSpinner size={size} color="neon" />
            {message && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white font-medium text-center"
              >
                {message}
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingOverlay