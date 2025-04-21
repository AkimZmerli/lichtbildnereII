import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import useSwipe from '../../hooks/useSwipe'
import GalleryImage from './GalleryImage'
import GalleryNavigation from './GalleryNavigation'
import MasonryGallery from './MasonryGallery'
import { GalleryProps } from '../../types/gallery'

const MobileGallery = ({ images, title }: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showMasonryView, setShowMasonryView] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = () => {
    if (currentIndex === images.length - 1) {
      setIsLoading(true)
      setTimeout(() => {
        setShowMasonryView(true)
        setIsLoading(false)
      }, 1000)
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe({
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrev,
  })

  if (showMasonryView) {
    return <MasonryGallery images={images} title={title} />
  }

  return (
    <div
      className="min-h-screen bg-black relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <h1 className="text-white text-4xl tracking-widest p-8">{title}</h1>

      <AnimatePresence mode="wait">
        <GalleryImage
          key={currentIndex}
          image={images[currentIndex]}
          priority={currentIndex === 0}
        />
      </AnimatePresence>

      <GalleryNavigation
        currentIndex={currentIndex}
        totalImages={images.length}
        onNext={handleNext}
        onPrev={handlePrev}
      />

      {isLoading && <div className="fixed bottom-0 left-0 w-full h-20 bg-gray-900 animate-pulse" />}
    </div>
  )
}

export default MobileGallery
