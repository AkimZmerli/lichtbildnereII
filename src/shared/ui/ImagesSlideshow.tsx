'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface ImageData {
  url: string
  alt: string
  id: string
}

interface ImageSlideshowProps {
  images: ImageData[]
  isOpen: boolean
  onClose: () => void
  initialIndex: number
}

export default function ImageSlideshow({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
}: ImageSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // Update current index when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, currentIndex, onClose])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  if (!isOpen || images.length === 0) return null

  const currentImage = images[currentIndex]
  const imageUrl = currentImage.url.startsWith('/')
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}${currentImage.url}`
    : currentImage.url

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <div className="relative w-full h-full flex flex-col max-w-7xl mx-auto p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 z-10">
              <div className="text-white">
                <span className="text-sm text-neutral-300">
                  {currentIndex + 1} of {images.length}
                </span>
              </div>

              <button
                onClick={onClose}
                className="text-white hover:text-neutral-300 transition-colors p-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Main Image Container */}
            <div className="flex-1 flex items-center justify-center relative">
              {/* Previous Button */}
              {images.length > 1 && (
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  disabled={images.length <= 1}
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
              )}

              {/* Image */}
              <motion.div
                key={currentIndex}
                className="relative max-w-full max-h-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <Image
                  src={imageUrl}
                  alt={currentImage.alt}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
                  priority
                />
              </motion.div>

              {/* Preload adjacent images for smooth navigation */}
              <div className="absolute -top-full left-0 w-full h-full pointer-events-none opacity-0 overflow-hidden">
                {/* Preload previous image */}
                {currentIndex > 0 && (
                  <Image
                    src={
                      images[currentIndex - 1].url.startsWith('/')
                        ? `${process.env.NEXT_PUBLIC_SERVER_URL}${images[currentIndex - 1].url}`
                        : images[currentIndex - 1].url
                    }
                    alt={images[currentIndex - 1].alt}
                    width={1200}
                    height={800}
                    className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
                    priority={false}
                  />
                )}
                {/* Preload next image */}
                {currentIndex < images.length - 1 && (
                  <Image
                    src={
                      images[currentIndex + 1].url.startsWith('/')
                        ? `${process.env.NEXT_PUBLIC_SERVER_URL}${images[currentIndex + 1].url}`
                        : images[currentIndex + 1].url
                    }
                    alt={images[currentIndex + 1].alt}
                    width={1200}
                    height={800}
                    className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
                    priority={false}
                  />
                )}
              </div>

              {/* Next Button */}
              {images.length > 1 && (
                <button
                  onClick={goToNext}
                  className="absolute right-4 z-10 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  disabled={images.length <= 1}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="mt-4 flex justify-center">
                <div className="flex gap-2 max-w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent">
                  {images.map((image, index) => {
                    const thumbUrl = image.url.startsWith('/')
                      ? `${process.env.NEXT_PUBLIC_SERVER_URL}${image.url}`
                      : image.url

                    return (
                      <button
                        key={image.id}
                        onClick={() => goToSlide(index)}
                        className={`flex-shrink-0 relative overflow-hidden rounded transition-all duration-200 ${
                          index === currentIndex
                            ? 'ring-2 ring-white opacity-100'
                            : 'opacity-60 hover:opacity-80'
                        }`}
                      >
                        <Image
                          src={thumbUrl}
                          alt={image.alt}
                          width={60}
                          height={40}
                          className="object-cover w-15 h-10"
                        />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Image Info */}
            {currentImage.alt && (
              <div className="mt-2 text-center">
                <p className="text-white text-sm">{currentImage.alt}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
