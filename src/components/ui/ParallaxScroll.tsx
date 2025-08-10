import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { cn } from '../../lib/utils'

interface ParallaxScrollProps {
  children: React.ReactNode
  className?: string
  speed?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  offset?: number
  springConfig?: {
    stiffness?: number
    damping?: number
    mass?: number
  }
}

const ParallaxScroll: React.FC<ParallaxScrollProps> = ({
  children,
  className,
  speed = 0.5,
  direction = 'up',
  offset = 0,
  springConfig = { stiffness: 100, damping: 30, mass: 1 }
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  // 根据方向计算变换值
  const getTransform = () => {
    const range = [-100 * speed, 100 * speed]
    
    switch (direction) {
      case 'up':
        return useTransform(scrollYProgress, [0, 1], [range[1] + offset, range[0] + offset])
      case 'down':
        return useTransform(scrollYProgress, [0, 1], [range[0] + offset, range[1] + offset])
      case 'left':
        return useTransform(scrollYProgress, [0, 1], [range[1] + offset, range[0] + offset])
      case 'right':
        return useTransform(scrollYProgress, [0, 1], [range[0] + offset, range[1] + offset])
      default:
        return useTransform(scrollYProgress, [0, 1], [range[1] + offset, range[0] + offset])
    }
  }

  const transform = getTransform()
  const springTransform = useSpring(transform, springConfig)

  const getMotionProps = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { y: springTransform }
      case 'left':
      case 'right':
        return { x: springTransform }
      default:
        return { y: springTransform }
    }
  }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={getMotionProps()}
    >
      {children}
    </motion.div>
  )
}

export default ParallaxScroll

// 预设的视差组件
export const ParallaxUp: React.FC<Omit<ParallaxScrollProps, 'direction'>> = (props) => (
  <ParallaxScroll direction="up" {...props} />
)

export const ParallaxDown: React.FC<Omit<ParallaxScrollProps, 'direction'>> = (props) => (
  <ParallaxScroll direction="down" {...props} />
)

export const ParallaxLeft: React.FC<Omit<ParallaxScrollProps, 'direction'>> = (props) => (
  <ParallaxScroll direction="left" {...props} />
)

export const ParallaxRight: React.FC<Omit<ParallaxScrollProps, 'direction'>> = (props) => (
  <ParallaxScroll direction="right" {...props} />
)

// 多层视差容器
interface ParallaxLayerProps {
  children: React.ReactNode
  className?: string
  layers: {
    content: React.ReactNode
    speed: number
    direction?: 'up' | 'down' | 'left' | 'right'
    className?: string
  }[]
}

export const ParallaxLayers: React.FC<ParallaxLayerProps> = ({
  children,
  className,
  layers
}) => {
  return (
    <div className={cn('relative', className)}>
      {/* 背景层 */}
      {layers.map((layer, index) => (
        <ParallaxScroll
          key={index}
          speed={layer.speed}
          direction={layer.direction}
          className={cn('absolute inset-0', layer.className)}
        >
          {layer.content}
        </ParallaxScroll>
      ))}
      
      {/* 主要内容 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// 视差图片组件
interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
  speed?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  overlay?: boolean
  overlayClassName?: string
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt,
  className,
  speed = 0.5,
  direction = 'up',
  overlay = false,
  overlayClassName
}) => {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <ParallaxScroll speed={speed} direction={direction} className="w-full h-full">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover scale-110"
        />
      </ParallaxScroll>
      
      {overlay && (
        <div className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/50 to-transparent',
          overlayClassName
        )} />
      )}
    </div>
  )
}

// 视差文本组件
interface ParallaxTextProps {
  children: React.ReactNode
  className?: string
  speed?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  blur?: boolean
}

export const ParallaxText: React.FC<ParallaxTextProps> = ({
  children,
  className,
  speed = 0.3,
  direction = 'up',
  blur = false
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const blurValue = blur ? useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [10, 0, 0, 10]) : 0

  return (
    <div ref={ref} className={className}>
      <ParallaxScroll
        speed={speed}
        direction={direction}
      >
      <motion.div
        style={{
          opacity,
          filter: blur ? `blur(${blurValue}px)` : 'none'
        }}
      >
          {children}
        </motion.div>
      </ParallaxScroll>
    </div>
  )
}