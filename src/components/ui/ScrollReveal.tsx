import React, { useRef, useEffect } from 'react'
import { motion, useInView, useAnimation, Variants } from 'framer-motion'
import { cn } from '../../lib/utils'

// 滚动显示动画类型
type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale' | 'rotate'

// 滚动显示组件属性
interface ScrollRevealProps {
  children: React.ReactNode
  direction?: RevealDirection
  delay?: number
  duration?: number
  distance?: number
  className?: string
  triggerOnce?: boolean
  threshold?: number
  cascade?: boolean
  stagger?: number
}

// 动画变体定义
const createVariants = (direction: RevealDirection, distance: number): Variants => {
  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  }

  switch (direction) {
    case 'up':
      variants.hidden = { opacity: 0, y: distance }
      variants.visible = { opacity: 1, y: 0, ...variants.visible }
      break
    case 'down':
      variants.hidden = { opacity: 0, y: -distance }
      variants.visible = { opacity: 1, y: 0, ...variants.visible }
      break
    case 'left':
      variants.hidden = { opacity: 0, x: distance }
      variants.visible = { opacity: 1, x: 0, ...variants.visible }
      break
    case 'right':
      variants.hidden = { opacity: 0, x: -distance }
      variants.visible = { opacity: 1, x: 0, ...variants.visible }
      break
    case 'fade':
      variants.hidden = { opacity: 0 }
      variants.visible = { opacity: 1, ...variants.visible }
      break
    case 'scale':
      variants.hidden = { opacity: 0, scale: 0.8 }
      variants.visible = { opacity: 1, scale: 1, ...variants.visible }
      break
    case 'rotate':
      variants.hidden = { opacity: 0, rotate: -10, scale: 0.9 }
      variants.visible = { opacity: 1, rotate: 0, scale: 1, ...variants.visible }
      break
    default:
      variants.hidden = { opacity: 0, y: distance }
      variants.visible = { opacity: 1, y: 0, ...variants.visible }
  }

  return variants
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 50,
  className,
  triggerOnce = true,
  threshold = 0.1,
  cascade = false,
  stagger = 0.1
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: triggerOnce,
    margin: '-10px',
    amount: threshold
  })
  const controls = useAnimation()

  const variants = createVariants(direction, distance)

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    } else if (!triggerOnce) {
      controls.start('hidden')
    }
  }, [isInView, controls, triggerOnce])

  // 如果启用了级联效果，为子元素添加交错动画
  if (cascade && React.Children.count(children) > 1) {
    return (
      <div ref={ref} className={className}>
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            variants={variants}
            initial="hidden"
            animate={controls}
            transition={{
              duration,
              delay: delay + index * stagger,
              type: 'spring',
              stiffness: 100,
              damping: 15
            }}
          >
            {child}
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={controls}
      transition={{
        duration,
        delay,
        type: 'spring',
        stiffness: 100,
        damping: 15
      }}
    >
      {children}
    </motion.div>
  )
}

// 预设组件
export const FadeInUp: React.FC<Omit<ScrollRevealProps, 'direction'>> = (props) => (
  <ScrollReveal direction="up" {...props} />
)

export const FadeInDown: React.FC<Omit<ScrollRevealProps, 'direction'>> = (props) => (
  <ScrollReveal direction="down" {...props} />
)

export const FadeInLeft: React.FC<Omit<ScrollRevealProps, 'direction'>> = (props) => (
  <ScrollReveal direction="left" {...props} />
)

export const FadeInRight: React.FC<Omit<ScrollRevealProps, 'direction'>> = (props) => (
  <ScrollReveal direction="right" {...props} />
)

export const ScaleIn: React.FC<Omit<ScrollRevealProps, 'direction'>> = (props) => (
  <ScrollReveal direction="scale" {...props} />
)

export const RotateIn: React.FC<Omit<ScrollRevealProps, 'direction'>> = (props) => (
  <ScrollReveal direction="rotate" {...props} />
)

export const CascadeReveal: React.FC<Omit<ScrollRevealProps, 'cascade'>> = (props) => (
  <ScrollReveal cascade={true} {...props} />
)

export const StaggerReveal: React.FC<ScrollRevealProps> = (props) => (
  <ScrollReveal cascade={true} stagger={0.2} {...props} />
)

export default {
  ScrollReveal,
  FadeInUp,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  ScaleIn,
  RotateIn,
  CascadeReveal,
  StaggerReveal
}