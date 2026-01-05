'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  width?: 'fit-content' | '100%'
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  className?: string
}

export default function ScrollReveal({
  children,
  width = '100%',
  delay = 0.2,
  duration = 0.5,
  direction = 'up',
  distance = 50,
  className = ''
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  const variants = {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -distance : direction === 'right' ? distance : 0,
      y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    }
  }

  // Cast motion.div to any to avoid complex type conflicts between React 19 and Framer Motion 12
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MotionDiv = motion.div as any

  return (
    <div 
      ref={ref} 
      className={`relative overflow-visible ${width === 'fit-content' ? 'w-fit' : 'w-full'} ${className}`}
    >
      <MotionDiv
        variants={variants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1.0], // cubic-bezier
        }}
      >
        {children}
      </MotionDiv>
    </div>
  )
}
