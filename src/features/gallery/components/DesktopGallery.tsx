import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { GalleryProps } from '@/types/gallery'
import { useGalleryTracking } from '@/features/gallery/hooks/useGalleryTracking'
import GalleryImage from './GalleryImage'
import Header from '@/shared/layout/Header'
import LoadingSpinner from '@/shared/ui/LoadingSpinner'
import { createSmoothLink } from '@/shared/utils/smoothNavigation'

// Utility functions for responsive text formatting
const formatName = (name: string) => {
  if (name === 'Industrie und Landschaft - Karl-Marx-Stadt') {
    return (
      <>
        <div>
          Industrie und Landschaft <br />
          Karl-Marx-Stadt
        </div>
      </>
    )
  }
  return name
}

const formatMaterial = (material: string) => {
  if (material === 'silver gelatin print on baryta paper') {
    return (
      <>
        <div>
          silver gelatin print <br className="md:inline xl:hidden" />
          on baryta paper
        </div>
      </>
    )
  }
  if (material === 'silver gelatin print on panchromatic film') {
    return (
      <>
        <div>
          silver gelatin print <br className="md:inline xl:hidden" />
          on panchromatic film
        </div>
      </>
    )
  }
  if (material === 'silver gelatin print on orwo document paper') {
    return (
      <>
        <div>
          silver gelatin print <br />
          on orwo document paper
        </div>
      </>
    )
  }
  return material
}

const formatExhibition = (exhibition: string) => {
  // Special case for "Momentum x Betrieb.kollektiv • Momentum • 2025" - break at dot before Momentum on all screens
  if (exhibition === 'Momentum x Betrieb.kollektiv • Momentum • 2025') {
    return (
      <div className="mb-4">
        <span>
          Momentum x Betrieb.kollektiv{' • '}
          <br />
          Momentum • 2025
        </span>
      </div>
    )
  }
  
  // Special case for "Best of II - Visitors Choice • Museum Gunzenhauser • 2025" - break at dash before Visitors Choice on all screens
  if (exhibition === 'Best of II - Visitors Choice • Museum Gunzenhauser • 2025') {
    return (
      <div className="mb-4">
        <span>
          Best of II - Visitors Choice{' • '}
          <br />
          Museum Gunzenhauser • 2025
        </span>
      </div>
    )
  }
  
  // For md/lg screens, break at dots: "name • gallery • year" becomes "name •\n gallery •\n year"
  const parts = exhibition.split(' • ')
  if (parts.length > 1) {
    return (
      <div className="mb-4">
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <>
                {' • '}
                <br className="md:inline xl:hidden" />
              </>
            )}
          </span>
        ))}
      </div>
    )
  }
  return exhibition
}

const DesktopGallery = ({ images, title, galleryType }: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [uiVisible, setUiVisible] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  // Dynamic alternate links - lightweight using only viewedGalleries  
  const [staticAlternateLink, setStaticAlternateLink] = useState(
    galleryType === 'exhibition' 
      ? '/about-exhibition#exhibition'
      : galleryType === 'human' 
        ? '/gallery/non-human' 
        : '/gallery/human'
  )

  // Only track and update for human/non-human galleries
  const shouldTrackProgress = galleryType === 'human' || galleryType === 'non-human'
  const { hasViewedBothMainGalleries } = useGalleryTracking(galleryType)

  useEffect(() => {
    if (shouldTrackProgress && hasViewedBothMainGalleries()) {
      setStaticAlternateLink('/socialbook')
    }
  }, [shouldTrackProgress, hasViewedBothMainGalleries])
  const [isClient, setIsClient] = useState(false)
  const [showWelcomeHint, setShowWelcomeHint] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Welcome hint - show only once per session
  useEffect(() => {
    // Check if hint has already been shown this session
    const hintShown = sessionStorage.getItem('galleryHintShown')

    if (!hintShown) {
      setShowWelcomeHint(true)

      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowWelcomeHint(false)
        sessionStorage.setItem('galleryHintShown', 'true')
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])


  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartX = useRef(0)
  const touchStartTime = useRef(0)
  const lastWheelTime = useRef(0)

  // Centralized navigation function - SINGLE SOURCE OF TRUTH
  const navigateToIndex = useCallback(
    (newIndex: number, force = false) => {
      // Boundary checks
      const clampedIndex = Math.max(0, Math.min(newIndex, images.length - 1))

      // Prevent unnecessary updates or transitions
      if (clampedIndex === currentIndex && !force) return
      if (isTransitioning && !force) return

      setIsTransitioning(true)
      setCurrentIndex(clampedIndex)

      // CRITICAL: Match CSS transition timing exactly
      setTimeout(() => {
        setIsTransitioning(false)
      }, 2000) // EXACTLY match the CSS transition duration
    },
    [currentIndex, images.length, isTransitioning],
  )

  // UI visibility management
  const showUI = useCallback(() => {
    setUiVisible(true)
    // Hide welcome hint on first interaction and mark as shown
    if (showWelcomeHint) {
      setShowWelcomeHint(false)
      sessionStorage.setItem('galleryHintShown', 'true')
    }
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
    scrollTimerRef.current = setTimeout(() => setUiVisible(false), 2500)
  }, [showWelcomeHint])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      // More aggressive debouncing during transitions
      const now = Date.now()
      if (now - lastWheelTime.current < 150) return // Increased debounce
      if (isTransitioning) return // Block ALL events during transition

      lastWheelTime.current = now

      // Determine direction and navigate
      const direction = e.deltaY > 0 ? 1 : -1
      const newIndex = currentIndex + direction

      navigateToIndex(newIndex)
      showUI()
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (isTransitioning) return

      touchStartX.current = e.touches[0].clientX
      touchStartTime.current = Date.now()
      showUI()
    }

    const handleTouchMove = (e: TouchEvent) => {
      // Prevent scrolling during transition
      if (isTransitioning) {
        e.preventDefault()
        return
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning) return

      const touchEndX = e.changedTouches[0].clientX
      const touchEndTime = Date.now()
      const deltaX = touchStartX.current - touchEndX
      const deltaTime = touchEndTime - touchStartTime.current

      // Calculate swipe velocity and distance
      const minSwipeDistance = 50
      const maxSwipeTime = 300

      // Determine if it's a valid swipe
      if (Math.abs(deltaX) > minSwipeDistance && deltaTime < maxSwipeTime) {
        const direction = deltaX > 0 ? 1 : -1 // Right swipe = previous, Left swipe = next
        navigateToIndex(currentIndex + direction)
      }
    }

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return

      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          navigateToIndex(currentIndex - 1)
          showUI()
          break
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault()
          navigateToIndex(currentIndex + 1)
          showUI()
          break
      }
    }

    // Add event listeners to window to prevent page scroll
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    // Handle ESC key to return to main site
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.history.back()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentIndex, images.length, isTransitioning, navigateToIndex, showUI])

  // Loading state
  if (!images.length) {
    return (
      <div className="h-screen flex flex-col bg-grainy overflow-hidden">
        <Header />
        <main className="flex-1 flex flex-col justify-center items-center">
          <h1 className="text-white-rose text-4xl tracking-[0.5em] uppercase mb-8">{title}</h1>
          <LoadingSpinner size="lg" showText={true} />
        </main>
      </div>
    )
  }

  return (
    <>
      {/* Global CSS reset to eliminate body margins */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
            height: 100% !important;
            overflow: hidden !important;
          }
          #__next {
            height: 100% !important;
          }
        `,
        }}
      />

      <div className="h-screen flex flex-col bg-grainy overflow-hidden m-0 p-0">
        {/* Header - takes natural height */}
        <Header />

        {/* Title section - with proper top padding to account for fixed header */}
        <div className="flex-shrink-0 pt-22 pb-2 pl-8 pr-7">
          <h1 className="text-white-rose/60 text-lg tracking-[0.5em] uppercase">{title}</h1>
        </div>

        {/* Gallery - adjusted height to account for header and title */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing pb-4"
        >
          <div
            className="h-full flex transition-transform duration-[2000ms] ease-in-out will-change-transform"
            style={{
              transform: `translateX(-${(currentIndex * 100) / images.length}%)`,
              width: `${images.length * 100}%`,
            }}
          >
            {images.map((image, index) => (
              <div
                key={`${image.url}-${index}`}
                className="h-full flex-shrink-0 flex items-center justify-center"
                style={{ width: `${100 / images.length}%` }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <GalleryImage
                    image={image}
                    priority={
                      index === currentIndex ||
                      index === currentIndex + 1 ||
                      index === currentIndex - 1
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar - positioned at the very bottom */}
        <div className="flex-shrink-0">
          <div
            className={`h-1 bg-gray-800 transition-opacity duration-1000 ${
              uiVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="h-full bg-hot-pink transition-all duration-2000 ease-in-out"
              style={{
                width:
                  images.length > 1 ? `${(currentIndex / (images.length - 1)) * 100}%` : '100%',
              }}
            />
          </div>
        </div>

        {/* Metadata panel - bottom left */}
        {images[currentIndex] && (
          <div
            className={`fixed bottom-8 left-4 text-white-rose/70 text-xs space-y-1 transition-all duration-1000 ${
              uiVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {images[currentIndex].name && (
              <div className="text-white-rose">{formatName(images[currentIndex].name)}</div>
            )}
            {images[currentIndex].physicalWidth && images[currentIndex].physicalHeight && (
              <div>
                {images[currentIndex].physicalWidth} × {images[currentIndex].physicalHeight} cm
              </div>
            )}
            {images[currentIndex].material && (
              <div className="mb-2">{formatMaterial(images[currentIndex].material)}</div>
            )}
            {images[currentIndex].exhibition && (
              <div>{formatExhibition(images[currentIndex].exhibition)}</div>
            )}
            <div className="text-white-rose/50">
              <Link href="/impressum" className="text-hot-pink/70 hover:text-hot-pink underline">
                Impressum
              </Link>
            </div>
          </div>
        )}

        {/* Scroll down animation hint - bottom center */}
        <AnimatePresence>
          {showWelcomeHint && (
            <motion.div
              className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-60"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              aria-hidden="true"
            >
              <motion.span
                className="text-sm mb-2 font-light tracking-wider text-black"
                animate={{
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeInOut',
                }}
              >
                SCROLL DOWN
              </motion.span>
              <div className="w-px h-16 bg-black/30 relative overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 w-full h-full bg-black"
                  animate={{
                    y: ['-100%', '100%'],
                    opacity: [0.3, 1, 0.3],
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
        </AnimatePresence>

        {/* Sliding gallery link - bottom right (appears on last photo with 6s delay) */}
        <AnimatePresence>
          {currentIndex === images.length - 1 && (
            <motion.div
              className="fixed bottom-8 right-4"
              initial={{ x: 300, opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
              }}
              exit={{ x: 300, opacity: 0 }}
              transition={{
                delay: 2,
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <Link
                href={staticAlternateLink}
                onClick={createSmoothLink(staticAlternateLink)}
                className="relative inline-block text-hot-pink hover:underline underline-offset-4 transition-all duration-200 hover:translate-y-[-2px] text-base font-medium bg-grainy/80 backdrop-blur-sm px-4 py-2 rounded-md border border-hot-pink/30 overflow-hidden group"
              >
                {/* Gentle glow effect */}
                <div className="absolute inset-0 rounded-md bg-hot-pink/10 animate-[glow_3s_ease-in-out_infinite]" />
                
                {/* Running ray on border only */}
                <div className="absolute inset-0 rounded-md">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-hot-pink/80 to-transparent animate-[rayTop_3.6s_ease-in-out_infinite]" />
                  <div className="absolute right-0 top-0 w-[2px] h-full bg-gradient-to-b from-transparent via-hot-pink/80 to-transparent animate-[rayRight_3.6s_ease-in-out_infinite_0.9s]" />
                  <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-transparent via-hot-pink/80 to-transparent animate-[rayBottom_3.6s_ease-in-out_infinite_1.8s]" />
                  <div className="absolute left-0 bottom-0 w-[2px] h-full bg-gradient-to-t from-transparent via-hot-pink/80 to-transparent animate-[rayLeft_3.6s_ease-in-out_infinite_2.7s]" />
                </div>
                
                {/* Content */}
                <span className="relative z-10">
                  {staticAlternateLink.includes('socialbook')
                    ? 'social book ↗'
                    : staticAlternateLink.includes('#exhibition')
                      ? 'Go Back ↗'
                      : staticAlternateLink.includes('non-human')
                        ? 'view non-human ↗'
                        : 'view human ↗'}
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Custom animations */}
      <style jsx>{`
        @keyframes glow {
          0%, 100% { 
            opacity: 0.45; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.75; 
            transform: scale(1.02); 
          }
        }
        
        
        @keyframes rayTop {
          0% { transform: translateX(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes rayRight {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        
        @keyframes rayBottom {
          0% { transform: translateX(100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }
        
        @keyframes rayLeft {
          0% { transform: translateY(100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
      `}</style>
    </>
  )
}

export default DesktopGallery
