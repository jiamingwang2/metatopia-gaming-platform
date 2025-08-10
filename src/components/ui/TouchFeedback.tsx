import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useAnimation, PanInfo } from 'framer-motion'
import { cn } from '../../lib/utils'

// 触摸反馈类型
type TouchFeedbackType = 'press' | 'ripple' | 'scale' | 'bounce' | 'glow' | 'vibrate'

// 触摸反馈组件属性
interface TouchFeedbackProps {
  children: React.ReactNode
  onTap?: () => void
  onLongPress?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  feedbackType?: TouchFeedbackType | TouchFeedbackType[]
  disabled?: boolean
  className?: string
  pressScale?: number
  longPressDuration?: number
  swipeThreshold?: number
  hapticFeedback?: boolean
  rippleColor?: string
  glowColor?: string
}

export const TouchFeedback: React.FC<TouchFeedbackProps> = ({
  children,
  onTap,
  onLongPress,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  feedbackType = 'press',
  disabled = false,
  className,
  pressScale = 0.95,
  longPressDuration = 500,
  swipeThreshold = 50,
  hapticFeedback = true,
  rippleColor = 'rgba(0, 245, 255, 0.3)',
  glowColor = '#00f5ff'
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const [isLongPressed, setIsLongPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const controls = useAnimation()
  
  const feedbackTypes = Array.isArray(feedbackType) ? feedbackType : [feedbackType]
  
  // 触觉反馈
  const triggerHapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!hapticFeedback || !navigator.vibrate) return
    
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    }
    
    navigator.vibrate(patterns[type])
  }, [hapticFeedback])
  
  // 创建波纹效果
  const createRipple = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!feedbackTypes.includes('ripple') || !containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const x = ('touches' in event ? event.touches[0].clientX : event.clientX) - rect.left
    const y = ('touches' in event ? event.touches[0].clientY : event.clientY) - rect.top
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    }
    
    setRipples(prev => [...prev, newRipple])
    
    // 清理波纹
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)
  }, [feedbackTypes])
  
  // 处理触摸开始
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    if (disabled) return
    
    setIsPressed(true)
    createRipple(event)
    
    if (feedbackTypes.includes('vibrate')) {
      triggerHapticFeedback('light')
    }
    
    if (feedbackTypes.includes('glow')) {
      controls.start({
        boxShadow: `0 0 20px ${glowColor}`,
        transition: { duration: 0.2 }
      })
    }
    
    // 长按检测
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        setIsLongPressed(true)
        triggerHapticFeedback('heavy')
        onLongPress()
      }, longPressDuration)
    }
  }, [disabled, createRipple, feedbackTypes, triggerHapticFeedback, glowColor, controls, onLongPress, longPressDuration])
  
  // 处理触摸结束
  const handleTouchEnd = useCallback(() => {
    if (disabled) return
    
    setIsPressed(false)
    setIsLongPressed(false)
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    
    if (feedbackTypes.includes('glow')) {
      controls.start({
        boxShadow: 'none',
        transition: { duration: 0.2 }
      })
    }
    
    if (onTap && !isLongPressed) {
      onTap()
    }
  }, [disabled, feedbackTypes, controls, onTap, isLongPressed])
  
  // 处理鼠标事件（桌面端）
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (disabled) return
    
    setIsPressed(true)
    createRipple(event)
    
    if (feedbackTypes.includes('glow')) {
      controls.start({
        boxShadow: `0 0 20px ${glowColor}`,
        transition: { duration: 0.2 }
      })
    }
    
    // 长按检测
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        setIsLongPressed(true)
        onLongPress()
      }, longPressDuration)
    }
  }, [disabled, createRipple, feedbackTypes, glowColor, controls, onLongPress, longPressDuration])
  
  const handleMouseUp = useCallback(() => {
    if (disabled) return
    
    setIsPressed(false)
    setIsLongPressed(false)
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
    
    if (feedbackTypes.includes('glow')) {
      controls.start({
        boxShadow: 'none',
        transition: { duration: 0.2 }
      })
    }
    
    if (onTap && !isLongPressed) {
      onTap()
    }
  }, [disabled, feedbackTypes, controls, onTap, isLongPressed])
  
  // 处理拖拽（滑动检测）
  const handleDrag = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return
    
    const { offset } = info
    const absX = Math.abs(offset.x)
    const absY = Math.abs(offset.y)
    
    if (absX > swipeThreshold || absY > swipeThreshold) {
      if (absX > absY) {
        // 水平滑动
        if (offset.x > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (offset.x < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      } else {
        // 垂直滑动
        if (offset.y > 0 && onSwipeDown) {
          onSwipeDown()
        } else if (offset.y < 0 && onSwipeUp) {
          onSwipeUp()
        }
      }
    }
  }, [disabled, swipeThreshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])
  
  // 清理定时器
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
    }
  }, [])
  
  // 弹跳效果
  useEffect(() => {
    if (feedbackTypes.includes('bounce') && isPressed) {
      controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.3, times: [0, 0.5, 1] }
      })
    }
    
    if (feedbackTypes.includes('scale')) {
      controls.start({ scale: 1 })
    }
  }, [disabled, onTap, feedbackTypes, controls])

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden select-none',
        disabled && 'opacity-50 pointer-events-none',
        className
      )}
      animate={controls}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      drag={!!(onSwipeLeft || onSwipeRight || onSwipeUp || onSwipeDown)}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      onDragEnd={handleDrag}
      whileTap={feedbackTypes.includes('press') ? { scale: pressScale } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
      
      {/* 波纹效果 */}
      {feedbackTypes.includes('ripple') && (
        <div className="absolute inset-0 pointer-events-none">
          {ripples.map(ripple => (
            <motion.div
              key={ripple.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                backgroundColor: rippleColor
              }}
              initial={{
                width: 0,
                height: 0,
                x: '-50%',
                y: '-50%',
                opacity: 1
              }}
              animate={{
                width: 200,
                height: 200,
                opacity: 0
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}
      
      {/* 长按指示器 */}
      {isLongPressed && (
        <motion.div
          className="absolute inset-0 border-2 border-primary-400 rounded-lg pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  )
}

// 滑动卡片组件
interface SwipeCardProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  swipeThreshold?: number
  className?: string
  disabled?: boolean
  snapBack?: boolean
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  swipeThreshold = 100,
  className,
  disabled = false,
  snapBack = true
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const controls = useAnimation()

  const handleDragStart = () => {
    if (disabled) return
    setIsDragging(true)
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return
    
    setIsDragging(false)
    const { offset, velocity } = info
    const absX = Math.abs(offset.x)
    const absY = Math.abs(offset.y)
    const absVelX = Math.abs(velocity.x)
    const absVelY = Math.abs(velocity.y)

    // 检查是否达到滑动阈值
    const shouldSwipe = absX > swipeThreshold || absY > swipeThreshold || absVelX > 500 || absVelY > 500

    if (shouldSwipe) {
      if (absX > absY) {
        // 水平滑动
        if (offset.x > 0 && onSwipeRight) {
          controls.start({ x: window.innerWidth, opacity: 0 })
          setTimeout(() => onSwipeRight(), 200)
          return
        } else if (offset.x < 0 && onSwipeLeft) {
          controls.start({ x: -window.innerWidth, opacity: 0 })
          setTimeout(() => onSwipeLeft(), 200)
          return
        }
      } else {
        // 垂直滑动
        if (offset.y > 0 && onSwipeDown) {
          controls.start({ y: window.innerHeight, opacity: 0 })
          setTimeout(() => onSwipeDown(), 200)
          return
        } else if (offset.y < 0 && onSwipeUp) {
          controls.start({ y: -window.innerHeight, opacity: 0 })
          setTimeout(() => onSwipeUp(), 200)
          return
        }
      }
    }

    // 如果没有滑动或启用了回弹，则回到原位
    if (snapBack) {
      controls.start({ x: 0, y: 0, opacity: 1 })
    }
  }

  return (
    <motion.div
      className={cn(
        'relative cursor-grab active:cursor-grabbing',
        disabled && 'pointer-events-none opacity-50',
        className
      )}
      animate={controls}
      drag={!disabled}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 0.95, rotate: isDragging ? 2 : 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
      
      {/* 滑动指示器 */}
      {isDragging && (
        <motion.div
          className="absolute inset-0 border-2 border-dashed border-primary-400 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  )
}

// 拉动刷新组件
interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh: () => Promise<void>
  refreshThreshold?: number
  className?: string
  disabled?: boolean
  refreshingText?: string
  pullText?: string
  releaseText?: string
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  children,
  onRefresh,
  refreshThreshold = 80,
  className,
  disabled = false,
  refreshingText = '刷新中...',
  pullText = '下拉刷新',
  releaseText = '释放刷新'
}) => {
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const controls = useAnimation()

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled || isRefreshing) return
    
    const { offset } = info
    if (offset.y > 0) {
      setIsPulling(true)
      setPullDistance(Math.min(offset.y, refreshThreshold * 1.5))
    }
  }

  const handleDragEnd = async (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled || isRefreshing) return
    
    const { offset } = info
    setIsPulling(false)
    
    if (offset.y >= refreshThreshold) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } finally {
        setIsRefreshing(false)
        setPullDistance(0)
        controls.start({ y: 0 })
      }
    } else {
      setPullDistance(0)
      controls.start({ y: 0 })
    }
  }

  const getRefreshText = () => {
    if (isRefreshing) return refreshingText
    if (pullDistance >= refreshThreshold) return releaseText
    return pullText
  }

  const getRefreshProgress = () => {
    return Math.min((pullDistance / refreshThreshold) * 100, 100)
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* 刷新指示器 */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center bg-gray-800 text-white py-4 z-10"
        initial={{ y: -80 }}
        animate={{ y: isPulling || isRefreshing ? 0 : -80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center space-x-2">
          {isRefreshing ? (
            <motion.div
              className="w-5 h-5 border-2 border-primary-400 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <motion.div
              className="w-5 h-5 border-2 border-primary-400 rounded-full"
              style={{
                background: `conic-gradient(#00f5ff ${getRefreshProgress()}%, transparent ${getRefreshProgress()}%)`
              }}
            />
          )}
          <span className="text-sm">{getRefreshText()}</span>
        </div>
      </motion.div>
      
      {/* 内容区域 */}
      <motion.div
        animate={controls}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{ y: pullDistance }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default {
  TouchFeedback,
  SwipeCard,
  PullToRefresh
}