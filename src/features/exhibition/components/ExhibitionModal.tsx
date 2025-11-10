'use client'
import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface ExhibitionModalProps {
  isOpen: boolean
  onClose: () => void
  images: { url: string; alt: string; id: string }[]
  initialIndex?: number
  exhibitionTitle?: string
}

export default function ExhibitionModal({ 
  isOpen, 
  onClose, 
  images, 
  initialIndex = 0,
  exhibitionTitle 
}: ExhibitionModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // Reset to initial index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
    }
  }, [isOpen, initialIndex])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, goToNext, goToPrevious])

  if (images.length === 0) return null

  const currentImage = images[currentIndex]

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
            className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <div className="relative w-full h-full flex flex-col max-w-7xl mx-auto p-4">
            {/* Close Button */}
            <div className="flex justify-end mt-20 mb-4 z-10">
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

            {/* Image Container */}
            <div className="flex-1 flex items-center justify-center relative">
              <motion.div
                key={currentIndex}
                className="relative max-w-full max-h-full"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <Image
                  src={
                    currentImage.url.startsWith('/')
                      ? `${process.env.NEXT_PUBLIC_SERVER_URL}${currentImage.url}`
                      : currentImage.url
                  }
                  alt={currentImage.alt}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-[80vh] w-auto h-auto object-contain"
                  priority
                />
              </motion.div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors z-10"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Image Info */}
            <div className="mt-4 text-center">
              <p className="text-white text-sm">
                {exhibitionTitle && `${exhibitionTitle} - `}
                {currentIndex + 1} / {images.length}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}