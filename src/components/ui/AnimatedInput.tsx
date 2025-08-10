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
  const [currentValue, setCurrentValue] = useState(value || defaultValue || '')
  const [validationError, setValidationError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Update internal value when external value changes
  useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value)
    }
  }, [value])

  // Validation function
  const validateInput = (inputValue: string): string | null => {
    if (!validation) return null

    if (validation.required && !inputValue.trim()) {
      return '此字段为必填项'
    }

    if (validation.minLength && inputValue.length < validation.minLength) {
      return `最少需要 ${validation.minLength} 个字符`
    }

    if (validation.maxLength && inputValue.length > validation.maxLength) {
      return `最多允许 ${validation.maxLength} 个字符`
    }

    if (validation.pattern && !validation.pattern.test(inputValue)) {
      return '输入格式不正确'
    }

    if (validation.custom) {
      return validation.custom(inputValue)
    }

    return null
  }

  // Handle focus
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  // Handle blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    if (showValidation) {
      const error = validateInput(currentValue)
      setValidationError(error)
    }
    onBlur?.(e)
  }

  // Handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setCurrentValue(newValue)
    
    // Clear validation error on change if input becomes valid
    if (validationError && showValidation) {
      const error = validateInput(newValue)
      if (!error) {
        setValidationError(null)
      }
    }
    
    onChange?.(e)
  }

  // Determine validation state
  const hasError = error || validationError
  const isValid = !hasError && currentValue.length > 0 && showValidation
  const showSuccess = success || isValid
  const hasValue = currentValue.length > 0

  // Size classes
  const sizeClasses = {
    sm: 'text-sm py-2',
    md: 'text-base py-3',
    lg: 'text-lg py-4'
  }

  // Variant classes
  const variantClasses = {
    default: 'bg-gray-800/50 border border-gray-700 rounded-lg backdrop-blur-sm',
    filled: 'bg-gray-800 border-0 rounded-lg',
    outlined: 'bg-transparent border-2 border-gray-600 rounded-lg',
    underlined: 'bg-transparent border-0 border-b-2 border-gray-600 rounded-none'
  }

  // Status color function
  const getStatusColor = () => {
    if (hasError) {
      return 'border-red-500 focus:border-red-400'
    }
    if (showSuccess) {
      return 'border-green-500 focus:border-green-400'
    }
    if (isFocused) {
      return 'border-neon-500 focus:border-neon-400'
    }
    return 'hover:border-gray-600 focus:border-neon-500'
  }

  // Glow effect function
  const getGlowEffect = () => {
    if (!glowEffect) return ''
    
    if (hasError) {
      return 'shadow-lg shadow-red-500/20'
    }
    if (showSuccess) {
      return 'shadow-lg shadow-green-500/20'
    }
    if (isFocused) {
      return 'shadow-lg shadow-neon-500/30'
    }
    return ''
  }

  return (
    <div className={cn('relative w-full', className)}>
      {/* Label */}
      {label && (
        <motion.label
          htmlFor={props.id}
          className={cn(
            'absolute left-4 transition-all duration-200 pointer-events-none',
            'text-gray-400',
            isFocused || hasValue
              ? 'top-2 text-xs transform -translate-y-1'
              : 'top-1/2 text-base transform -translate-y-1/2'
          )}
          animate={{
            y: isFocused || hasValue ? -8 : 0,
            scale: isFocused || hasValue ? 0.85 : 1,
            color: isFocused ? '#00f5ff' : hasError ? '#ef4444' : '#9ca3af'
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
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
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            animate={{
              color: isFocused ? '#00f5ff' : hasError ? '#ef4444' : '#9ca3af'
            }}
            transition={{ duration: 0.2 }}
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
          disabled={disabled || loading}
          required={required}
          autoComplete={autoComplete}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          placeholder={isFocused || !label ? placeholder : ''}
          className={cn(
            'w-full px-4 py-3 text-white placeholder-gray-400 transition-all duration-200',
            'focus:outline-none focus:ring-0',
            sizeClasses[size],
            variantClasses[variant],
            getStatusColor(),
            getGlowEffect(),
            icon && 'pl-12',
            (rightIcon || type === 'password' || loading || showSuccess || hasError) && 'pr-12',
            disabled && 'opacity-50 cursor-not-allowed',
            inputClassName
          )}
          initial={false}
          animate={animateOnFocus ? {
            scale: isFocused ? 1.02 : 1
          } : {}}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          {...props}
        />

        {/* Right Icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          {/* Loading Spinner */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-5 h-5 border-2 border-neon-500 border-t-transparent rounded-full animate-spin"
            />
          )}

          {/* Validation Icons */}
          {!loading && showValidation && (
            <AnimatePresence mode="wait">
              {hasError && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-5 h-5 text-red-500" />
                </motion.div>
              )}
              {showSuccess && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Check className="w-5 h-5 text-green-500" />
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Password Toggle */}
          {type === 'password' && !loading && (
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-white transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </motion.button>
          )}

          {/* Custom Right Icon */}
          {rightIcon && !loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-gray-400"
            >
              {rightIcon}
            </motion.div>
          )}
        </div>
      </div>

      {/* Helper Text */}
      <AnimatePresence>
        {(hasError || (showValidation && isValid)) && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 flex items-center space-x-2"
          >
            {hasError ? (
              <>
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-sm text-red-500">{hasError}</span>
              </>
            ) : showValidation && isValid ? (
              <>
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-green-500">输入有效</span>
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Count */}
      {maxLength && showValidation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isFocused || hasValue ? 1 : 0 }}
          className="mt-1 text-right"
        >
          <span className={cn(
            'text-xs',
            currentValue.length > maxLength * 0.8 ? 'text-orange-400' : 'text-gray-500',
            currentValue.length >= maxLength ? 'text-red-500' : ''
          )}>
            {currentValue.length}/{maxLength}
          </span>
        </motion.div>
      )}
    </div>
  )
}

export default AnimatedInput