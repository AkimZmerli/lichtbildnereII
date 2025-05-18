import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { GalleryProps } from './types/gallery'
import GalleryImage from './GalleryImage'
import Header from '../layout/Header'

const DesktopGallery = ({ images, title }: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [uiVisible, setUiVisible] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartX = useRef(0)
  const touchStartScrollLeft = useRef(0)
  const isScrollingRef = useRef(false)
  const lastWheelTime = useRef(Date.now())

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      // Debounce wheel events
      const now = Date.now()
      if (now - lastWheelTime.current < 50) return // Ignore events that are too close together
      lastWheelTime.current = now

      if (isScrollingRef.current) return // Prevent multiple scrolls while animating

      // Calculate next index based on scroll direction
      const nextIndex =
        e.deltaY > 0 ? Math.min(currentIndex + 1, images.length - 1) : Math.max(currentIndex - 1, 0)

      if (nextIndex !== currentIndex) {
        isScrollingRef.current = true
        setCurrentIndex(nextIndex)
        scrollToImage(nextIndex)

        // Reset scrolling lock after animation completes
        setTimeout(() => {
          isScrollingRef.current = false
        }, 2000) // Increased to match slower transition
      }

      // Show UI
      setUiVisible(true)

      // Hide UI after delay
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
      scrollTimerRef.current = setTimeout(() => setUiVisible(false), 2500)
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (isScrollingRef.current) return
      touchStartX.current = e.touches[0].clientX
      touchStartScrollLeft.current = scrollContainer.scrollLeft
      setUiVisible(true)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (isScrollingRef.current) return
      const touchX = e.touches[0].clientX
      const diffX = touchStartX.current - touchX
      scrollContainer.scrollLeft = touchStartScrollLeft.current + diffX
    }

    const handleTouchEnd = () => {
      if (isScrollingRef.current) return
      const containerWidth = scrollContainer.clientWidth
      const scrollLeft = scrollContainer.scrollLeft
      const nextIndex = Math.round(scrollLeft / containerWidth)

      isScrollingRef.current = true
      setCurrentIndex(nextIndex)
      scrollToImage(nextIndex)

      setTimeout(() => {
        isScrollingRef.current = false
      }, 2000)

      setTimeout(() => setUiVisible(false), 2500)
    }

    const scrollToImage = (index: number) => {
      const containerWidth = scrollContainer.clientWidth
      scrollContainer.scrollTo({
        left: index * containerWidth,
        behavior: 'smooth',
      })
    }

    // Add event listeners
    scrollContainer.addEventListener('wheel', handleWheel, { passive: false })
    scrollContainer.addEventListener('touchstart', handleTouchStart)
    scrollContainer.addEventListener('touchmove', handleTouchMove)
    scrollContainer.addEventListener('touchend', handleTouchEnd)

    return () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
      scrollContainer.removeEventListener('wheel', handleWheel)
      scrollContainer.removeEventListener('touchstart', handleTouchStart)
      scrollContainer.removeEventListener('touchmove', handleTouchMove)
      scrollContainer.removeEventListener('touchend', handleTouchEnd)
    }
  }, [currentIndex, images.length])

  if (!images.length) {
    return (
      <div className="h-screen flex flex-col bg-grainy">
        <Header />
        <main className="flex-1 flex flex-col">
          <div className="py-6 pl-[146px]">
            <div className="flex justify-between items-start">
              <h1 className="text-white-rose text-4xl tracking-[0.5em] uppercase">{title}</h1>
              <Link
                href={`/gallery/${title.toLowerCase() === 'human' ? 'non-human' : 'human'}`}
                className="text-hot-pink hover:underline"
              >
                View {title.toLowerCase() === 'human' ? 'non-human' : 'human'} gallery →
              </Link>
            </div>
            <p className="text-white-rose/70 mt-4">Loading gallery...</p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-hot-pink rounded-full border-t-transparent animate-spin" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-grainy">
      <Header />

      <main className="flex-1 flex flex-col h-[calc(100vh-64px)]">
        {' '}
        {/* Subtract header height */}
        <div className="py-5 pl-[140px]">
          <div className="flex justify-between items-start">
            <h1 className="text-white-rose text-2xl tracking-[0.5em] uppercase">{title}</h1>
            <Link
              href={`/gallery/${title.toLowerCase() === 'human' ? 'non-human' : 'human'}`}
              className="text-hot-pink hover:underline px-7"
            >
              View {title.toLowerCase() === 'human' ? 'non-human' : 'human'} gallery →
            </Link>
          </div>
        </div>
        <div ref={scrollContainerRef} className="flex-1 overflow-hidden ">
          <div
            className="h-full flex transition-all duration-[2000ms] ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="h-full w-full flex-shrink-0 flex items-center justify-center px-12"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <GalleryImage
                    image={image}
                    priority={index === currentIndex || index === currentIndex + 1}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Progress bar - positioned closer to images with full width */}
        <div className="w-full px-0 mt-2">
          <div
            className={`h-1 bg-gray-800 transition-opacity duration-1000 ${
              uiVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="h-full bg-hot-pink transition-all duration-2000"
              style={{ width: `${(currentIndex / (images.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default DesktopGallery
