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

        {/* Input Field */}
        <motion.input
          ref={inputRef}
          type={isPassword && !showPassword ? 'password' : type === 'password' ? 'text' : type}
          value={internalValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused ? placeholder : ''}
          disabled={disabled}
          autoComplete={autoComplete}
          maxLength={maxLength}
          pattern={pattern}
          className={cn(
            'w-full bg-transparent border-0 outline-none text-white placeholder-gray-500',
            'transition-all duration-200',
            (icon || (!hasError && !isValid && !loading)) ? 'pl-12' : 'pl-4',
            (isPassword || hasError || isValid || loading) ? 'pr-12' : 'pr-4'
          )}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        />

        {/* Right Icons */}
        <div className="absolute right-3 flex items-center space-x-2">
          <AnimatePresence>
            {/* Status Icon */}
            {(hasError || isValid || loading) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {getIcon()}
              </motion.div>
            )}

            {/* Password Toggle */}
            {isPassword && (
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white transition-colors duration-200"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Character Count */}
      <AnimatePresence>
        {showCharCount && maxLength && (
          <motion.div
            className="absolute right-2 -bottom-6 text-xs text-gray-500"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {internalValue.length}/{maxLength}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error/Success Message */}
      <AnimatePresence>
        {(hasError || success) && (
          <motion.div
            className={cn(
              'mt-2 text-sm flex items-center space-x-2',
              hasError ? 'text-red-500' : 'text-green-500'
            )}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {hasError ? (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <Check className="w-4 h-4 flex-shrink-0" />
            )}
            <span>{hasError || (success && '输入有效')}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 增强的按钮组件
interface EnhancedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  className?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  ripple?: boolean
  magnetic?: boolean
}

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  ripple = true,
  magnetic = false
}) => {
  const [isPressed, setIsPressed] = useState(false)

  const sizeClasses = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-13 px-8 text-lg'
  }

  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white border-primary-600',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white border-gray-700',
    outline: 'bg-transparent hover:bg-primary-600/10 text-primary-400 border-primary-600',
    ghost: 'bg-transparent hover:bg-gray-800 text-gray-300 border-transparent',
    danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600'
  }

  const handleClick = () => {
    if (disabled || loading) return
    setIsPressed(true)
    onClick?.()
    setTimeout(() => setIsPressed(false), 150)
  }

  const buttonContent = (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={cn(
        'relative inline-flex items-center justify-center rounded-lg border-2 font-medium',
        'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      animate={{
        scale: isPressed ? 0.95 : 1
      }}
      transition={{ duration: 0.1 }}
    >
      {/* Loading Spinner */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="w-5 h-5 animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button Content */}
      <motion.div
        className={cn(
          'flex items-center space-x-2',
          loading && 'opacity-0'
        )}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
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
      </motion.div>
    </motion.button>
  )

  if (ripple) {
    return (
      <RippleEffect className="inline-block">
        {buttonContent}
      </RippleEffect>
    )
  }

  return buttonContent
}

// 表单组件
interface FormFieldProps {
  children: React.ReactNode
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({ children, className }) => {
  return (
    <motion.div
      className={cn('space-y-2', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

export default {
  EnhancedInput,
  EnhancedButton,
  FormField
}