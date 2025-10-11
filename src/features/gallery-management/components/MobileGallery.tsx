'use client'
import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import GalleryImage from './GalleryImage'
import MasonryGallery from './MasonryGallery'
import Header from '@/features/shared/components/Header'
import Footer from '@/features/shared/components/Footer'
import { GalleryProps } from './types/gallery'

const MobileGallery = ({ images, title, alternateGalleryLink, galleryType }: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showMasonryView, setShowMasonryView] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0, time: 0 })
  const [showMetadata, setShowMetadata] = useState(false)
  const [dynamicAlternateLink, setDynamicAlternateLink] = useState(alternateGalleryLink)
  const [isClient, setIsClient] = useState(false)
  
  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Handle dynamic alternate link for human gallery only after client mount
  useEffect(() => {
    if (isClient && galleryType === 'human') {
      const viewedGalleries = JSON.parse(sessionStorage.getItem('viewedGalleries') || '[]')
      // Simple logic: if non-human was viewed before, go to inverted; otherwise go to non-human
      if (viewedGalleries.includes('non-human')) {
        setDynamicAlternateLink('/gallery/inverted')
      } else {
        setDynamicAlternateLink('/gallery/non-human')
      }
    }
  }, [isClient, galleryType])

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

    if (currentIndex === images.length - 1) {
      setShowMasonryView(true)
      return
    }

    setIsTransitioning(true)
    setCurrentIndex((prev) => prev + 1)
    setTimeout(() => setIsTransitioning(false), 300)
  }, [currentIndex, images.length, isTransitioning])

  const goToPrevious = useCallback(() => {
    if (isTransitioning || currentIndex === 0) return

    setIsTransitioning(true)
    setCurrentIndex((prev) => prev - 1)
    setTimeout(() => setIsTransitioning(false), 300)
  }, [currentIndex, isTransitioning])

  // Show masonry view
  if (showMasonryView) {
    return (
      <MasonryGallery
        images={images}
        title={title}
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
      <div className="pt-28 pl-8 pr-4 pb-0">
        <h1 className="text-white-rose text-lg tracking-[0.3em] uppercase text-center">
          {title}
        </h1>
      </div>

      {/* Photo Area - Large and simple */}
      <div className="px-4 -mt-6" style={{ height: '75vh' }}>
        <div
          className="w-full h-full relative  rounded-sm overflow-hidden cursor-pointer"
          onClick={() => setShowMetadata(!showMetadata)}
          onTouchStart={(e) => {
            const touch = e.touches[0]
            setTouchStart({ x: touch.clientX, y: touch.clientY, time: Date.now() })
          }}
          onTouchEnd={(e) => {
            const touch = e.changedTouches[0]
            const deltaX = touchStart.x - touch.clientX
            const deltaY = touchStart.y - touch.clientY
            const deltaTime = Date.now() - touchStart.time

            // Check for tap (short touch with minimal movement)
            if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 200) {
              setShowMetadata(!showMetadata)
            }
            // Check for horizontal swipe for navigation
            else if (Math.abs(deltaX) > 80 && deltaTime < 300 && Math.abs(deltaY) < 50) {
              if (deltaX > 0) {
                goToNext()
              } else {
                goToPrevious()
              }
            }
          }}
        >
          {images[currentIndex] && <GalleryImage image={images[currentIndex]} priority={true} />}
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-4 flex justify-between items-center">
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
                : 'bg-neutral-700/60 text-white-rose/70 hover:bg-neutral-600 hover:text-white-rose active:scale-95'
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
            className="p-2 rounded-full bg-neutral-700/60 text-white-rose/70 hover:bg-neutral-600 hover:text-white-rose active:scale-95 transition-all duration-200"
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
