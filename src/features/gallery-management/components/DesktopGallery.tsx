import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { GalleryProps } from './types/gallery'
import GalleryImage from './GalleryImage'
import Header from '@/features/shared/components/Header'
import LoadingSpinner from '@/features/shared/components/LoadingSpinner'
import { createSmoothLink } from '@/features/shared/utils/smoothNavigation'

const DesktopGallery = ({ images, title, alternateGalleryLink, galleryType }: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [uiVisible, setUiVisible] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [dynamicAlternateLink, setDynamicAlternateLink] = useState(alternateGalleryLink)
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
      
      // Auto-hide after 2 seconds
      const timer = setTimeout(() => {
        setShowWelcomeHint(false)
        sessionStorage.setItem('galleryHintShown', 'true')
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [])

  // Handle dynamic alternate link after client mount
  useEffect(() => {
    if (isClient) {
      const updateAlternateLink = () => {
        const completedGalleries = JSON.parse(sessionStorage.getItem('completedGalleries') || '[]')

        if (galleryType === 'human') {
          // Only show inverted if BOTH human and non-human have been completed
          if (completedGalleries.includes('human') && completedGalleries.includes('non-human')) {
            setDynamicAlternateLink('/gallery/inverted')
          } else {
            setDynamicAlternateLink('/gallery/non-human')
          }
        } else if (galleryType === 'non-human') {
          // Only show inverted if BOTH human and non-human have been completed
          if (completedGalleries.includes('human') && completedGalleries.includes('non-human')) {
            setDynamicAlternateLink('/gallery/inverted')
          } else {
            setDynamicAlternateLink('/gallery/human')
          }
        }
      }

      updateAlternateLink()

      // Listen for storage changes
      const handleStorageChange = () => updateAlternateLink()
      window.addEventListener('storage', handleStorageChange)

      return () => window.removeEventListener('storage', handleStorageChange)
    }
  }, [isClient, galleryType])

  // Mark gallery as completed when user reaches the last image
  useEffect(() => {
    if (isClient && currentIndex === images.length - 1 && galleryType) {
      const completedGalleries = JSON.parse(sessionStorage.getItem('completedGalleries') || '[]')
      if (!completedGalleries.includes(galleryType)) {
        completedGalleries.push(galleryType)
        sessionStorage.setItem('completedGalleries', JSON.stringify(completedGalleries))

        // Trigger storage event manually for same-window updates
        window.dispatchEvent(new Event('storage'))
      }
    }
  }, [isClient, currentIndex, images.length, galleryType])
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
      <style dangerouslySetInnerHTML={{
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
        `
      }} />

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
              <div className="text-white-rose">{images[currentIndex].name}</div>
            )}
            {images[currentIndex].physicalWidth && images[currentIndex].physicalHeight && (
              <div>
                {images[currentIndex].physicalWidth} × {images[currentIndex].physicalHeight} cm
              </div>
            )}
            {images[currentIndex].material && (
              <div>
                {images[currentIndex].material === 'silver gelatin print on baryta paper' ? (
                  <>
                    <div>silver gelatin print</div>
                    <div>on baryta paper</div>
                  </>
                ) : (
                  images[currentIndex].material
                )}
              </div>
            )}
            {images[currentIndex].exhibition && (
              <div>{images[currentIndex].exhibition}</div>
            )}
            <div className="text-white-rose/50">
              <Link href="/impressum" className="text-hot-pink/70 hover:text-hot-pink underline">
                Impressum
              </Link>
            </div>
          </div>
        )}

        {/* Welcome navigation hint - bottom 1/13 */}
        <AnimatePresence>
          {showWelcomeHint && (
            <motion.div
              className="fixed bottom-1/13 left-1/2 transform -translate-x-1/2 z-60"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="text-center">
                <p className="text-grainy text-lg font-light tracking-wider">
                  Scroll ↓ to explore
                </p>
                <p className="text-grainy text-sm mt-2">
                  Arrow keys or swipe also work
                </p>
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
                delay: 2.5,
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <Link
                href={dynamicAlternateLink}
                onClick={createSmoothLink(dynamicAlternateLink)}
                className="inline-block text-hot-pink hover:underline underline-offset-4 transition-all duration-200 hover:translate-y-[-2px] text-base font-medium bg-grainy/80 backdrop-blur-sm px-4 py-2 rounded-md border border-hot-pink/30"
              >
                {dynamicAlternateLink.includes('#exhibition')
                  ? 'Go Back ↗'
                  : dynamicAlternateLink.includes('inverted')
                    ? 'inverted ↗'
                    : dynamicAlternateLink.includes('non-human')
                      ? 'view non-human ↗'
                      : dynamicAlternateLink.includes('#social-book')
                        ? 'social book ↗'
                        : dynamicAlternateLink.includes('socialbook')
                          ? 'social book ↗'
                          : 'view human ↗'}
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default DesktopGallery
