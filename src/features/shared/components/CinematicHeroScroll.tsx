'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Image from 'next/image'

interface CinematicHeroScrollProps {
  imageUrl: string
  altText: string
  title?: string
  subtitle?: string
  showScrollIndicator?: boolean
  className?: string
}

export default function CinematicHeroScroll({
  imageUrl,
  altText,
  title,
  subtitle,
  showScrollIndicator = true,
  className = '',
}: CinematicHeroScrollProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  // Scroll progress tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Smooth the scroll progress for better performance
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Transform values based on scroll - REVERSED DIRECTION
  // Container height: starts at 40vh, expands to 100vh
  const containerHeight = useTransform(
    smoothProgress,
    [0, 0.6],
    ['40vh', '100vh']
  )

  // Image scale: starts at 0.6, scales up to 1
  const imageScale = useTransform(
    smoothProgress,
    [0, 0.5],
    [0.6, 1]
  )

  // Image Y position for subtle parallax
  const imageY = useTransform(
    smoothProgress,
    [0, 1],
    [0, -100]
  )

  // Content opacity and position (fades in as you scroll)
  const contentOpacity = useTransform(
    smoothProgress,
    [0.3, 0.5, 0.7],
    [0, 0.5, 1]
  )

  const contentY = useTransform(
    smoothProgress,
    [0.3, 0.7],
    [50, 0]
  )

  // Scroll indicator opacity (fades out quickly)
  const scrollIndicatorOpacity = useTransform(
    smoothProgress,
    [0, 0.1],
    [1, 0]
  )

  // Loading sequence
  useEffect(() => {
    if (imageLoaded) {
      const timer = setTimeout(() => {
        setIsReady(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [imageLoaded])

  return (
    <>
      {/* Scroll container - defines the scroll area */}
      <div 
        ref={containerRef}
        className={`relative w-full ${className}`}
        style={{ height: '150vh' }} // Reduced from 300vh to minimize space
      >
        {/* Fixed hero container */}
        <div 
          ref={heroRef}
          className="sticky top-0 w-full overflow-hidden bg-grainy"
          style={{ zIndex: 1 }}
        >
          <motion.div
            className="relative w-full flex items-center justify-center"
            style={{ height: containerHeight }}
          >
            {/* Background layer */}
            <div className="absolute inset-0 bg-grainy" />
            
            {/* Image container with transformations */}
            <motion.div
              className="relative w-full h-full max-w-[1400px] mx-auto"
              style={{
                scale: imageScale,
                y: imageY,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isReady ? 1 : 0 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <Image
                src={imageUrl}
                alt={altText}
                fill
                priority
                className="object-contain"
                sizes="100vw"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  console.error('Hero image failed to load')
                  setImageLoaded(true)
                }}
              />
            </motion.div>

            {/* Title and subtitle overlay */}
            {(title || subtitle) && isReady && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
                style={{
                  opacity: contentOpacity,
                  y: contentY,
                }}
              >
                {title && (
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white-rose mb-4 tracking-tight">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-lg md:text-xl lg:text-2xl text-white-rose/80 max-w-2xl">
                    {subtitle}
                  </p>
                )}
              </motion.div>
            )}

            {/* Vignette effect */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.4) 100%)',
              }}
            />

            {/* Loading state */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-2 border-white-rose border-t-transparent rounded-full animate-spin" />
                <div className="text-white-rose/60 text-sm tracking-wider">Loading...</div>
              </div>
            )}

            {/* Scroll indicator */}
            {showScrollIndicator && isReady && (
              <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white-rose/70"
                style={{ opacity: scrollIndicatorOpacity }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs tracking-widest uppercase">Scroll</span>
                  <motion.div
                    className="w-px h-8 bg-white-rose/50"
                    animate={{ scaleY: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Content immediately follows - no extra space */}
    </>
  )
}