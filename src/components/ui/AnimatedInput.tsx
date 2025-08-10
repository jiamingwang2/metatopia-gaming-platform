import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react'

interface AnimatedInputProps {
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  value?: string
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
  disabled?: boolean
  required?: boolean
  error?: string
  success?: boolean
  loading?: boolean
  className?: string
  inputClassName?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined' | 'underlined'
  autoComplete?: string
  maxLength?: number
  minLength?: number
  pattern?: string
  id?: string
  validation?: {
    required?: boolean
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    custom?: (value: string) => string | null
  }
  showValidation?: boolean
  animateOnFocus?: boolean
  glowEffect?: boolean
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
  icon,
  rightIcon,
  disabled = false,
  required = false,
  error,
  success = false,
  loading = false,
  className,
  inputClassName,
  size = 'md',
  variant = 'default',
  autoComplete,
  maxLength,
  minLength,
  pattern,
  validation,
  showValidation = true,
  animateOnFocus = true,
  glowEffect = true,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [internalValue, setInternalValue] = useState(defaultValue || '')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentValue = value !== undefined ? value : internalValue
  const hasValue = currentValue && currentValue.length > 0
  const hasError = error || validationError
  const showSuccess = success || (isValid && hasValue && !hasError)

  // Validation logic
  const validateInput = (inputValue: string) => {
    if (!validation || !showValidation) return

    let errorMessage: string | null = null

    if (validation.required && !inputValue.trim()) {
      errorMessage = '此字段为必填项'
    } else if (validation.minLength && inputValue.length < validation.minLength) {
      errorMessage = `最少需要 ${validation.minLength} 个字符`
    } else if (validation.maxLength && inputValue.length > validation.maxLength) {
      errorMessage = `最多允许 ${validation.maxLength} 个字符`
    } else if (validation.pattern && !validation.pattern.test(inputValue)) {
      errorMessage = '格式不正确'
    } else if (validation.custom) {
      errorMessage = validation.custom(inputValue)
    }

    setValidationError(errorMessage)
    setIsValid(!errorMessage && inputValue.length > 0)
  }

  useEffect(() => {
    if (showValidation) {
      validateInput(currentValue)
    }
  }, [currentValue, validation, showValidation])

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (value === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(e)
  }

  const sizeClasses = {
    sm: 'h-10 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-lg'
  }

  const variantClasses = {
    default: 'bg-primary-800/50 border border-primary-700 rounded-lg',
    filled: 'bg-primary-800 border-0 rounded-lg',
    outlined: 'bg-transparent border-2 border-primary-700 rounded-lg',
    underlined: 'bg-transparent border-0 border-b-2 border-primary-700 rounded-none'
  }

  const getStatusColor = () => {
    if (hasError) return 'border-red-500 focus:border-red-500'
    if (showSuccess) return 'border-green-500 focus:border-green-500'
    if (isFocused) return 'border-neon-500 focus:border-neon-500'
    return 'focus:border-neon-500'
  }

  const getGlowEffect = () => {
    if (!glowEffect || disabled) return ''
    if (hasError) return 'focus:shadow-lg focus:shadow-red-500/20'
    if (showSuccess) return 'focus:shadow-lg focus:shadow-green-500/20'
    return 'focus:shadow-lg focus:shadow-neon-500/20'
  }

  return (
    <div className={cn('relative w-full', className)}>
      {/* Label */}
      {label && (
        <motion.label
          initial={false}
          animate={{
            scale: isFocused || hasValue ? 0.85 : 1,
            y: isFocused || hasValue ? -24 : 0,
            color: hasError ? '#ef4444' : showSuccess ? '#10b981' : isFocused ? '#00f5ff' : '#9ca3af'
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none font-medium z-10',
            'origin-left transition-colors duration-200',
            variant === 'underlined' && 'left-0'
          )}
          htmlFor={props.id || undefined}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {icon && (
          <motion.div
            initial={false}
            animate={{
              color: hasError ? '#ef4444' : showSuccess ? '#10b981' : isFocused ? '#00f5ff' : '#9ca3af'
            }}
            transition={{ duration: 0.2 }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
          >
            {icon}
          </motion.div>
        )}

        {/* Input Field */}
        <motion.input
          ref={inputRef}
          type={type === 'password' && showPassword ? 'text' : type}
          value={currentValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          className={cn(
            'w-full px-4 py-3 text-white placeholder-gray-400',
            'transition-all duration-200 outline-none',
            sizeClasses[size],
            variantClasses[variant],
            getStatusColor(),
            getGlowEffect(),
            icon && 'pl-12',
            (rightIcon || type === 'password') && 'pr-12',
            disabled && 'opacity-50 cursor-not-allowed',
            inputClassName
          )}
          initial={false}
          animate={animateOnFocus ? {
            scale: isFocused ? 1.02 : 1
          } : {}}
          transition={{ duration: 0.2 }}
          {...props}
        />

        {/* Right Icon / Password Toggle */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          {loading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-neon-500 border-t-transparent rounded-full"
            />
          )}
          
          {!loading && showSuccess && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="text-green-500"
            >
              <Check className="w-5 h-5" />
            </motion.div>
          )}
          
          {!loading && hasError && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="text-red-500"
            >
              <AlertCircle className="w-5 h-5" />
            </motion.div>
          )}
          
          {type === 'password' && (
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-white transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </motion.button>
          )}
          
          {rightIcon && !loading && !showSuccess && !hasError && (
            <motion.div
              initial={false}
              animate={{
                color: isFocused ? '#00f5ff' : '#9ca3af'
              }}
              transition={{ duration: 0.2 }}
            >
              {rightIcon}
            </motion.div>
          )}
        </div>
      </div>

      {/* Error/Success Message */}
      <AnimatePresence>
        {(hasError || showSuccess) && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'mt-2 text-sm font-medium flex items-center space-x-2',
              hasError ? 'text-red-500' : 'text-green-500'
            )}
          >
            {hasError ? (
              <>
                <X className="w-4 h-4" />
                <span>{hasError}</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>输入有效</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Count */}
      {maxLength && showValidation && (
        <motion.div
          className="mt-1 text-xs text-gray-500 text-right"
          initial={{ opacity: 0 }}
          animate={{ opacity: isFocused ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
        >
          {currentValue.length}/{maxLength}
        </motion.div>
      )}
    </div>
  )
}

export default AnimatedInput