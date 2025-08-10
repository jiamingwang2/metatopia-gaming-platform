import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion'
import { cn } from '../../lib/utils'
import { Heart, Star, ThumbsUp, Share2, Bookmark, Bell, Settings, ChevronRight, Plus, Minus, Play, Pause, Volume2, VolumeX } from 'lucide-react'

// 点击波纹效果组件
interface RippleEffectProps {
  children: React.ReactNode
  className?: string
  rippleColor?: string
  duration?: number
  disabled?: boolean
}

export const RippleEffect: React.FC<RippleEffectProps> = ({
  children,
  className,
  rippleColor = 'rgba(0, 245, 255, 0.3)',
  duration = 600,
  disabled = false
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples(prev => [...prev, { id, x, y }])

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id))
    }, duration)
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      onClick={handleClick}
    >
      {children}
      <AnimatePresence>
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
            exit={{ opacity: 0 }}
            transition={{ duration: duration / 1000, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

// 数字滚动动画组件
interface CounterAnimationProps {
  value: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
}

export const CounterAnimation: React.FC<CounterAnimationProps> = ({
  value,
  duration = 1000,
  className,
  prefix = '',
  suffix = '',
  decimals = 0
}) => {
  const [displayValue, setDisplayValue] = useState(0)
  const controls = useAnimation()

  useEffect(() => {
    const startValue = displayValue
    const endValue = value
    const startTime = Date.now()

    const updateValue = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // 使用缓动函数
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = startValue + (endValue - startValue) * easeOutQuart
      
      setDisplayValue(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(updateValue)
      }
    }

    updateValue()
  }, [value, duration, displayValue])

  return (
    <motion.span
      className={className}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </motion.span>
  )
}

// 图标动画组件
interface AnimatedIconProps {
  icon: React.ReactNode
  isActive?: boolean
  onClick?: () => void
  className?: string
  activeColor?: string
  inactiveColor?: string
  size?: 'sm' | 'md' | 'lg'
  animation?: 'bounce' | 'pulse' | 'rotate' | 'scale' | 'shake'
  disabled?: boolean
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon,
  isActive = false,
  onClick,
  className,
  activeColor = '#00f5ff',
  inactiveColor = '#9ca3af',
  size = 'md',
  animation = 'scale',
  disabled = false
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const controls = useAnimation()

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const getAnimation = () => {
    switch (animation) {
      case 'bounce':
        return isActive ? { y: [0, -4, 0], transition: { duration: 0.3 } } : {}
      case 'pulse':
        return isActive ? { scale: [1, 1.2, 1], transition: { duration: 0.3 } } : {}
      case 'rotate':
        return isActive ? { rotate: 360, transition: { duration: 0.5 } } : {}
      case 'scale':
        return isActive ? { scale: 1.1 } : { scale: 1 }
      case 'shake':
        return isActive ? { x: [0, -2, 2, -2, 0], transition: { duration: 0.3 } } : {}
      default:
        return {}
    }
  }

  const handleClick = () => {
    if (disabled) return
    setIsPressed(true)
    onClick?.()
    setTimeout(() => setIsPressed(false), 150)
  }

  return (
    <motion.button
      className={cn(
        'inline-flex items-center justify-center rounded-lg transition-colors duration-200',
        'hover:bg-primary-700/50 active:bg-primary-600/50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={handleClick}
      disabled={disabled}
      animate={{
        ...getAnimation(),
        scale: isPressed ? 0.95 : (getAnimation().scale || 1)
      }}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      <motion.div
        className={cn(sizeClasses[size])}
        animate={{
          color: isActive ? activeColor : inactiveColor
        }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.div>
    </motion.button>
  )
}

// 进度条动画组件
interface AnimatedProgressProps {
  value: number
  max?: number
  className?: string
  barClassName?: string
  showPercentage?: boolean
  color?: string
  backgroundColor?: string
  height?: 'sm' | 'md' | 'lg'
  animated?: boolean
  striped?: boolean
}

export const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  value,
  max = 100,
  className,
  barClassName,
  showPercentage = false,
  color = '#00f5ff',
  backgroundColor = '#374151',
  height = 'md',
  animated = true,
  striped = false
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  const heightClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6'
  }

  return (
    <div className={cn('relative w-full', className)}>
      <div
        className={cn(
          'w-full rounded-full overflow-hidden',
          heightClasses[height]
        )}
        style={{ backgroundColor }}
      >
        <motion.div
          className={cn(
            'h-full rounded-full relative',
            striped && 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_100%]',
            animated && striped && 'animate-pulse',
            barClassName
          )}
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {striped && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </motion.div>
      </div>
      
      {showPercentage && (
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 text-sm font-medium text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Math.round(percentage)}%
        </motion.div>
      )}
    </div>
  )
}

// 悬浮提示组件
interface FloatingTooltipProps {
  children: React.ReactNode
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
  className?: string
}

export const FloatingTooltip: React.FC<FloatingTooltipProps> = ({
  children,
  content,
  position = 'top',
  delay = 500,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2'
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2'
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2'
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
    }
  }

  return (
    <div
      className={cn('relative inline-block', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={cn(
              'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap',
              getPositionClasses()
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {content}
            <div
              className={cn(
                'absolute w-2 h-2 bg-gray-900 rotate-45',
                position === 'top' && 'top-full left-1/2 -translate-x-1/2 -mt-1',
                position === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
                position === 'left' && 'left-full top-1/2 -translate-y-1/2 -ml-1',
                position === 'right' && 'right-full top-1/2 -translate-y-1/2 -mr-1'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 磁性按钮组件
interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  disabled?: boolean
  onClick?: () => void
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className,
  strength = 0.3,
  disabled = false,
  onClick
}) => {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled) return
    
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength

    x.set(deltaX)
    y.set(deltaY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      className={cn(
        'relative transition-colors duration-200',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.button>
  )
}

// 预设的交互式图标按钮
export const LikeButton: React.FC<{ isLiked: boolean; onToggle: () => void; count?: number }> = ({
  isLiked,
  onToggle,
  count
}) => (
  <RippleEffect className="inline-flex items-center space-x-2 p-2 rounded-lg">
    <AnimatedIcon
      icon={<Heart className={isLiked ? 'fill-current' : ''} />}
      isActive={isLiked}
      onClick={onToggle}
      activeColor="#ef4444"
      animation="bounce"
    />
    {count !== undefined && (
      <CounterAnimation value={count} className="text-sm text-gray-400" />
    )}
  </RippleEffect>
)

export const StarRating: React.FC<{ rating: number; onRate?: (rating: number) => void; readonly?: boolean }> = ({
  rating,
  onRate,
  readonly = false
}) => {
  const [hoverRating, setHoverRating] = useState(0)
  
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
        >
          <AnimatedIcon
            icon={<Star className={(star <= (hoverRating || rating)) ? 'fill-current' : ''} />}
            isActive={star <= (hoverRating || rating)}
            onClick={() => !readonly && onRate?.(star)}
            activeColor="#fbbf24"
            animation="scale"
            disabled={readonly}
            className={!readonly ? 'hover:scale-110' : ''}
          />
        </div>
      ))}
    </div>
  )
}

export default {
  RippleEffect,
  CounterAnimation,
  AnimatedIcon,
  AnimatedProgress,
  FloatingTooltip,
  MagneticButton,
  LikeButton,
  StarRating
}