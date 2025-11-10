'use client'
import { useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface ImagePopupProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

export default function ImagePopup({ src, alt, isOpen, onClose }: ImagePopupProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

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
          {/* Backdrop - clicking closes the popup */}
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
            <div
              className="flex-1 flex items-center justify-center relative cursor-pointer"
              onClick={onClose}
            >
              <motion.div
                className="relative max-w-full max-h-full"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <Image
                  src={src}
                  alt={alt}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-[80vh] w-auto h-auto object-contain"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
