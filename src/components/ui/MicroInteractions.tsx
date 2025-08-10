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
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>>([])
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
        color: isActive ? activeColor : inactiveColor
      }}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ duration: 0.2 }}
    >
      <div className={sizeClasses[size]}>
        {icon}
      </div>
    </motion.button>
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
  const rotateX = useTransform(y, [-100, 100], [30, -30])
  const rotateY = useTransform(x, [-100, 100], [-30, 30])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || !ref.current) return

    const rect = ref.current.getBoundingClientRect()
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
        'relative transform-gpu transition-colors duration-200',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={{
        x,
        y,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {children}
    </motion.button>
  )
}

// 进度指示器组件
interface ProgressIndicatorProps {
  progress: number
  className?: string
  color?: string
  backgroundColor?: string
  showPercentage?: boolean
  animated?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  className,
  color = '#00f5ff',
  backgroundColor = '#374151',
  showPercentage = false,
  animated = true,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }

  const clampedProgress = Math.max(0, Math.min(100, progress))

  return (
    <div className={cn('relative w-full', className)}>
      <div
        className={cn(
          'w-full rounded-full overflow-hidden',
          sizeClasses[size]
        )}
        style={{ backgroundColor }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${clampedProgress}%` }}
          transition={animated ? { duration: 0.5, ease: 'easeOut' } : { duration: 0 }}
        />
      </div>
      {showPercentage && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {Math.round(clampedProgress)}%
        </motion.div>
      )}
    </div>
  )
}

// 浮动提示组件
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
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay)
    setTimeoutId(id)
  }

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      setTimeoutId(null)
    }
    setIsVisible(false)
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  return (
    <div
      className={cn('relative inline-block', className)}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={cn(
              'absolute z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg',
              'border border-gray-700 whitespace-nowrap',
              positionClasses[position]
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {content}
            {/* Arrow */}
            <div
              className={cn(
                'absolute w-2 h-2 bg-gray-800 border-gray-700 rotate-45',
                position === 'top' && 'top-full left-1/2 -translate-x-1/2 -mt-1 border-r border-b',
                position === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 -mb-1 border-l border-t',
                position === 'left' && 'left-full top-1/2 -translate-y-1/2 -ml-1 border-t border-r',
                position === 'right' && 'right-full top-1/2 -translate-y-1/2 -mr-1 border-b border-l'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 交互式卡片组件
interface InteractiveCardProps {
  children: React.ReactNode
  className?: string
  hoverEffect?: 'lift' | 'glow' | 'tilt' | 'scale'
  clickEffect?: 'ripple' | 'bounce' | 'press'
  disabled?: boolean
  onClick?: () => void
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className,
  hoverEffect = 'lift',
  clickEffect = 'ripple',
  disabled = false,
  onClick
}) => {
  const [isPressed, setIsPressed] = useState(false)
  const controls = useAnimation()

  const getHoverAnimation = () => {
    switch (hoverEffect) {
      case 'lift':
        return { y: -8, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)' }
      case 'glow':
        return { boxShadow: '0 0 30px rgba(0, 245, 255, 0.3)' }
      case 'tilt':
        return { rotateX: 5, rotateY: 5 }
      case 'scale':
        return { scale: 1.05 }
      default:
        return {}
    }
  }

  const getClickAnimation = () => {
    switch (clickEffect) {
      case 'bounce':
        return { scale: [1, 0.95, 1.02, 1] }
      case 'press':
        return { scale: 0.98 }
      default:
        return {}
    }
  }

  const handleClick = () => {
    if (disabled) return
    setIsPressed(true)
    controls.start(getClickAnimation())
    onClick?.()
    setTimeout(() => setIsPressed(false), 200)
  }

  const CardContent = () => (
    <motion.div
      className={cn(
        'relative cursor-pointer transform-gpu',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileHover={!disabled ? getHoverAnimation() : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      animate={controls}
      onClick={handleClick}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )

  if (clickEffect === 'ripple') {
    return (
      <RippleEffect disabled={disabled}>
        <CardContent />
      </RippleEffect>
    )
  }

  return <CardContent />
}

export default {
  RippleEffect,
  CounterAnimation,
  AnimatedIcon,
  MagneticButton,
  ProgressIndicator,
  FloatingTooltip,
  InteractiveCard
}