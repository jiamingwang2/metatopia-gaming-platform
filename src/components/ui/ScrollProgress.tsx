import React, { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '../../lib/utils'

// 滚动进度条组件
interface ScrollProgressProps {
  height?: number
  color?: string
  position?: 'top' | 'bottom'
  className?: string
  showPercentage?: boolean
  container?: React.RefObject<HTMLElement>
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  height = 4,
  color = '#00f5ff',
  position = 'top',
  className,
  showPercentage = false,
  container
}) => {
  const { scrollYProgress } = useScroll({
    container: container?.current || undefined
  })
  
  const [scrollPercentage, setScrollPercentage] = useState(0)
  
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      setScrollPercentage(Math.round(latest * 100))
    })
    
    return unsubscribe
  }, [scrollYProgress])
  
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  
  return (
    <>
      <motion.div
        className={cn(
          'fixed left-0 right-0 z-50 origin-left',
          position === 'top' ? 'top-0' : 'bottom-0',
          className
        )}
        style={{
          height: `${height}px`,
          backgroundColor: color,
          width
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {showPercentage && (
        <motion.div
          className={cn(
            'fixed right-4 z-50 bg-gray-800 text-white px-2 py-1 rounded text-sm',
            position === 'top' ? 'top-4' : 'bottom-4'
          )}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {scrollPercentage}%
        </motion.div>
      )}
    </>
  )
}

// 圆形滚动进度组件
interface CircularScrollProgressProps {
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  className?: string
  showPercentage?: boolean
  container?: React.RefObject<HTMLElement>
}

export const CircularScrollProgress: React.FC<CircularScrollProgressProps> = ({
  size = 60,
  strokeWidth = 4,
  color = '#00f5ff',
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  position = 'bottom-right',
  className,
  showPercentage = true,
  container
}) => {
  const { scrollYProgress } = useScroll({
    container: container?.current || undefined
  })
  
  const [scrollPercentage, setScrollPercentage] = useState(0)
  
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      setScrollPercentage(Math.round(latest * 100))
    })
    
    return unsubscribe
  }, [scrollYProgress])
  
  const circumference = 2 * Math.PI * (size / 2 - strokeWidth)
  const strokeDasharray = circumference
  const strokeDashoffset = useTransform(
    scrollYProgress,
    [0, 1],
    [circumference, 0]
  )
  
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4'
      case 'top-right':
        return 'top-4 right-4'
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'bottom-right':
      default:
        return 'bottom-4 right-4'
    }
  }
  
  return (
    <motion.div
      className={cn(
        'fixed z-50',
        getPositionClasses(),
        className
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* 背景圆环 */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - strokeWidth}
            stroke={backgroundColor}
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* 进度圆环 */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - strokeWidth}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray,
              strokeDashoffset
            }}
          />
        </svg>
        
        {/* 百分比文字 */}
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-white">
              {scrollPercentage}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// 分段滚动进度组件
interface SegmentedScrollProgressProps {
  segments?: number
  height?: number
  gap?: number
  color?: string
  backgroundColor?: string
  position?: 'top' | 'bottom'
  className?: string
  container?: React.RefObject<HTMLElement>
}

export const SegmentedScrollProgress: React.FC<SegmentedScrollProgressProps> = ({
  segments = 5,
  height = 4,
  gap = 2,
  color = '#00f5ff',
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  position = 'top',
  className,
  container
}) => {
  const { scrollYProgress } = useScroll({
    container: container?.current || undefined
  })
  
  const [activeSegments, setActiveSegments] = useState(0)
  
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      const active = Math.floor(latest * segments)
      setActiveSegments(Math.min(active, segments))
    })
    
    return unsubscribe
  }, [scrollYProgress, segments])
  
  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-50 flex px-4',
        position === 'top' ? 'top-0' : 'bottom-0',
        className
      )}
      style={{ height: `${height + 8}px`, paddingTop: 4, paddingBottom: 4 }}
    >
      {Array.from({ length: segments }).map((_, index) => (
        <motion.div
          key={index}
          className="flex-1"
          style={{
            height: `${height}px`,
            backgroundColor: index < activeSegments ? color : backgroundColor,
            marginRight: index < segments - 1 ? `${gap}px` : 0
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: index < activeSegments ? 1 : 0.3 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        />
      ))}
    </div>
  )
}

export default {
  ScrollProgress,
  CircularScrollProgress,
  SegmentedScrollProgress
}