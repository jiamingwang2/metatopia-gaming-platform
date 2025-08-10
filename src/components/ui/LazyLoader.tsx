import React, { useState, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SkeletonLoader, SkeletonCard, SkeletonProfile, SkeletonList } from './SkeletonLoader'
import { cn } from '../../lib/utils'

interface LazyLoaderProps {
  children: ReactNode
  isLoading: boolean
  skeleton?: 'card' | 'profile' | 'list' | 'custom'
  skeletonCount?: number
  customSkeleton?: ReactNode
  delay?: number
  className?: string
  minLoadingTime?: number
}

export const LazyLoader: React.FC<LazyLoaderProps> = ({
  children,
  isLoading,
  skeleton = 'card',
  skeletonCount = 1,
  customSkeleton,
  delay = 0,
  className,
  minLoadingTime = 500
}) => {
  const [showSkeleton, setShowSkeleton] = useState(isLoading)
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setShowSkeleton(true)
      setMinTimeElapsed(false)
      
      // Ensure minimum loading time for better UX
      const timer = setTimeout(() => {
        setMinTimeElapsed(true)
      }, minLoadingTime)

      return () => clearTimeout(timer)
    } else if (minTimeElapsed) {
      setShowSkeleton(false)
    }
  }, [isLoading, minTimeElapsed, minLoadingTime])

  useEffect(() => {
    if (!isLoading && minTimeElapsed) {
      setShowSkeleton(false)
    }
  }, [isLoading, minTimeElapsed])

  const renderSkeleton = () => {
    if (customSkeleton) {
      return customSkeleton
    }

    switch (skeleton) {
      case 'profile':
        return <SkeletonProfile />
      case 'list':
        return <SkeletonList items={skeletonCount} />
      case 'card':
        return (
          <div className="space-y-4">
            {Array.from({ length: skeletonCount }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        )
      default:
        return <SkeletonLoader />
    }
  }

  return (
    <div className={cn('relative', className)}>
      <AnimatePresence mode="wait">
        {showSkeleton ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, delay }}
          >
            {renderSkeleton()}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Hook for managing loading states
export const useLoadingState = (initialLoading = false) => {
  const [isLoading, setIsLoading] = useState(initialLoading)
  const [error, setError] = useState<string | null>(null)

  const startLoading = () => {
    setIsLoading(true)
    setError(null)
  }

  const stopLoading = () => {
    setIsLoading(false)
  }

  const setLoadingError = (errorMessage: string) => {
    setIsLoading(false)
    setError(errorMessage)
  }

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setLoadingError
  }
}

export default LazyLoader