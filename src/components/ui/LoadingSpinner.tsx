import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  color?: 'primary' | 'secondary' | 'neon'
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  color = 'neon'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  const colorClasses = {
    primary: 'border-primary-500',
    secondary: 'border-gray-400',
    neon: 'border-neon-500'
  }

  return (
    <motion.div
      className={cn(
        'border-2 border-transparent rounded-full',
        sizeClasses[size],
        className
      )}
      style={{
        borderTopColor: color === 'neon' ? '#00ff88' : color === 'primary' ? '#3b82f6' : '#9ca3af',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent'
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  )
}

export default LoadingSpinner