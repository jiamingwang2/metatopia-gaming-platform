import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { cn } from '../../lib/utils'
import { Eye, EyeOff, Check, X, AlertCircle, Loader2, Search, Mail, Lock, User, Phone } from 'lucide-react'
import { RippleEffect, FloatingTooltip } from './MicroInteractions'

// 增强的输入框组件
interface EnhancedInputProps {
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'search'
  value?: string
  onChange?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  error?: string
  success?: boolean
  loading?: boolean
  disabled?: boolean
  required?: boolean
  className?: string
  icon?: React.ReactNode
  autoComplete?: string
  maxLength?: number
  pattern?: string
  validation?: (value: string) => string | null
  showCharCount?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined'
}

export const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  placeholder,
  type = 'text',
  value = '',
  onChange,
  onFocus,
  onBlur,
  error,
  success,
  loading,
  disabled,
  required,
  className,
  icon,
  autoComplete,
  maxLength,
  pattern,
  validation,
  showCharCount,
  size = 'md',
  variant = 'default'
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [internalValue, setInternalValue] = useState(value)
  const [validationError, setValidationError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const controls = useAnimation()

  const isPassword = type === 'password'
  const hasValue = internalValue.length > 0
  const hasError = error || validationError
  const isValid = success || (hasValue && !hasError && !loading)

  const sizeClasses = {
    sm: 'h-10 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-lg'
  }

  const variantClasses = {
    default: 'border-2 bg-transparent',
    filled: 'border-0 bg-gray-800/50',
    outlined: 'border-2 bg-transparent'
  }

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  useEffect(() => {
    if (hasError) {
      controls.start({
        x: [0, -5, 5, -5, 0],
        transition: { duration: 0.4 }
      })
    }
  }, [hasError, controls])

  const handleFocus = () => {
    setIsFocused(true)
    onFocus?.()
  }

  const handleBlur = () => {
    setIsFocused(false)
    onBlur?.()
    
    if (validation && internalValue) {
      const validationResult = validation(internalValue)
      setValidationError(validationResult)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInternalValue(newValue)
    onChange?.(newValue)
    
    // 清除验证错误
    if (validationError) {
      setValidationError(null)
    }
  }

  const getBorderColor = () => {
    if (hasError) return 'border-red-500'
    if (isValid) return 'border-green-500'
    if (isFocused) return 'border-primary-400'
    return 'border-gray-600'
  }

  const getGlowEffect = () => {
    if (hasError) return 'shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'
    if (isValid) return 'shadow-[0_0_0_3px_rgba(34,197,94,0.1)]'
    if (isFocused) return 'shadow-[0_0_0_3px_rgba(0,245,255,0.1)]'
    return ''
  }

  const getIcon = () => {
    if (loading) return <Loader2 className="w-5 h-5 animate-spin text-primary-400" />
    if (hasError) return <AlertCircle className="w-5 h-5 text-red-500" />
    if (isValid) return <Check className="w-5 h-5 text-green-500" />
    return icon
  }

  const getDefaultIcon = () => {
    switch (type) {
      case 'email': return <Mail className="w-5 h-5" />
      case 'password': return <Lock className="w-5 h-5" />
      case 'search': return <Search className="w-5 h-5" />
      case 'tel': return <Phone className="w-5 h-5" />
      default: return <User className="w-5 h-5" />
    }
  }

  return (
    <div className={cn('relative w-full', className)}>
      {/* Label */}
      <AnimatePresence>
        {label && (
          <motion.label
            className={cn(
              'absolute left-3 transition-all duration-200 pointer-events-none',
              'text-gray-400',
              (isFocused || hasValue) ? 'text-xs -top-2 bg-gray-900 px-2' : `text-${size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'base'} top-1/2 -translate-y-1/2`
            )}
            animate={{
              fontSize: (isFocused || hasValue) ? '0.75rem' : size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem',
              y: (isFocused || hasValue) ? '-0.5rem' : '50%',
              x: (isFocused || hasValue) ? '0' : icon ? '2.5rem' : '0'
            }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </motion.label>
        )}
      </AnimatePresence>

      {/* Input Container */}
      <motion.div
        className={cn(
          'relative flex items-center w-full rounded-lg transition-all duration-200',
          sizeClasses[size],
          variantClasses[variant],
          getBorderColor(),
          getGlowEffect(),
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        animate={controls}
      >
        {/* Left Icon */}
        <AnimatePresence>
          {(icon || (!hasError && !isValid && !loading)) && (
            <motion.div
              className="absolute left-3 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-gray-400">
                {icon || getDefaultIcon()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Icon */}
        <AnimatePresence>
          {(hasError || isValid || loading) && (
            <motion.div
              className="absolute left-3 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {getIcon()}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input Field */}
        <RippleEffect className="flex-1">
          <input
            ref={inputRef}
            type={isPassword && showPassword ? 'text' : type}
            value={internalValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            autoComplete={autoComplete}
            maxLength={maxLength}
            pattern={pattern}
            className={cn(
              'w-full h-full px-12 bg-transparent text-white placeholder-gray-500',
              'focus:outline-none transition-all duration-200',
              disabled && 'cursor-not-allowed'
            )}
          />
        </RippleEffect>

        {/* Right Actions */}
        <div className="absolute right-3 flex items-center space-x-2">
          {/* Password Toggle */}
          {isPassword && (
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-white transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={disabled}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </motion.button>
          )}

          {/* Clear Button */}
          {hasValue && !disabled && (
            <motion.button
              type="button"
              onClick={() => {
                setInternalValue('')
                onChange?.('')
                inputRef.current?.focus()
              }}
              className="text-gray-400 hover:text-white transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            className="mt-2 text-sm text-red-500 flex items-center space-x-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <AlertCircle className="w-4 h-4" />
            <span>{hasError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Count */}
      {showCharCount && maxLength && (
        <motion.div
          className="mt-1 text-xs text-gray-500 text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: isFocused ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
        >
          {internalValue.length}/{maxLength}
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

export default EnhancedInput