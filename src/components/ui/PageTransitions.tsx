import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'

// 页面过渡动画变体
const pageVariants: Record<string, Variants> = {
  slideLeft: {
    initial: { x: '100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 }
  },
  slideRight: {
    initial: { x: '-100%', opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: '100%', opacity: 0 }
  },
  slideUp: {
    initial: { y: '100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0 }
  },
  slideDown: {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '100%', opacity: 0 }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  scale: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 }
  },
  rotate: {
    initial: { rotate: -90, opacity: 0 },
    animate: { rotate: 0, opacity: 1 },
    exit: { rotate: 90, opacity: 0 }
  },
  flip: {
    initial: { rotateY: -90, opacity: 0 },
    animate: { rotateY: 0, opacity: 1 },
    exit: { rotateY: 90, opacity: 0 }
  },
  zoom: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 }
  },
  blur: {
    initial: { filter: 'blur(10px)', opacity: 0 },
    animate: { filter: 'blur(0px)', opacity: 1 },
    exit: { filter: 'blur(10px)', opacity: 0 }
  }
}

// 页面过渡包装器
interface PageTransitionProps {
  children: React.ReactNode
  variant?: keyof typeof pageVariants
  duration?: number
  delay?: number
  className?: string
  enableGestures?: boolean
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  variant = 'fade',
  duration = 0.3,
  delay = 0,
  className,
  enableGestures = false
}) => {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState('fadeIn')

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('fadeOut')
    }
  }, [location, displayLocation])

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        if (transitionStage === 'fadeOut') {
          setDisplayLocation(location)
          setTransitionStage('fadeIn')
        }
      }}
    >
      <motion.div
        key={displayLocation.pathname}
        className={cn('w-full h-full', className)}
        variants={pageVariants[variant]}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration,
          delay,
          ease: 'easeInOut'
        }}
        drag={enableGestures ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// 路由过渡包装器
interface RouteTransitionProps {
  children: React.ReactNode
  className?: string
}

export const RouteTransition: React.FC<RouteTransitionProps> = ({
  children,
  className
}) => {
  const location = useLocation()

  // 根据路由路径选择不同的过渡动画
  const getTransitionVariant = (pathname: string): keyof typeof pageVariants => {
    if (pathname === '/') return 'fade'
    if (pathname.includes('/game')) return 'slideLeft'
    if (pathname.includes('/social')) return 'slideUp'
    if (pathname.includes('/profile')) return 'scale'
    return 'fade'
  }

  return (
    <PageTransition
      variant={getTransitionVariant(location.pathname)}
      duration={0.4}
      className={className}
    >
      {children}
    </PageTransition>
  )
}

// 模态框过渡动画
interface ModalTransitionProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  variant?: 'fade' | 'scale' | 'slideUp' | 'slideDown'
  className?: string
  overlayClassName?: string
  closeOnOverlayClick?: boolean
}

export const ModalTransition: React.FC<ModalTransitionProps> = ({
  isOpen,
  onClose,
  children,
  variant = 'scale',
  className,
  overlayClassName,
  closeOnOverlayClick = true
}) => {
  const modalVariants: Record<string, Variants> = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    scale: {
      initial: { scale: 0.8, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0.8, opacity: 0 }
    },
    slideUp: {
      initial: { y: '100%', opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: '100%', opacity: 0 }
    },
    slideDown: {
      initial: { y: '-100%', opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: '-100%', opacity: 0 }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center',
            overlayClassName
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeOnOverlayClick ? onClose : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Modal Content */}
          <motion.div
            className={cn(
              'relative z-10 max-w-lg w-full mx-4',
              className
            )}
            variants={modalVariants[variant]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 0.3,
              ease: 'easeOut'
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// 抽屉过渡动画
interface DrawerTransitionProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  position?: 'left' | 'right' | 'top' | 'bottom'
  className?: string
  overlayClassName?: string
  closeOnOverlayClick?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export const DrawerTransition: React.FC<DrawerTransitionProps> = ({
  isOpen,
  onClose,
  children,
  position = 'right',
  className,
  overlayClassName,
  closeOnOverlayClick = true,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[32rem]',
    xl: 'w-[40rem]',
    full: 'w-full'
  }

  const getDrawerVariants = (): Variants => {
    switch (position) {
      case 'left':
        return {
          initial: { x: '-100%' },
          animate: { x: 0 },
          exit: { x: '-100%' }
        }
      case 'right':
        return {
          initial: { x: '100%' },
          animate: { x: 0 },
          exit: { x: '100%' }
        }
      case 'top':
        return {
          initial: { y: '-100%' },
          animate: { y: 0 },
          exit: { y: '-100%' }
        }
      case 'bottom':
        return {
          initial: { y: '100%' },
          animate: { y: 0 },
          exit: { y: '100%' }
        }
      default:
        return {
          initial: { x: '100%' },
          animate: { x: 0 },
          exit: { x: '100%' }
        }
    }
  }

  const getDrawerPosition = () => {
    switch (position) {
      case 'left':
        return 'left-0 top-0 h-full'
      case 'right':
        return 'right-0 top-0 h-full'
      case 'top':
        return 'top-0 left-0 w-full'
      case 'bottom':
        return 'bottom-0 left-0 w-full'
      default:
        return 'right-0 top-0 h-full'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={cn(
            'fixed inset-0 z-50',
            overlayClassName
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeOnOverlayClick ? onClose : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          {/* Drawer Content */}
          <motion.div
            className={cn(
              'absolute bg-gray-900 shadow-xl',
              getDrawerPosition(),
              position === 'left' || position === 'right' ? sizeClasses[size] : 'h-auto',
              className
            )}
            variants={getDrawerVariants()}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 0.3,
              ease: 'easeOut'
            }}
            drag={position === 'left' || position === 'right' ? 'x' : 'y'}
            dragConstraints={{
              left: position === 'right' ? 0 : undefined,
              right: position === 'left' ? 0 : undefined,
              top: position === 'bottom' ? 0 : undefined,
              bottom: position === 'top' ? 0 : undefined
            }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              const threshold = 100
              const velocity = position === 'left' || position === 'right' ? info.velocity.x : info.velocity.y
              const offset = position === 'left' || position === 'right' ? info.offset.x : info.offset.y
              
              if (Math.abs(velocity) > 500 || Math.abs(offset) > threshold) {
                onClose()
              }
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// 标签页过渡动画
interface TabTransitionProps {
  activeTab: string
  children: React.ReactNode
  className?: string
  variant?: 'slide' | 'fade' | 'scale'
}

export const TabTransition: React.FC<TabTransitionProps> = ({
  activeTab,
  children,
  className,
  variant = 'slide'
}) => {
  const tabVariants: Record<string, Variants> = {
    slide: {
      initial: { x: 20, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -20, opacity: 0 }
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    scale: {
      initial: { scale: 0.95, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 1.05, opacity: 0 }
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        className={className}
        variants={tabVariants[variant]}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration: 0.2,
          ease: 'easeInOut'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// 列表项过渡动画
interface ListTransitionProps {
  children: React.ReactNode
  className?: string
  stagger?: number
  variant?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'scale'
}

export const ListTransition: React.FC<ListTransitionProps> = ({
  children,
  className,
  stagger = 0.1,
  variant = 'fadeUp'
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger
      }
    }
  }

  const itemVariants: Record<string, Variants> = {
    fadeUp: {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    },
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    slideLeft: {
      hidden: { x: -20, opacity: 0 },
      visible: { x: 0, opacity: 1 }
    },
    scale: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { scale: 1, opacity: 1 }
    }
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants[variant]}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

export default {
  PageTransition,
  RouteTransition,
  ModalTransition,
  DrawerTransition,
  TabTransition,
  ListTransition
}