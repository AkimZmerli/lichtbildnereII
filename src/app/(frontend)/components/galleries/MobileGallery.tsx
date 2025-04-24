import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import useSwipe from '../../hooks/useSwipe'
import GalleryImage from './GalleryImage'
import GalleryNavigation from './GalleryNavigation'
import MasonryGallery from './MasonryGallery'
import { GalleryProps } from '../../types/gallery'
import { div } from 'framer-motion/client'

const MobileGallery = ({ images, title }: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showMasonryView, setShowMasonryView] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

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

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe({
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrev,
  })

  if (showMasonryView) {
    return <MasonryGallery images={images} title={title} />
  }

  if (images.length === 0) {
    return (
      <div className="min-h-screen bg-grainy flex items-center justify-center">
        <div className="w-20 h-20 bg-gray-900 animate-puls rounded-full"></div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-grainy relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <h1 className="text-white-rose text-4xl tracking-widest p-8">{title}</h1>

      <AnimatePresence mode="wait">
        <GalleryImage
          key={currentIndex}
          image={images[currentIndex]}
          priority={currentIndex === 0}
          onLoad={() => setIsLoading(false)}
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
