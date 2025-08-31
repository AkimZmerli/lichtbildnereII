'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useSpring, useTransform, motionValue, useReducedMotion } from 'framer-motion'

interface CinematicHeroProps {
  mobileUrl: string
  desktopUrl: string
  altText: string
  // Optional content
  title?: string
  subtitle?: string
  // Optional video
  videoUrl?: string
  // Animation settings
  initialViewportHeight?: string // Initial letterbox height
  initialViewportWidth?: string // Initial letterbox width
  scrollFactor?: number // Controls animation speed
  // Skip animation option
  allowSkip?: boolean // Allow users to skip via localStorage
  storageKey?: string // Key for localStorage to remember animation state
}

const CinematicHero: React.FC<CinematicHeroProps> = ({
  mobileUrl,
  desktopUrl,
  altText,
  title,
  subtitle,
  videoUrl,
  initialViewportHeight = '45vh',
  initialViewportWidth = '80%',
  scrollFactor = 1.0,
  allowSkip = true,
  storageKey = 'hero-animation-played',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollingUnlocked, setScrollingUnlocked] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [skipAnimation, setSkipAnimation] = useState(false)
  // Add internal state to track whether to use allowSkip
  const [internalAllowSkip, setInternalAllowSkip] = useState(allowSkip)
  const scrollProgress = motionValue(0)
  const prefersReducedMotion = useReducedMotion()

  // Check if we should skip animation (returning visitor)
  useEffect(() => {
    if (internalAllowSkip && typeof window !== 'undefined') {
      const hasPlayed = localStorage.getItem(storageKey) === 'true'
      if (hasPlayed) {
        setSkipAnimation(true)
        setAnimationComplete(true)
        setScrollingUnlocked(true)
      }
    }
  }, [internalAllowSkip, storageKey])

  // Spring physics for smooth animation
  const smoothProgress = useSpring(scrollProgress, {
    stiffness: 80, // Reduced for more cinematic feel
    damping: 30,
    restDelta: 0.001,
  })

  // Create transform animations based on scroll progress

  // Initial scale of the image (creates a subtle zoom effect)
  const imageScale = useTransform(smoothProgress, [0, 1], prefersReducedMotion ? [1, 1] : [1, 1.02])

  // Parallax movement for different layers - reduced to prevent cropping when letterbox opens fully
  const parallaxBackground = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, 0], // Disabled to prevent image escaping when letterbox opens fully
  )

  const parallaxForeground = useTransform(
    smoothProgress,
    [0, 1],
    prefersReducedMotion ? [0, 0] : [0, -40 * scrollFactor],
  )

  // Rectangle viewport animations (this is key for the cinematic effect)
  // Start with a letterbox and expand to full screen
  const viewportHeightStart = parseInt(initialViewportHeight) / 100
  const viewportWidthStart = parseInt(initialViewportWidth) / 100

  // Height animation - from letterbox to full screen
  const viewportHeight = useTransform(
    smoothProgress,
    [0, 0.8, 1],
    [`${viewportHeightStart * 100}vh`, '100vh', '100vh'], // End at full height
  )

  // Width animation - slightly expands from initial width
  const viewportWidth = useTransform(
    smoothProgress,
    [0, 0.6, 1],
    [`${viewportWidthStart * 100}%`, '100%', '100%'], // End at full width
  )

  // Content animations
  const contentOpacity = useTransform(smoothProgress, [0.2, 0.5], [0, 1])

  const contentTranslateY = useTransform(smoothProgress, [0.2, 0.6], [20, 0])

  // Scroll indicator - fades out faster
  const indicatorOpacity = useTransform(smoothProgress, [0, 0.2], [1, 0])

  // Handle scroll behavior
  useEffect(() => {
    if (!containerRef.current) return

    // If skipping animation, don't setup any scroll handling
    if (skipAnimation) {
      document.body.style.overflow = 'auto'
      return
    }

    // Ensure we start at the top
    window.scrollTo(0, 0)

    // Lock scrolling initially
    document.body.style.overflow = 'hidden'

    // Create a custom scroll handler to control the animation precisely
    const maxScrollDistance = window.innerHeight * 0.8 // 80% of viewport height
    let animationFrameId: number

    // Event handlers
    const handleWheel = (e: WheelEvent) => {
      if (scrollingUnlocked) return

      e.preventDefault()

      // Update scroll position
      window.scrollBy(0, e.deltaY)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (scrollingUnlocked) return

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        window.scrollBy(0, 50) // Arbitrary scroll amount
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        window.scrollBy(0, -50)
      }
    }

    // Touch event handling
    let touchStartY = 0

    const handleTouchStart = (e: TouchEvent) => {
      if (scrollingUnlocked) return
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (scrollingUnlocked) return

      e.preventDefault()
      const touchY = e.touches[0].clientY
      const delta = touchStartY - touchY

      window.scrollBy(0, delta * 0.5) // Adjust sensitivity for touch
      touchStartY = touchY
    }

    // The key animation loop function
    const updateScrollAnimation = () => {
      // Only animate if we haven't unlocked scrolling yet
      if (!scrollingUnlocked) {
        // Calculate progress (0 to 1)
        const progress = Math.min(window.scrollY / maxScrollDistance, 1)

        // Update our motion value to drive all animations
        scrollProgress.set(progress)

        // When animation is 85% complete
        if (progress >= 0.85 && !animationComplete) {
          // Set completion flag
          setAnimationComplete(true)

          // KEY CHANGE: Enable allowSkip after animation completes
          setInternalAllowSkip(true)

          // Remember this visitor has seen the animation
          if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, 'true')
          }

          // Add a small delay before unlocking scrolling for smoother transition
          setTimeout(() => {
            setScrollingUnlocked(true)
            document.body.style.overflow = 'auto'

            // Dispatch event to notify header that animation is complete
            window.dispatchEvent(new CustomEvent('cinematicHeroComplete'))

            // Clean up all event listeners
            window.removeEventListener('wheel', handleWheel)
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('touchstart', handleTouchStart)
            window.removeEventListener('touchmove', handleTouchMove)
          }, 500) // Half-second delay for smoother transition
        }
      }

      // Continue the animation loop while animation is not complete
      if (!animationComplete) {
        animationFrameId = requestAnimationFrame(updateScrollAnimation)
      }
    }

    // Add event listeners with TypeScript-compatible options
    window.addEventListener('wheel', handleWheel, { passive: false } as AddEventListenerOptions)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    } as AddEventListenerOptions)
    window.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    } as AddEventListenerOptions)

    // Start the animation loop
    animationFrameId = requestAnimationFrame(updateScrollAnimation)

    // Keyboard shortcut to skip animation (for testing/development)
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !scrollingUnlocked) {
        scrollProgress.set(1) // Force animation to 100%
        setAnimationComplete(true)

        // Enable allowSkip when forced to complete
        setInternalAllowSkip(true)

        setTimeout(() => {
          setScrollingUnlocked(true)
          document.body.style.overflow = 'auto'
          window.removeEventListener('wheel', handleWheel)
          window.removeEventListener('keydown', handleKeyDown)
          window.removeEventListener('touchstart', handleTouchStart)
          window.removeEventListener('touchmove', handleTouchMove)
        }, 500)
      }
    }

    window.addEventListener('keydown', handleEscapeKey)

    // Cleanup function
    return () => {
      // Clean up all event listeners
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('keydown', handleEscapeKey)

      // Restore normal scrolling
      document.body.style.overflow = 'auto'

      // Stop animation loop
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [scrollProgress, scrollingUnlocked, animationComplete, skipAnimation, storageKey])

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full z-40"
        data-cinematic-hero
        style={{
          // Set height of container based on animation state
          height: skipAnimation ? '100vh' : '200vh',
        }}
      >
        {/* Sticky container for the animation */}
        <div 
          className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center"
        >
          {/* Skip to completion if skipAnimation is true */}
          {skipAnimation ? (
            // Fully revealed state
            <div className="relative overflow-hidden bg-black w-full h-full">
              <div className="absolute inset-0 w-full h-full">
                <picture className="w-full h-full block">
                  <source media="(min-width: 768px)" srcSet={desktopUrl} />
                  <source media="(max-width: 767px)" srcSet={mobileUrl} />
                  <img src={desktopUrl} alt={altText} className="w-full h-full object-cover" />
                </picture>

                {/* Subtle overlay gradient */}
                <div
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 80%)',
                  }}
                />

                {/* Title and subtitle */}
                {(title || subtitle) && (
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
                    <div className="text-center text-white p-6 max-w-2xl mx-auto">
                      {title && (
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                          {title}
                        </h1>
                      )}
                      {subtitle && <p className="text-xl md:text-2xl opacity-90">{subtitle}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Animated cinematic reveal
            <motion.div
              className="relative overflow-hidden bg-black flex items-center justify-center"
              style={{
                width: viewportWidth,
                height: viewportHeight,
                // Create a cinematic border around the image
                boxShadow: '0 0 100px 50px rgba(0, 0, 0, 0.8)',
              }}
            >
              {/* Background image with parallax */}
              <motion.div
                className="absolute inset-0 w-full h-full"
                style={{
                  y: parallaxBackground,
                  scale: imageScale,
                }}
              >
                {/* Video background (if provided) */}
                {videoUrl && (
                  <div className="absolute inset-0 w-full h-full">
                    <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                      <source src={videoUrl} type="video/mp4" />
                    </video>
                  </div>
                )}

                {/* Image background with responsive picture element */}
                <picture className="w-full h-full block">
                  <source media="(min-width: 768px)" srcSet={desktopUrl} />
                  <source media="(max-width: 767px)" srcSet={mobileUrl} />
                  <img
                    src={desktopUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    aria-hidden="true"
                  />
                </picture>
              </motion.div>

              {/* Subtle overlay gradient for mood (single layer, no double-masking) */}
              <div
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 80%)',
                }}
                aria-hidden="true"
              />

              {/* Content overlay - appears after initial reveal */}
              <motion.div
                className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
                style={{
                  y: parallaxForeground,
                }}
              >
                {/* Title and subtitle */}
                {(title || subtitle) && (
                  <motion.div
                    className="text-center text-white p-6 max-w-2xl mx-auto"
                    style={{
                      opacity: contentOpacity,
                      y: contentTranslateY,
                    }}
                  >
                    {title && (
                      <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                        {title}
                      </h1>
                    )}
                    {subtitle && <p className="text-xl md:text-2xl opacity-90">{subtitle}</p>}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* Screen reader accessible text */}
          <span className="sr-only">{altText}</span>
        </div>
        {!skipAnimation && (
          <motion.div
            className="fixed bottom-0 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center z-50"
            style={{
              opacity: indicatorOpacity,
            }}
            aria-hidden="true"
          >
            <span className="text-sm mb-2 font-light tracking-wider">SCROLL DOWN</span>
            <div className="w-px h-16 bg-white/50 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-full h-full bg-white"
                animate={{
                  y: ['-100%', '100%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* This section contains content below the hero */}
      <div id="content-after-hero" className="relative z-10">
        {/* Your page content goes here */}
      </div>
    </>
  )
}

export default CinematicHero
