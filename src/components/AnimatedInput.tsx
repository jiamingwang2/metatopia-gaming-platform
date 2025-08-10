import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { EnhancedInput } from './ui/EnhancedForm'

interface AnimatedInputProps {
  label?: string
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  error?: string
  icon?: React.ReactNode
  required?: boolean
  loading?: boolean
  disabled?: boolean
  success?: boolean
  validation?: (value: string) => string | null
  showCharCount?: boolean
  maxLength?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'filled' | 'outlined'
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  error,
  icon,
  required = false,
  loading = false,
  disabled = false,
  success = false,
  validation,
  showCharCount = false,
  maxLength,
  size = 'md',
  variant = 'default'
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(!!value)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => setIsFocused(false)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(!!e.target.value)
    onChange?.(e)
  }

  // 使用新的增强输入组件，但保持向后兼容
  const handleValueChange = (newValue: string) => {
    const syntheticEvent = {
      target: { value: newValue },
      currentTarget: { value: newValue }
    } as React.ChangeEvent<HTMLInputElement>
    onChange?.(syntheticEvent)
  }

  return (
    <EnhancedInput
      label={label}
      type={type as any}
      placeholder={placeholder}
      value={value}
      onChange={handleValueChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      error={error}
      success={success}
      loading={loading}
      disabled={disabled}
      required={required}
      className={className}
      icon={icon}
      maxLength={maxLength}
      validation={validation}
      showCharCount={showCharCount}
      size={size}
      variant={variant}
    />
  )
}

export default AnimatedInput