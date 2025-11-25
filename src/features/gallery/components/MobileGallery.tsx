'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { FreeMode, Navigation, Keyboard, A11y } from 'swiper/modules'
import GalleryImage from './GalleryImage'
import MasonryGallery from './MasonryGallery'
import Header from '@/shared/layout/Header'
import Footer from '@/shared/layout/Footer'
import LoadingSpinner from '@/shared/ui/LoadingSpinner'
import { GalleryProps } from '@/types/gallery'
import { useGalleryTracking } from '@/features/gallery/hooks/useGalleryTracking'

const MobileGallery = ({ images, title, galleryType }: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showMasonryView, setShowMasonryView] = useState(false)
  const [isTransitioningToMasonry, setIsTransitioningToMasonry] = useState(false)
  const [showMetadata, setShowMetadata] = useState(false)
  const [showSwipeHint, setShowSwipeHint] = useState(true)
  // Static alternate links - same as exhibition gallery
  const staticAlternateLink =
    galleryType === 'exhibition'
      ? '/about-exhibition#exhibition'
      : galleryType === 'human'
        ? '/gallery/non-human'
        : '/gallery/human'

  // Generic swipe up handler for opening metadata
  const handleSwipeUp = useCallback((e: React.TouchEvent) => {
    const touch = e.changedTouches[0]
    const startY = (e.target as any).touchStartY || 0
    const deltaY = startY - touch.clientY

    if (deltaY > 50) {
      // 50px minimum swipe distance
      setShowMetadata(true)
      setShowSwipeHint(false) // Hide hint when user opens metadata
    }
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    ;(e.target as any).touchStartY = touch.clientY
  }, [])

  const [isClient, setIsClient] = useState(false)
  const [clickedButton, setClickedButton] = useState<'prev' | 'next' | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [lastDirection, setLastDirection] = useState<'prev' | 'next' | null>(null)
  const swiperRef = useRef<any>(null)
  const clickEffectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle slide change from Swiper
  const handleSlideChange = (swiper: any) => {
    setCurrentIndex(swiper.activeIndex)
  }

  // Handle reaching end of slides - go to masonry
  const handleReachEnd = () => {
    setIsTransitioningToMasonry(true)
    setTimeout(() => {
      setShowMasonryView(true)
      setIsTransitioningToMasonry(false)
    }, 300)
  }

  // Progressive image loading with direction awareness
  useEffect(() => {
    const imagesToLoad: number[] = []
    const imagesToUnload: number[] = []

    // Direction-aware preloading range
    const baseRange = 3 // Base range for nearby images
    const forwardBias = lastDirection === 'next' ? 4 : 2 // Extra images forward
    const backwardBias = lastDirection === 'prev' ? 4 : 2 // Extra images backward

    const startIndex = Math.max(0, currentIndex - backwardBias)
    const endIndex = Math.min(images.length - 1, currentIndex + baseRange + forwardBias)

    // Find images to load
    for (let i = startIndex; i <= endIndex; i++) {
      if (!loadedImages.has(i)) {
        imagesToLoad.push(i)
      }
    }

    // Find images to unload (far from current position to manage memory)
    // Increased from 3 to 5 to prevent re-downloading when swiping back and forth
    const unloadDistance = 5
    loadedImages.forEach((index) => {
      if (Math.abs(index - currentIndex) > unloadDistance) {
        imagesToUnload.push(index)
      }
    })

    // Load new images with staggered timing
    const timeouts: NodeJS.Timeout[] = []
    imagesToLoad.forEach((index, priority) => {
      // Calculate distance from current index
      const distance = Math.abs(index - currentIndex)

      // No delay for immediate neighbors (current, next, prev)
      // This ensures instant loading when swiping
      const delay = distance <= 1 ? 0 : priority * 100

      const timeout = setTimeout(() => {
        setLoadedImages((prev) => new Set(prev).add(index))
      }, delay)
      timeouts.push(timeout)
    })

    // Cleanup function to clear timeouts
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }

    // Unload distant images
    if (imagesToUnload.length > 0) {
      setLoadedImages((prev) => {
        const newSet = new Set(prev)
        imagesToUnload.forEach((index) => newSet.delete(index))
        return newSet
      })
    }
  }, [currentIndex, images.length, lastDirection])

  // Cleanup click effect timeout on unmount
  useEffect(() => {
    return () => {
      if (clickEffectTimeoutRef.current) {
        clearTimeout(clickEffectTimeoutRef.current)
      }
    }
  }, [])

  // Ensure client-side rendering and load initial images
  useEffect(() => {
    setIsClient(true)
    // Load first 3 images immediately
    const initialImages = new Set<number>()
    for (let i = 0; i < Math.min(3, images.length); i++) {
      initialImages.add(i)
    }
    setLoadedImages(initialImages)
  }, [images.length])

  // Hide swipe hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false)
    }, 4000)

    return () => clearTimeout(timer)
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

  // Show transition loading spinner
  if (isTransitioningToMasonry) {
    return (
      <div className="min-h-screen bg-grainy flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" showText={true} />
        </div>
        <Footer />
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
      <div className="px-4" style={{ height: '45vh' }}>
        <div className="w-full h-full relative rounded-sm overflow-hidden">
          <Swiper
            modules={[Navigation, Keyboard, A11y]}
            spaceBetween={48}
            slidesPerView={1}
            navigation={false}
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
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleSwipeUp}
                >
                  {loadedImages.has(index) ? (
                    <GalleryImage
                      image={image}
                      priority={Math.abs(index - currentIndex) <= 1}
                      sizes="100vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-800/50 flex items-center justify-center">
                      <div className="text-white/30 text-sm">Loading...</div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Swipe Up Hint Animation - Lean line going upward */}

      {/* Navigation */}
      <div
        className="px-6 pt-12 pb-4 flex justify-between items-center relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleSwipeUp}
      >
        <span className="text-white-rose/50 text-base font-light">
          {currentIndex + 1} / {images.length}
        </span>

        {showSwipeHint && (
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
            <div className="w-px h-16 bg-white-rose/50 relative overflow-hidden">
              <motion.div
                className="absolute bottom-0 left-0 w-full h-full bg-white-rose"
                animate={{
                  y: ['100%', '-100%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.8,
                  ease: 'easeInOut',
                }}
              />
            </div>
            <span className="text-white-rose/60 text-sm mt-2 font-light tracking-wider uppercase">
              Swipe Up for Info
            </span>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => {
              if (swiperRef.current && currentIndex > 0) {
                setClickedButton('prev')
                setLastDirection('prev')
                swiperRef.current.slidePrev()
                if (clickEffectTimeoutRef.current) clearTimeout(clickEffectTimeoutRef.current)
                clickEffectTimeoutRef.current = setTimeout(() => setClickedButton(null), 300)
              }
            }}
            disabled={currentIndex === 0}
            className={`p-2 rounded-full transition-all duration-200 ${
              currentIndex === 0
                ? 'bg-neutral-800/50 text-neutral-600 cursor-not-allowed'
                : `bg-neutral-700/60 text-white-rose/70 hover:bg-neutral-600 hover:text-white-rose active:scale-95 ${
                    clickedButton === 'prev'
                      ? 'ring-4 ring-hot-pink bg-hot-pink/20 text-hot-pink'
                      : ''
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
            onClick={() => {
              if (swiperRef.current) {
                if (currentIndex === images.length - 1) {
                  // Go to masonry view when at last image
                  setIsTransitioningToMasonry(true)
                  setTimeout(() => {
                    setShowMasonryView(true)
                    setIsTransitioningToMasonry(false)
                  }, 300)
                } else {
                  setClickedButton('next')
                  setLastDirection('next')
                  swiperRef.current.slideNext()
                  if (clickEffectTimeoutRef.current) clearTimeout(clickEffectTimeoutRef.current)
                  clickEffectTimeoutRef.current = setTimeout(() => setClickedButton(null), 300)
                }
              }
            }}
            className={`p-2 rounded-full bg-neutral-700/60 text-white-rose/70 hover:bg-neutral-600 hover:text-white-rose active:scale-95 transition-all duration-200 ${
              clickedButton === 'next' ? 'ring-4 ring-hot-pink bg-hot-pink/20 text-hot-pink' : ''
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
          <Swiper
            direction="vertical"
            modules={[FreeMode]}
            freeMode={true}
            spaceBetween={0}
            slidesPerView={1}
            className="h-full"
            initialSlide={1}
            onSlideChange={(swiper) => {
              if (swiper.activeIndex === 0) {
                setShowMetadata(false)
              }
            }}
          >
            {/* Empty slide for swipe down to close */}
            <SwiperSlide className="h-full" />

            {/* Modal content slide */}
            <SwiperSlide className="h-full flex items-end">
              <div
                className="w-full bg-grainy text-white-rose p-6 rounded-t-2xl transform transition-transform duration-300 ease-out"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Swipe indicator */}
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
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      )}

      {/* Footer */}
      <div onTouchStart={handleTouchStart} onTouchEnd={handleSwipeUp}>
        <Footer />
      </div>
    </div>
  )
}

export default MobileGallery
