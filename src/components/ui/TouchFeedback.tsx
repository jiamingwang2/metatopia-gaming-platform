import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useAnimation, PanInfo } from 'framer-motion'
import { cn } from '../../lib/utils'

// 触摸反馈类型
type TouchFeedbackType = 'press' | 'ripple' | 'scale' | 'bounce' | 'glow' | 'vibrate'

// 触摸反馈组件
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
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>>([])
  const [isLongPressed, setIsLongPressed] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const longPressTimer = useRef<NodeJS.Timeout>()
  const controls = useAnimation()

  const feedbackTypes = Array.isArray(feedbackType) ? feedbackType : [feedbackType]

  // 触觉反馈
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!hapticFeedback || disabled) return
    
    // 检查是否支持触觉反馈
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      }
      navigator.vibrate(patterns[type])
    }
  }, [hapticFeedback, disabled])

  // 创建波纹效果
  const createRipple = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (disabled || !feedbackTypes.includes('ripple')) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    const x = clientX - rect.left
    const y = clientY - rect.top
    const id = Date.now()

    setRipples(prev => [...prev, { id, x, y }])

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id))
    }, 600)
  }, [disabled, feedbackTypes])

  // 处理触摸开始
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return

    setIsPressed(true)
    createRipple(e)
    triggerHaptic('light')

    // 长按检测
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        setIsLongPressed(true)
        triggerHaptic('medium')
        onLongPress()
      }, longPressDuration)
    }

    // 应用反馈效果
    if (feedbackTypes.includes('scale')) {
      controls.start({ scale: pressScale })
    }
    if (feedbackTypes.includes('glow')) {
      controls.start({ 
        boxShadow: `0 0 20px ${glowColor}`,
        transition: { duration: 0.2 }
      })
    }
  }, [disabled, createRipple, triggerHaptic, onLongPress, longPressDuration, feedbackTypes, controls, pressScale, glowColor])

  // 处理触摸结束
  const handleTouchEnd = useCallback(() => {
    if (disabled) return

    setIsPressed(false)
    
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }

    if (!isLongPressed && onTap) {
      triggerHaptic('light')
      onTap()
    }

    setIsLongPressed(false)

    // 恢复反馈效果
    if (feedbackTypes.includes('scale')) {
      controls.start({ scale: 1 })
    }
    if (feedbackTypes.includes('glow')) {
      controls.start({ 
        boxShadow: 'none',
        transition: { duration: 0.3 }
      })
    }
    if (feedbackTypes.includes('bounce')) {
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.3 }
      })
    }
  }, [disabled, isLongPressed, onTap, triggerHaptic, feedbackTypes, controls])

  // 处理拖拽
  const handleDrag = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return

    const { offset } = info
    const absX = Math.abs(offset.x)
    const absY = Math.abs(offset.y)

    if (absX > swipeThreshold || absY > swipeThreshold) {
      triggerHaptic('medium')
      
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
  }, [disabled, swipeThreshold, triggerHaptic, onSwipeRight, onSwipeLeft, onSwipeDown, onSwipeUp])

  // 鼠标事件处理（用于桌面端测试）
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (disabled) return
    createRipple(e)
    setIsPressed(true)
    
    if (feedbackTypes.includes('scale')) {
      controls.start({ scale: pressScale })
    }
  }, [disabled, createRipple, feedbackTypes, controls, pressScale])

  const handleMouseUp = useCallback(() => {
    if (disabled) return
    setIsPressed(false)
    
    if (onTap) {
      onTap()
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
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      animate={controls}
      drag={onSwipeLeft || onSwipeRight || onSwipeUp || onSwipeDown ? true : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDrag={handleDrag}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      whileTap={feedbackTypes.includes('press') ? { scale: pressScale } : {}}
    >
      {children}
      
      {/* 波纹效果 */}
      {feedbackTypes.includes('ripple') && (
        <div className="absolute inset-0 pointer-events-none">
          {ripples.map(ripple => (
            <motion.div
              key={ripple.id}
              className="absolute rounded-full"
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
      
      {/* 发光效果 */}
      {feedbackTypes.includes('glow') && isPressed && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-inherit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            boxShadow: `0 0 20px ${glowColor}`,
            background: `radial-gradient(circle, ${glowColor}20 0%, transparent 70%)`
          }}
        />
      )}
    </motion.div>
  )
}

// 预设的触摸反馈组件
export const PressButton: React.FC<Omit<TouchFeedbackProps, 'feedbackType'>> = (props) => (
  <TouchFeedback feedbackType="press" {...props} />
)

export const RippleButton: React.FC<Omit<TouchFeedbackProps, 'feedbackType'>> = (props) => (
  <TouchFeedback feedbackType="ripple" {...props} />
)

export const ScaleButton: React.FC<Omit<TouchFeedbackProps, 'feedbackType'>> = (props) => (
  <TouchFeedback feedbackType="scale" {...props} />
)

export const BounceButton: React.FC<Omit<TouchFeedbackProps, 'feedbackType'>> = (props) => (
  <TouchFeedback feedbackType="bounce" {...props} />
)

export const GlowButton: React.FC<Omit<TouchFeedbackProps, 'feedbackType'>> = (props) => (
  <TouchFeedback feedbackType="glow" {...props} />
)

// 组合效果按钮
export const EnhancedButton: React.FC<Omit<TouchFeedbackProps, 'feedbackType'>> = (props) => (
  <TouchFeedback feedbackType={['press', 'ripple', 'glow']} {...props} />
)

// 滑动检测组件
interface SwipeDetectorProps {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  className?: string
}

export const SwipeDetector: React.FC<SwipeDetectorProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  className
}) => {
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setStartPos({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startPos) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - startPos.x
    const deltaY = touch.clientY - startPos.y
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (absX > threshold || absY > threshold) {
      if (absX > absY) {
        // 水平滑动
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      } else {
        // 垂直滑动
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown()
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp()
        }
      }
    }

    setStartPos(null)
  }

  return (
    <div
      className={className}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  )
}

// 长按检测组件
interface LongPressDetectorProps {
  children: React.ReactNode
  onLongPress: () => void
  duration?: number
  className?: string
}

export const LongPressDetector: React.FC<LongPressDetectorProps> = ({
  children,
  onLongPress,
  duration = 500,
  className
}) => {
  const timerRef = useRef<NodeJS.Timeout>()
  const [isPressed, setIsPressed] = useState(false)

  const handleStart = () => {
    setIsPressed(true)
    timerRef.current = setTimeout(() => {
      onLongPress()
      setIsPressed(false)
    }, duration)
  }

  const handleEnd = () => {
    setIsPressed(false)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return (
    <div
      className={cn(
        'select-none',
        isPressed && 'opacity-80',
        className
      )}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
    >
      {children}
    </div>
  )
}

export default TouchFeedback