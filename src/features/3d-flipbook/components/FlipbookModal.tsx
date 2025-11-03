'use client'

import React, { useEffect, useState } from 'react'
import { X, Info } from 'lucide-react'
import { CSSFlipbook } from './CSSFlipbook'
import LoadingSpinner from '@/features/shared/components/LoadingSpinner'

interface FlipbookModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  images?: string[]
}

export const FlipbookModal: React.FC<FlipbookModalProps> = ({
  isOpen,
  onClose,
  images = [
    '/flipbook-images/front.png',
    ...Array.from({ length: 62 }, (_, i) => `/flipbook-images/${i + 1}.png`),
    '/flipbook-images/back.png',
  ],
}) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  // Preload all images when modal opens
  useEffect(() => {
    if (isOpen && !imagesLoaded) {
      let loadedCount = 0
      images.forEach((src, _index) => {
        const img = new Image()
        img.onload = () => {
          loadedCount++
          if (loadedCount === images.length) {
            setImagesLoaded(true)
          }
        }
        img.src = src
      })
    }
  }, [isOpen, images, imagesLoaded])

  // Handle ESC key only - arrow navigation is handled by CSSFlipbook
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
      // Arrow key navigation is handled by CSSFlipbook component
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose, images.length])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-grainy backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-60 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
        >
          <X size={24} />
        </button>

        {/* Info Button */}
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="fixed bottom-6 left-6 z-[70] p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
        >
          {showInfo ? <X size={20} /> : <Info size={20} />}
        </button>

        {/* Title */}
        <div className="absolute top-4 left-4 z-60">
          <h2 className="text-xl font-light text-white/90">Lichtbildnerei | The Social Book</h2>
        </div>

        {/* Loading Message */}
        {!imagesLoaded && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <LoadingSpinner size="lg" showText={true} />
            <div className="text-white-rose/60 text-sm tracking-wider mt-4 text-center">
              Loading Portfolio...
            </div>
          </div>
        )}

        {/* CSS Flipbook Container */}
        {imagesLoaded && (
          <div className="w-full h-[85vh] md:max-w-[90vw] md:h-[85vh] rounded-lg flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              <CSSFlipbook
                images={images}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}

        {/* Info Overlay */}
        {showInfo && (
          <div className="absolute inset-4 z-70 bg-black/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <X size={20} />
            </button>
            <div className="max-w-lg text-left text-white p-6">
              <h3 className="text-xl font-light mb-4 text-hot-pink">Can a book be social?</h3>
              <p className="text-sm leading-relaxed mb-4 text-white/80">
                This question emerged as I contemplated the design of my first book. When you flip
                through it by yourself, it&apos;s essentially not a social experience.
              </p>
              <p className="text-sm leading-relaxed mb-4 text-white/80">
                So I conceived the idea of arranging all the photographs like playing cards: you
                open it up, sit or stand facing each other, and view the same images from the same
                perspective, allowing you to look into each other&apos;s eyes and discuss.
              </p>
              <p className="text-sm leading-relaxed mb-4 text-white/80">
                In that moment, the book isn&apos;t just being viewed – it&apos;s being shared. And that&apos;s
                precisely where it becomes social.
              </p>
              <p className="text-xs text-white/60 mb-4 text-center">
                Navigate using arrow keys, mouse clicks, or touch gestures. Press ESC to close.
              </p>
              <button
                onClick={() => setShowInfo(false)}
                className="px-4 py-2 bg-hot-pink/20 text-hot-pink border border-hot-pink/30 rounded hover:bg-hot-pink/30 transition-all"
              >
                Close Info
              </button>
            </div>
          </div>
        )}

        {/* Navigation Hint - Desktop only */}
        {!showInfo && (
          <div className="hidden md:block absolute bottom-4 right-4 text-white/60 text-xs text-right">
            <div>Use arrow keys or click to navigate</div>
            <div>Press ESC to close</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FlipbookModal
