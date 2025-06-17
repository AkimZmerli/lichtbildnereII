import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { GalleryProps } from './types/gallery'
import GalleryImage from './GalleryImage'
import Header from '../layout/Header'

const DesktopGallery = ({ images, title }: GalleryProps) => {
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

        {/* Title section - with top margin to avoid header overlap */}
        <div className="flex-shrink-0 pt-8 pb-3 pl-[140px] pr-7">
          <div className="flex justify-between items-start">
            <h1 className="text-white-rose text-2xl tracking-[0.5em] uppercase">{title}</h1>
            <Link
              href={`/gallery/${title.toLowerCase() === 'human' ? 'non-human' : 'human'}`}
              className="text-hot-pink hover:underline"
            >
              View {title.toLowerCase() === 'human' ? 'non-human' : 'human'} gallery →
            </Link>
          </div>
        </div>

        {/* Gallery - FIXED 80% height, no flex grow */}
        <div
          ref={scrollContainerRef}
          className="h-[80vh] overflow-hidden cursor-grab active:cursor-grabbing"
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
                key={`${image.id || index}-${index}`}
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

        {/* Progress bar - absolute bottom edge */}
        <div className="fixed bottom-0 left-0 right-0 z-10">
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
      </div>
    </>
  )
}

export default DesktopGallery
