'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Keyboard, A11y } from 'swiper/modules'
import Link from 'next/link'
import Header from '@/shared/layout/Header'
import Footer from '@/shared/layout/Footer'
import LoadingSpinner from '@/shared/ui/LoadingSpinner'
import MasonryGallery from './MasonryGallery'
import { GalleryProps } from '@/types/gallery'
import { useGalleryTracking } from '@/features/gallery/hooks/useGalleryTracking'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/lazy'

const SwiperGallery = ({ images, title, galleryType }: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showMasonryView, setShowMasonryView] = useState(false)
  const [showMetadata, setShowMetadata] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const swiperRef = useRef<any>(null)
  
  // Static alternate links - same as exhibition gallery
  const staticAlternateLink = 
    galleryType === 'exhibition' 
      ? '/about-exhibition#exhibition'
      : galleryType === 'human' 
        ? '/gallery/non-human' 
        : '/gallery/human'

  // Track gallery viewing for analytics (no dynamic navigation changes)
  useGalleryTracking(galleryType)

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

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

  // Handle slide change
  const handleSlideChange = (swiper: { activeIndex: number }) => {
    setCurrentIndex(swiper.activeIndex)
  }

  // Handle reaching end of slides
  const handleReachEnd = () => {
    // Go to masonry view when reaching the last slide
    setShowMasonryView(true)
  }

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
        alternateGalleryLink={staticAlternateLink}
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
      <div className="pt-24 pl-8 pr-4 pb-6">
        <h1 className="text-white-rose text-lg tracking-[0.3em] uppercase text-center">{title}</h1>
      </div>

      {/* Swiper Gallery */}
      <div className="flex-1 px-4">
        <div className="h-full max-h-[45vh]">
          <Swiper
            modules={[Navigation, Pagination, Keyboard, A11y]}
            spaceBetween={48}
            slidesPerView={1}
            navigation={false}
            pagination={false}
            keyboard={{
              enabled: true,
              onlyInViewport: true,
            }}
            onSlideChange={handleSlideChange}
            onReachEnd={handleReachEnd}
            onSwiper={(swiper) => { swiperRef.current = swiper }}
            className="w-full h-full"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index}>
                <div 
                  className="w-full h-full relative rounded-sm overflow-hidden cursor-pointer"
                  onClick={() => setShowMetadata(!showMetadata)}
                >
                  <img
                    src={image.url}
                    alt={image.alt || ''}
                    className="swiper-lazy w-full h-full object-contain"
                  />
                  <div className="swiper-lazy-preloader">
                    <div className="flex items-center justify-center h-full">
                      <LoadingSpinner size="sm" showText={false} />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 pt-12 pb-4 flex justify-between items-center">
        <span className="text-white-rose/50 text-base font-light">
          {currentIndex + 1} / {images.length}
        </span>

        <div className="flex gap-4">
          <button
            onClick={() => {
              if (swiperRef.current && currentIndex > 0) {
                swiperRef.current.slidePrev()
              }
            }}
            disabled={currentIndex === 0}
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
            onClick={() => {
              if (swiperRef.current) {
                if (currentIndex === images.length - 1) {
                  setShowMasonryView(true)
                } else {
                  swiperRef.current.slideNext()
                }
              }
            }}
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
                  <span className="text-white-rose/70">Media:</span>
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

export default SwiperGallery