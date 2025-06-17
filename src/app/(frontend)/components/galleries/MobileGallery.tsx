'use client'
import { useState, useCallback } from 'react'
import GalleryImage from './GalleryImage'
import MasonryGallery from './MasonryGallery'
import Header from '../layout/Header'
import Footer from '../layout/Footer'
import { GalleryProps } from './types/gallery'

const MobileGallery = ({ images, title, alternateGalleryLink }: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showMasonryView, setShowMasonryView] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0, time: 0 })

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
        alternateGalleryLink={alternateGalleryLink}
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
      <div className="pt-8 pb-6">
        <h1 className="text-white-rose text-2xl font-bold tracking-[0.5em] uppercase text-center">
          {title}
        </h1>
      </div>

      {/* Photo Area - Large and simple */}
      <div className="px-6 pb-4" style={{ height: '60vh' }}>
        <div
          className="w-full h-full relative  rounded-sm overflow-hidden"
          onTouchStart={(e) => {
            const touch = e.touches[0]
            setTouchStart({ x: touch.clientX, y: touch.clientY, time: Date.now() })
          }}
          onTouchEnd={(e) => {
            const touch = e.changedTouches[0]
            const deltaX = touchStart.x - touch.clientX
            const deltaTime = Date.now() - touchStart.time

            if (Math.abs(deltaX) > 80 && deltaTime < 300) {
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
        <span className="text-white-rose text-lg font-light">
          {currentIndex + 1} / {images.length}
        </span>

        <div className="flex gap-4">
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0 || isTransitioning}
            className={`p-3 rounded-full transition-all duration-200 ${
              currentIndex === 0
                ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                : 'bg-neutral-700 text-white-rose hover:bg-neutral-600 active:scale-95'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            className="p-3 rounded-full bg-neutral-700 text-white-rose hover:bg-neutral-600 active:scale-95 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default MobileGallery
