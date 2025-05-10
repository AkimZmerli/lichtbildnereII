'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'

interface HeroClientProps {
  mobileUrl: string
  desktopUrl: string
  altText: string
  height?: string
  // Optional overlay text content
  title?: string
  subtitle?: string
  // Optional video background
  videoUrl?: string
  // Animation settings
  scrollFactor?: number
  revealDuration?: number
}

const HeroClient: React.FC<HeroClientProps> = ({
  mobileUrl,
  desktopUrl,
  altText,
  height = '100vh',
  title,
  subtitle,
  videoUrl,
  scrollFactor = 1.0,
  revealDuration = 1.0,
}) => {
  // Refs for scroll container and animation targets
  const containerRef = useRef<HTMLDivElement>(null)
  const [isScrollUnlocked, setIsScrollUnlocked] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  // Configure scroll animation range with proper offset
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start', 'end start'],
  })

  // Create smooth animation with spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Create responsive transform values based on scroll progress
  const scale = useTransform(smoothProgress, [0, 1], prefersReducedMotion ? [1, 1] : [1, 1.05])

  const translateY = useTransform(smoothProgress, [0, 1], prefersReducedMotion ? [0, 0] : [0, -20])

  const opacity = useTransform(smoothProgress, [0, 0.7, 1], [1, 0.3, 0])

  const maskSize = useTransform(smoothProgress, [0, 0.8], ['100%', '0%'])

  const parallaxForeground = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -25 * scrollFactor],
  )

  const parallaxBackground = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -50 * scrollFactor],
  )

  const contentOpacity = useTransform(smoothProgress, [0, 0.2, 0.3], [0, 0.8, 1])

  const contentTranslateY = useTransform(
    smoothProgress,
    [0, 0.3],
    prefersReducedMotion ? [0, 0] : [20, 0],
  )

  const indicatorOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0])

  // Handle scroll locking and unlocking
  useEffect(() => {
    if (!containerRef.current) return

    // Ensure we're at the top when component mounts
    window.scrollTo(0, 0)

    // Initial setup - lock scrolling
    document.body.style.overflow = 'hidden'

    // Create a small invisible element to make scrolling possible
    const scrollTrigger = document.createElement('div')
    scrollTrigger.style.height = '1px'
    scrollTrigger.style.width = '1px'
    scrollTrigger.style.position = 'absolute'
    scrollTrigger.style.top = '0'
    scrollTrigger.style.left = '0'
    scrollTrigger.style.zIndex = '-1'
    document.body.appendChild(scrollTrigger)

    // Allow scrolling programmatically
    let lastScrollY = 0
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      // Only process if we haven't unlocked scrolling yet
      if (!isScrollUnlocked) {
        window.scrollBy(0, e.deltaY)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    // Monitor scroll progress to unlock scrolling at the right time
    const unsubscribe = smoothProgress.on('change', (latest) => {
      if (latest >= 0.95 && !isScrollUnlocked) {
        document.body.style.overflow = 'auto'
        setIsScrollUnlocked(true)
        window.removeEventListener('wheel', handleWheel)
      } else if (latest < 0.95 && isScrollUnlocked) {
        document.body.style.overflow = 'hidden'
        setIsScrollUnlocked(false)
        window.addEventListener('wheel', handleWheel, { passive: false })
      }
    })

    // Reset on unmount
    return () => {
      document.body.style.overflow = 'auto'
      document.body.removeChild(scrollTrigger)
      window.removeEventListener('wheel', handleWheel)
      unsubscribe()
    }
  }, [smoothProgress, isScrollUnlocked])

  console.log('Current scroll progress:', scrollYProgress.get())
  console.log('Current smooth progress:', smoothProgress.get())

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: `calc(${height} + 100vh)` }}
    >
      {/* Sticky container for parallax elements */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* Background layer - moves faster */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            y: parallaxBackground,
            scale,
          }}
        >
          {/* Video background (if provided) */}
          {videoUrl && (
            <div className="absolute inset-0 w-full h-full">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            </div>
          )}

          {/* Image background with responsive sources - use img directly */}
          <div className="absolute inset-0 w-full h-full">
            <picture className="w-full h-full">
              <source media="(min-width: 768px)" srcSet={desktopUrl} />
              <source media="(max-width: 767px)" srcSet={mobileUrl} />
              <img src={desktopUrl} alt={altText} className="w-full h-full object-cover" />
            </picture>
          </div>
        </motion.div>

        {/* Mask overlay with gradient */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity,
            background:
              'radial-gradient(circle at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.95) 70%)',
          }}
          aria-hidden="true"
        />

        {/* Vertical reveal mask (slides up) */}
        <motion.div
          className="absolute inset-0 bg-black transition-all ease-out"
          style={{
            height: maskSize,
            opacity: opacity,
          }}
          aria-hidden="true"
        />

        {/* Content layer - moves slower than background */}
        <motion.div
          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
          style={{
            y: parallaxForeground,
          }}
        >
          {/* Optional content overlay */}
          {(title || subtitle) && (
            <motion.div
              className="text-center text-white p-6 max-w-2xl mx-auto"
              style={{
                opacity: contentOpacity,
                y: contentTranslateY,
              }}
            >
              {title && (
                <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">{title}</h1>
              )}
              {subtitle && <p className="text-xl md:text-2xl opacity-90">{subtitle}</p>}
            </motion.div>
          )}
        </motion.div>

        {/* Screen reader text */}
        <span className="sr-only">{altText}</span>

        {/* Custom scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center"
          style={{
            opacity: indicatorOpacity,
          }}
          aria-hidden="true"
        >
          <span className="text-sm mb-2 font-light tracking-wider">SCROLL</span>
          <div className="w-px h-16 bg-white/70 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-white"
              animate={{
                y: ['-100%', '100%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Spacer to create scrollable area - increase height to ensure enough scroll room */}
      <div className="h-screen md:h-[150vh]" aria-hidden="true" />
    </div>
  )
}

export default HeroClient
