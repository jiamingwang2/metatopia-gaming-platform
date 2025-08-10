import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TouchFeedback } from './ui/TouchFeedback'
import { RippleEffect, FloatingTooltip } from './ui/MicroInteractions'

interface AnimatedCardProps {
  children: React.ReactNode
  onClick?: () => void
  onLongPress?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  className?: string
  hoverScale?: number
  tapScale?: number
  glowEffect?: boolean
  rippleEffect?: boolean
  touchFeedback?: boolean
  tooltip?: string
  loading?: boolean
  disabled?: boolean
  magnetic?: boolean
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  onClick,
  onLongPress,
  onSwipeLeft,
  onSwipeRight,
  className = '',
  hoverScale = 1.02,
  tapScale = 0.98,
  glowEffect = true,
  rippleEffect = true,
  touchFeedback = true,
  tooltip,
  loading = false,
  disabled = false,
  magnetic = false
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  
  const baseClasses = 'relative overflow-hidden rounded-xl transition-all duration-300'
  const glowClasses = glowEffect ? 'hover:shadow-2xl hover:shadow-accent-500/20' : ''
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  const cardContent = (
    <motion.div
      className={`${baseClasses} ${glowClasses} ${disabledClasses} ${className} ${(onClick || onLongPress) && !disabled ? 'cursor-pointer' : ''}`}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      whileHover={!disabled ? { 
        scale: magnetic ? hoverScale * 1.01 : hoverScale,
        y: -4,
        rotateX: magnetic ? 5 : 0,
        transition: { type: 'spring', stiffness: 400, damping: 17 }
      } : {}}
      whileTap={!disabled ? { 
        scale: tapScale,
        transition: { type: 'spring', stiffness: 400, damping: 17 }
      } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
    >
      {/* 加载状态覆盖层 */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center space-x-2 text-white">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">加载中...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 悬停时的背景光效 */}
      {glowEffect && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-accent-500/10 to-highlight-500/10 opacity-0 pointer-events-none rounded-xl"
          animate={{ opacity: isHovered && !disabled ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* 按压效果 */}
      <motion.div
        className="absolute inset-0 bg-white/5 opacity-0 pointer-events-none rounded-xl"
        animate={{ opacity: isPressed && !disabled ? 1 : 0 }}
        transition={{ duration: 0.1 }}
      />
      
      {/* 卡片内容 */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* 边框光效 */}
      {glowEffect && (
        <motion.div
          className="absolute inset-0 rounded-xl border border-accent-500/20 opacity-0 pointer-events-none"
          animate={{ opacity: isHovered && !disabled ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* 磁性效果指示器 */}
      {magnetic && isHovered && !disabled && (
        <motion.div
          className="absolute -inset-1 rounded-xl border-2 border-primary-400/30 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  )
  
  // 根据配置包装不同的交互效果
  let wrappedCard = cardContent
  
  // 添加触摸反馈
  if (touchFeedback && (onClick || onLongPress || onSwipeLeft || onSwipeRight)) {
    wrappedCard = (
      <TouchFeedback
        onTap={onClick}
        onLongPress={onLongPress}
        onSwipeLeft={onSwipeLeft}
        onSwipeRight={onSwipeRight}
        feedbackType={rippleEffect ? ['ripple', 'scale'] : ['scale']}
        disabled={disabled}
        className="block"
      >
        {cardContent}
      </TouchFeedback>
    )
  }
  
  // 添加波纹效果（如果没有触摸反馈）
  if (rippleEffect && !touchFeedback && onClick) {
    wrappedCard = (
      <RippleEffect className="block">
        {wrappedCard}
      </RippleEffect>
    )
  }
  
  // 添加工具提示
  if (tooltip) {
    wrappedCard = (
      <FloatingTooltip content={tooltip} position="top">
        {wrappedCard}
      </FloatingTooltip>
    )
  }
  
  return wrappedCard
}

export default AnimatedCard