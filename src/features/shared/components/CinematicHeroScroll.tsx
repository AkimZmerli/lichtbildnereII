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

  // Reset scroll position on mount to ensure animation starts from beginning
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Scroll progress tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Smooth the scroll progress for better performance
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Debug scroll progress
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (value) => {
      console.log('Scroll progress:', value)
    })
    return unsubscribe
  }, [smoothProgress])

  // Transform values based on scroll - Complete expansion by 50% and hold
  // Container height: starts very compressed, reaches full viewport at 50% scroll
  const containerHeight = useTransform(
    smoothProgress,
    [0, 0.15, 0.3, 0.5, 1],
    ['30vh', '45vh', '75vh', '100vh', '100vh'], // Expands to full viewport height
  )

  // Image stays at full size - no scaling
  // Only add subtle zoom at the very end for cinematic effect
  const imageScale = useTransform(
    smoothProgress,
    [0, 0.45, 0.5, 1],
    [1, 1, 1.02, 1.02], // Image at full size, tiny zoom at end
  )

  // Cinematic letterbox width - completes expansion by 50% scroll
  const containerWidth = useTransform(
    smoothProgress,
    [0, 0.1, 0.25, 0.4, 0.5, 1],
    ['50%', '60%', '75%', '90%', '100%', '100%'], // Even narrower start
  )

  // Content opacity and position (fades in as you scroll)
  const contentOpacity = useTransform(smoothProgress, [0.2, 0.35, 0.5], [0, 0.5, 1])

  const contentY = useTransform(smoothProgress, [0.2, 0.4], [50, 0])

  // Scroll indicator opacity (fades out very quickly)
  const scrollIndicatorOpacity = useTransform(smoothProgress, [0, 0.05], [1, 0])

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
        style={{ height: '230vh' }} // Extended for more viewing time at full expansion
      >
        {/* Fixed hero container */}
        <div
          ref={heroRef}
          className="sticky top-0 w-full overflow-hidden bg-grainy flex items-center justify-center"
          style={{
            zIndex: 1,
            height: '100vh',
          }}
        >
          {/* Image container - fixed position, doesn't move with letterbox */}
          <motion.div
            className="absolute"
            style={{
              scale: imageScale,
              // Fixed viewport dimensions and position
              width: '100vw',
              height: '100vh',
              position: 'absolute',
              left: '0',
              top: '0',
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

          {/* Masking elements - hide image outside letterbox */}
          {/* Top mask */}
          <motion.div
            className="absolute top-0 left-0 right-0 bg-grainy z-10"
            style={{
              height: useTransform(
                smoothProgress,
                [0, 0.15, 0.3, 0.5, 1],
                ['35vh', '27.5vh', '12.5vh', '0vh', '0vh'],
              ),
            }}
          />

          {/* Bottom mask */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-grainy z-10"
            style={{
              height: useTransform(
                smoothProgress,
                [0, 0.15, 0.3, 0.5, 1],
                ['35vh', '27.5vh', '12.5vh', '0vh', '0vh'],
              ),
            }}
          />

          {/* Left mask */}
          <motion.div
            className="absolute top-0 bottom-0 left-0 bg-grainy z-10"
            style={{
              width: useTransform(
                smoothProgress,
                [0, 0.1, 0.25, 0.4, 0.5, 1],
                ['25vw', '20vw', '12.5vw', '5vw', '0vw', '0vw'],
              ),
            }}
          />

          {/* Right mask */}
          <motion.div
            className="absolute top-0 bottom-0 right-0 bg-grainy z-10"
            style={{
              width: useTransform(
                smoothProgress,
                [0, 0.1, 0.25, 0.4, 0.5, 1],
                ['25vw', '20vw', '12.5vw', '5vw', '0vw', '0vw'],
              ),
            }}
          />

          {/* Letterbox container that expands to reveal the image */}
          <motion.div
            className="absolute flex items-center justify-center overflow-hidden rounded-sm"
            style={{
              height: containerHeight,
              width: containerWidth,
              top: useTransform(
                smoothProgress,
                [0, 0.15, 0.3, 0.5, 1],
                ['35vh', '27.5vh', '12.5vh', '0vh', '0vh'], // Moves up to top as it expands
              ),
              left: 0,
              right: 0,
              margin: '0 auto',
              boxShadow: '0 0 60px 20px rgba(0, 0, 0, 0.7), inset 0 0 40px rgba(0, 0, 0, 0.5)',
            }}
          >
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

            {/* Scroll indicator - positioned outside and below the image container */}
          </motion.div>

          {/* Scroll indicator - positioned below the hero image */}
          {showScrollIndicator && isReady && (
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 text-white-rose/70 z-20"
              style={{
                opacity: scrollIndicatorOpacity,
                bottom: '5vh', // Positioned even lower, near bottom of screen
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs tracking-widest uppercase">Scroll Down</span>
                <motion.div
                  className="w-px h-8 bg-white-rose/50"
                  animate={{ scaleY: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Content immediately follows - no extra space */}
    </>
  )
}
