import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, useAnimation, Variants } from 'framer-motion'
import { cn } from '../../lib/utils'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale' | 'rotate'
  delay?: number
  duration?: number
  distance?: number
  threshold?: number
  triggerOnce?: boolean
  cascade?: boolean
  cascadeDelay?: number
  stagger?: number
  viewport?: {
    once?: boolean
    margin?: string
    amount?: number | 'some' | 'all'
  }
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 50,
  threshold = 0.1,
  triggerOnce = true,
  cascade = false,
  cascadeDelay = 0.1,
  stagger = 0,
  viewport
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: triggerOnce,
    amount: viewport?.amount || threshold
  })
  const controls = useAnimation()

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...(direction === 'up' && { y: distance }),
      ...(direction === 'down' && { y: -distance }),
      ...(direction === 'left' && { x: distance }),
      ...(direction === 'right' && { x: -distance }),
      ...(direction === 'scale' && { scale: 0.8 }),
      ...(direction === 'rotate' && { rotate: -10, scale: 0.9 })
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      rotate: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
        ...(stagger > 0 && {
          staggerChildren: stagger,
          delayChildren: delay
        })
      }
    }
  }

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    } else if (!triggerOnce) {
      controls.start('hidden')
    }
  }, [isInView, controls, triggerOnce])

  // 如果启用了cascade效果，为子元素添加递增延迟
  const processChildren = (children: React.ReactNode): React.ReactNode => {
    if (!cascade) return children

    return React.Children.map(children, (child, index) => {
      if (React.isValidElement(child)) {
        return (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: duration * 0.8,
                  delay: index * cascadeDelay
                }
              }
            }}
          >
            {child}
          </motion.div>
        )
      }
      return child
    })
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={cn(className)}
    >
      {processChildren(children)}
    </motion.div>
  )
}

export default ScrollReveal

// 预设的滚动动画组件
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

// 级联动画组件
export const CascadeReveal: React.FC<Omit<ScrollRevealProps, 'cascade'>> = (props) => (
  <ScrollReveal cascade={true} cascadeDelay={0.1} {...props} />
)

// 交错动画组件
export const StaggerReveal: React.FC<Omit<ScrollRevealProps, 'stagger'>> = (props) => (
  <ScrollReveal stagger={0.1} {...props} />
)