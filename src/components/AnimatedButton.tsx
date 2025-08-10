import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { EnhancedButton } from './ui/EnhancedForm'
import { RippleEffect } from './ui/MicroInteractions'
import { TouchFeedback } from './ui/TouchFeedback'

interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger' | 'success' | 'warning'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  hapticFeedback?: boolean
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  hapticFeedback = true
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  // 映射旧的variant到新的variant
  const mapVariant = (oldVariant: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger' | 'success' | 'warning') => {
    switch (oldVariant) {
      case 'primary': return 'primary'
      case 'secondary': return 'secondary'
      case 'accent': return 'accent'
      case 'ghost': return 'ghost'
      case 'danger': return 'danger'
      case 'success': return 'success'
      case 'warning': return 'warning'
      default: return 'primary'
    }
  }

  const baseClasses = 'relative overflow-hidden font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-950'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-white focus:ring-accent-500 shadow-lg shadow-accent-500/25',
    secondary: 'bg-primary-800 hover:bg-primary-700 text-white border border-primary-600 focus:ring-primary-500',
    accent: 'bg-gradient-to-r from-highlight-500 to-highlight-600 hover:from-highlight-400 hover:to-highlight-500 text-white focus:ring-highlight-500 shadow-lg shadow-highlight-500/25',
    ghost: 'bg-transparent hover:bg-primary-800/50 text-gray-300 hover:text-white border border-transparent hover:border-primary-600 focus:ring-primary-500',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white focus:ring-red-500 shadow-lg shadow-red-500/25',
    success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white focus:ring-green-500 shadow-lg shadow-green-500/25',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white focus:ring-yellow-500 shadow-lg shadow-yellow-500/25'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const disabledClasses = 'opacity-50 cursor-not-allowed'

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    
    // 创建波纹效果
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newRipple = { id: Date.now(), x, y }
    
    setRipples(prev => [...prev, newRipple])
    
    // 移除波纹
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)
    
    onClick?.()
  }

  // 使用新的增强按钮组件，但保持向后兼容
  return (
    <TouchFeedback
      onTap={onClick}
      feedbackType={['ripple', 'scale']}
      disabled={disabled}
      hapticFeedback={hapticFeedback}
      className="inline-block"
    >
      <motion.button
        type={type}
        className={`
          ${baseClasses}
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${disabled ? disabledClasses : ''}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        onClick={handleClick}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {/* 加载状态 */}
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
        
        {/* 按钮内容 */}
        <div className={`flex items-center justify-center space-x-2 ${loading ? 'opacity-50' : ''}`}>
          {icon && iconPosition === 'left' && (
            <motion.div
              initial={{ x: -5, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.div>
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <motion.div
              initial={{ x: 5, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.div>
          )}
        </div>
        
        {/* 保留原有的波纹效果作为备用 */}
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </motion.button>
    </TouchFeedback>
  )
}

export default AnimatedButton