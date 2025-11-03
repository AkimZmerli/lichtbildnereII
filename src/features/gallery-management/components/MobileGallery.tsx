'use client'
import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import GalleryImage from './GalleryImage'
import MasonryGallery from './MasonryGallery'
import Header from '@/features/shared/components/Header'
import Footer from '@/features/shared/components/Footer'
import LoadingSpinner from '@/features/shared/components/LoadingSpinner'
import { GalleryProps } from './types/gallery'

const MobileGallery = ({ images, title, alternateGalleryLink, galleryType }: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showMasonryView, setShowMasonryView] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0, time: 0 })
  const [showMetadata, setShowMetadata] = useState(false)
  const [dynamicAlternateLink, setDynamicAlternateLink] = useState(alternateGalleryLink)
  const [isClient, setIsClient] = useState(false)
  const [clickedButton, setClickedButton] = useState<'prev' | 'next' | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true)
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

  // Mark gallery as completed only when user reaches the last image (not masonry view)
  useEffect(() => {
    if (isClient && galleryType && currentIndex === images.length - 1) {
      const completedGalleries = JSON.parse(sessionStorage.getItem('completedGalleries') || '[]')
      if (!completedGalleries.includes(galleryType)) {
        completedGalleries.push(galleryType)
        sessionStorage.setItem('completedGalleries', JSON.stringify(completedGalleries))

        // Trigger storage event manually for same-window updates
        window.dispatchEvent(new Event('storage'))
      }
    }
  }, [isClient, currentIndex, images.length, galleryType, showMasonryView])

  // Keyboard handler for spacebar
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault()
      setShowMetadata((prev) => !prev)
    }
  }, [])

  // Add keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Navigation functions
  const goToNext = useCallback(() => {
    if (isTransitioning) return

    // Show clicked effect
    setClickedButton('next')
    setTimeout(() => setClickedButton(null), 600)

    if (currentIndex === images.length - 1) {
      setShowMasonryView(true)
      return
    }

    setIsTransitioning(true)
    setDragOffset(0)
    setCurrentIndex((prev) => prev + 1)
    setTimeout(() => setIsTransitioning(false), 300)
  }, [currentIndex, images.length, isTransitioning])

  const goToPrevious = useCallback(() => {
    if (isTransitioning || currentIndex === 0) return

    // Show clicked effect
    setClickedButton('prev')
    setTimeout(() => setClickedButton(null), 600)

    setIsTransitioning(true)
    setDragOffset(0)
    setCurrentIndex((prev) => prev - 1)
    setTimeout(() => setIsTransitioning(false), 300)
  }, [currentIndex, isTransitioning])

  // Prevent hydration mismatch by ensuring consistent initial render
  if (!isClient) {
    return (
      <div className="min-h-screen bg-grainy flex flex-col">
        <Header />
        <div className="pt-28 pl-8 pr-4 pb-0">
          <h1 className="text-white-rose text-lg tracking-[0.3em] uppercase text-center">
            {title}
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" showText={true} />
        </div>
      </div>
    )
  }

  // Show masonry view
  if (showMasonryView) {
    return (
      <MasonryGallery
        images={images}
        title={title}
        type={galleryType}
        alternateGalleryLink={dynamicAlternateLink}
        onBack={() => {
          setShowMasonryView(false)
          setCurrentIndex(images.length - 1)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-grainy flex flex-col">
      {/* Header */}
      <Header />

      {/* Title */}
      <div className="pt-24 pl-8 pr-4 pb-0">
        <h1 className="text-white-rose text-lg tracking-[0.3em] uppercase text-center">{title}</h1>
      </div>

      {/* Photo Area - Large and simple */}
      <div className="px-4 mt-2" style={{ height: '68vh' }}>
        <div
          className="w-full h-full relative  rounded-sm overflow-hidden cursor-pointer"
          style={{ maxHeight: '60vh' }}
          onClick={() => setShowMetadata(!showMetadata)}
          onTouchStart={(e) => {
            const touch = e.touches[0]
            setTouchStart({ x: touch.clientX, y: touch.clientY, time: Date.now() })
            setIsDragging(true)
          }}
          onTouchMove={(e) => {
            if (!isDragging) return

            const touch = e.touches[0]
            const deltaX = touchStart.x - touch.clientX
            const deltaY = touchStart.y - touch.clientY

            // Only handle horizontal swipes
            if (Math.abs(deltaY) < Math.abs(deltaX)) {
              e.preventDefault()

              // Add resistance at the edges
              let offset = -deltaX
              const maxSwipe = window.innerWidth * 0.8

              // Add resistance when trying to swipe past boundaries
              if (
                (currentIndex === 0 && offset > 0) ||
                (currentIndex === images.length - 1 && offset < 0)
              ) {
                offset = offset * 0.3 // Reduce movement by 70%
              }

              // Limit maximum swipe distance
              offset = Math.max(-maxSwipe, Math.min(maxSwipe, offset))

              setDragOffset(offset)
            }
          }}
          onTouchEnd={(e) => {
            const touch = e.changedTouches[0]
            const deltaX = touchStart.x - touch.clientX
            const deltaY = touchStart.y - touch.clientY
            const deltaTime = Date.now() - touchStart.time

            setIsDragging(false)

            // Check for tap (short touch with minimal movement)
            if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 200) {
              setShowMetadata(!showMetadata)
              setDragOffset(0)
            }
            // Check for horizontal swipe for navigation
            else if (
              (Math.abs(deltaX) > 60 && deltaTime < 400) ||
              Math.abs(deltaX) > window.innerWidth * 0.3
            ) {
              if (deltaX > 0 && currentIndex < images.length - 1) {
                goToNext()
              } else if (deltaX < 0 && currentIndex > 0) {
                goToPrevious()
              } else {
                // Snap back if can't navigate
                setDragOffset(0)
              }
            } else {
              // Snap back for insufficient swipe
              setDragOffset(0)
            }
          }}
        >
          {/* Container for all images with smooth drag transform */}
          <div
            className="w-full h-full flex"
            style={{
              transform: `translateX(${dragOffset}px)`,
              transition: isDragging
                ? 'none'
                : 'transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            {/* Previous image */}
            {currentIndex > 0 && (
              <div className="w-full h-full flex-shrink-0 absolute left-[-100%]">
                <GalleryImage image={images[currentIndex - 1]} priority={false} />
              </div>
            )}

            {/* Current image */}
            <div className="w-full h-full flex-shrink-0">
              {images[currentIndex] && (
                <GalleryImage image={images[currentIndex]} priority={true} />
              )}
            </div>

            {/* Next image */}
            {currentIndex < images.length - 1 && (
              <div className="w-full h-full flex-shrink-0 absolute left-[100%]">
                <GalleryImage image={images[currentIndex + 1]} priority={false} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6  pb-4  flex justify-between items-center">
        <span className="text-white-rose/50 text-base font-light">
          {currentIndex + 1} / {images.length}
        </span>

        <div className="flex gap-4">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0 || isTransitioning}
            className={`p-2 rounded-full transition-all duration-200 ${
              currentIndex === 0
                ? 'bg-neutral-800/50 text-neutral-600 cursor-not-allowed'
                : `bg-neutral-700/60 text-white-rose/70 hover:bg-neutral-600 hover:text-white-rose active:scale-95 ${
                    clickedButton === 'prev' ? 'ring-4 ring-hot-pink' : ''
                  }`
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={goToNext}
            disabled={isTransitioning}
            className={`p-2 rounded-full bg-neutral-700/60 text-white-rose/70 hover:bg-neutral-600 hover:text-white-rose active:scale-95 transition-all duration-200 ${
              clickedButton === 'next' ? 'ring-4 ring-hot-pink' : ''
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Metadata Drawer */}
      {showMetadata && images[currentIndex] && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowMetadata(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-grainy text-white-rose p-6 rounded-t-2xl transform transition-transform duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close indicator */}
            <div className="w-12 h-1 bg-white-rose/30 rounded-full mx-auto mb-4" />

            {/* Metadata content */}
            <div className="space-y-3">
              {images[currentIndex].name && (
                <div className="text-white-rose font-medium text-lg mb-2">
                  {images[currentIndex].name}
                </div>
              )}

              {images[currentIndex].physicalWidth && images[currentIndex].physicalHeight && (
                <div className="flex justify-between">
                  <span className="text-white-rose/70">Dimensions:</span>
                  <span>
                    {images[currentIndex].physicalWidth} × {images[currentIndex].physicalHeight}{' '}
                    {images[currentIndex].unit}
                  </span>
                </div>
              )}

              {images[currentIndex].material && (
                <div className="flex justify-between">
                  <span className="text-white-rose/70">Material:</span>
                  <span>{images[currentIndex].material}</span>
                </div>
              )}

              {images[currentIndex].exhibition && (
                <div className="flex justify-between">
                  <span className="text-white-rose/70">Exhibition:</span>
                  <span>{images[currentIndex].exhibition}</span>
                </div>
              )}

              <div className="pt-2 mt-4">
                <Link href="/impressum" className="text-hot-pink/70 hover:text-hot-pink text-left">
                  Impressum
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default MobileGallery
