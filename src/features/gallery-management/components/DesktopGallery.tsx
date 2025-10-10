import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { GalleryProps } from './types/gallery'
import GalleryImage from './GalleryImage'
import Header from '@/features/shared/components/Header'
import { createSmoothLink } from '@/features/shared/utils/smoothNavigation'

const DesktopGallery = ({ images, title, alternateGalleryLink }: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [uiVisible, setUiVisible] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
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
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
    scrollTimerRef.current = setTimeout(() => setUiVisible(false), 2500)
  }, [])

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
          <h1 className="text-white-rose text-4xl tracking-[0.5em] uppercase mb-4">{title}</h1>
          <p className="text-white-rose/70 mb-8">Loading gallery...</p>
          <div className="w-32 h-32 border-4 border-hot-pink rounded-full border-t-transparent animate-spin" />
        </main>
      </div>
    )
  }

  return (
    <>
      {/* Global CSS reset to eliminate body margins */}
      <style jsx global>{`
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
      `}</style>

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
          className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing pb-2"
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
                    priority={index === currentIndex || index === currentIndex + 1}
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
            {images[currentIndex].material && <div>{images[currentIndex].material}</div>}
            <div className="text-white-rose/50">
              <Link href="/impressum" className="text-hot-pink/70 hover:text-hot-pink underline">
                Impressum
              </Link>
            </div>
          </div>
        )}

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
                href={alternateGalleryLink}
                onClick={createSmoothLink(alternateGalleryLink)}
                className="group inline-flex items-center gap-3 bg-black-almost/60 backdrop-blur-md px-5 py-2.5 rounded-full text-hot-pink hover:text-white-rose hover:bg-hot-pink/20 hover:scale-105 hover:shadow-hot-pink/20 active:scale-95 transition-all duration-300 ease-out border border-hot-pink/40 hover:border-hot-pink shadow-lg shadow-hot-pink/10 focus:outline-none focus:ring-2 focus:ring-hot-pink/50 focus:ring-offset-2 focus:ring-offset-black-almost"
              >
                <span className="font-light tracking-wider uppercase text-sm">
                  {alternateGalleryLink.includes('inverted') ? 'Enter Inverted' : 
                   alternateGalleryLink.includes('non-human') ? 'View Non-Human' : 
                   alternateGalleryLink.includes('#social-book') ? 'Social Book' : 
                   alternateGalleryLink.includes('socialbook') ? 'Social Book' : 'View Human'}
                </span>
                <svg 
                  className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default DesktopGallery
