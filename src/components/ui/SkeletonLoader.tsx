import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

// 骨架屏类型
type SkeletonType = 'text' | 'circular' | 'rectangular' | 'card'

// 骨架屏组件属性
interface SkeletonLoaderProps {
  type?: SkeletonType
  width?: string | number
  height?: string | number
  className?: string
  animate?: boolean
  lines?: number // 用于文本类型
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'rectangular',
  width,
  height,
  className,
  animate = true,
  lines = 1
}) => {
  const baseClasses = 'bg-gray-700 rounded'
  
  const animationVariants = {
    pulse: {
      opacity: [0.4, 0.8, 0.4],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    },
    shimmer: {
      backgroundPosition: ['-200px 0', '200px 0'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  }

  const getSkeletonStyle = () => {
    const style: React.CSSProperties = {}
    
    if (width) style.width = typeof width === 'number' ? `${width}px` : width
    if (height) style.height = typeof height === 'number' ? `${height}px` : height
    
    return style
  }

  const getTypeClasses = () => {
    switch (type) {
      case 'text':
        return 'h-4 rounded-md'
      case 'circular':
        return 'rounded-full'
      case 'rectangular':
        return 'rounded-lg'
      case 'card':
        return 'rounded-xl'
      default:
        return 'rounded-lg'
    }
  }

  // 文本类型的多行处理
  if (type === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <motion.div
            key={index}
            className={cn(
              baseClasses,
              getTypeClasses(),
              index === lines - 1 && 'w-3/4' // 最后一行稍短
            )}
            style={{
              ...getSkeletonStyle(),
              width: index === lines - 1 ? '75%' : width || '100%'
            }}
            variants={animate ? animationVariants : undefined}
            animate={animate ? 'pulse' : undefined}
          />
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className={cn(
        baseClasses,
        getTypeClasses(),
        animate && 'bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200px_100%]',
        className
      )}
      style={getSkeletonStyle()}
      variants={animate ? animationVariants : undefined}
      animate={animate ? 'pulse' : undefined}
    />
  )
}

// 预设骨架屏组件
export const SkeletonCard: React.FC<{ className?: string; animate?: boolean }> = ({
  className,
  animate = true
}) => (
  <div className={cn('p-4 space-y-4', className)}>
    <SkeletonLoader type="rectangular" height={200} animate={animate} />
    <div className="space-y-2">
      <SkeletonLoader type="text" height={20} animate={animate} />
      <SkeletonLoader type="text" height={16} width="80%" animate={animate} />
      <SkeletonLoader type="text" height={16} width="60%" animate={animate} />
    </div>
  </div>
)

export const SkeletonProfile: React.FC<{ className?: string; animate?: boolean }> = ({
  className,
  animate = true
}) => (
  <div className={cn('flex items-center space-x-4', className)}>
    <SkeletonLoader type="circular" width={60} height={60} animate={animate} />
    <div className="flex-1 space-y-2">
      <SkeletonLoader type="text" height={20} width="40%" animate={animate} />
      <SkeletonLoader type="text" height={16} width="60%" animate={animate} />
    </div>
  </div>
)

export const SkeletonList: React.FC<{ 
  items?: number
  className?: string
  animate?: boolean 
}> = ({
  items = 3,
  className,
  animate = true
}) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: items }).map((_, index) => (
      <SkeletonProfile key={index} animate={animate} />
    ))}
  </div>
)

export default {
  SkeletonLoader,
  SkeletonCard,
  SkeletonProfile,
  SkeletonList
}