'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
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
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0, time: 0 })
  const [showMetadata, setShowMetadata] = useState(false)
  // Dynamic alternate links - lightweight using only viewedGalleries  
  const [staticAlternateLink, setStaticAlternateLink] = useState(
    galleryType === 'exhibition' 
      ? '/about-exhibition#exhibition'
      : galleryType === 'human' 
        ? '/gallery/non-human' 
        : '/gallery/human'
  )

  // Only track and update for human/non-human galleries
  const shouldTrackProgress = galleryType === 'human' || galleryType === 'non-human'
  const { hasViewedBothMainGalleries } = useGalleryTracking(galleryType)

  useEffect(() => {
    if (shouldTrackProgress && hasViewedBothMainGalleries()) {
      setStaticAlternateLink('/socialbook')
    }
  }, [shouldTrackProgress, hasViewedBothMainGalleries])
  const [isClient, setIsClient] = useState(false)
  const [clickedButton, setClickedButton] = useState<'prev' | 'next' | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [velocity, setVelocity] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [lastDirection, setLastDirection] = useState<'prev' | 'next' | null>(null)
  const [hasCommittedToSwipe, setHasCommittedToSwipe] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  const lastTouchTime = useRef(0)
  const lastTouchX = useRef(0)
  const swipeCommitTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Momentum scrolling animation
  const animateToPosition = useCallback(
    (targetOffset: number, duration = 400, targetIndex?: number, resetAfter = false) => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      const startOffset = dragOffset
      const startTime = Date.now()
      const startIndex = currentIndex

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Smooth easing curve (cubic-bezier equivalent to ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const currentOffset = startOffset + (targetOffset - startOffset) * easeOut

        // If we're transitioning to a new index, update it at the very end to avoid flickering
        if (targetIndex !== undefined && progress >= 1 && currentIndex === startIndex) {
          setCurrentIndex(targetIndex)
        }

        setDragOffset(currentOffset)

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else if (resetAfter) {
          // Reset drag offset after animation completes
          setDragOffset(0)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    },
    [dragOffset, currentIndex],
  )

  // Commit to swipe when threshold is met
  const commitToSwipe = useCallback((direction: 'next' | 'prev') => {
    if (hasCommittedToSwipe || isTransitioning) return
    
    setHasCommittedToSwipe(true)
    setIsTransitioning(true)
    setLastDirection(direction)
    
    if (direction === 'next') {
      if (currentIndex < images.length - 1) {
        const targetIndex = currentIndex + 1
        const imageWidth = window.innerWidth - 32
        const finalOffset = -(imageWidth + 48)
        animateToPosition(finalOffset, 400, targetIndex, true)
        
        setTimeout(() => {
          setIsTransitioning(false)
          setHasCommittedToSwipe(false)
        }, 400)
      } else {
        // Last image - go to masonry
        setShowMasonryView(true)
        setHasCommittedToSwipe(false)
      }
    } else {
      if (currentIndex > 0) {
        const targetIndex = currentIndex - 1
        const imageWidth = window.innerWidth - 32
        const finalOffset = imageWidth + 48
        animateToPosition(finalOffset, 400, targetIndex, true)
        
        setTimeout(() => {
          setIsTransitioning(false)
          setHasCommittedToSwipe(false)
        }, 400)
      } else {
        setHasCommittedToSwipe(false)
      }
    }
  }, [hasCommittedToSwipe, isTransitioning, currentIndex, images.length, animateToPosition])
  

  // Progressive image loading with direction awareness
  useEffect(() => {
    const imagesToLoad: number[] = [];
    const imagesToUnload: number[] = [];
    
    // Direction-aware preloading range
    const baseRange = 3; // Base range for nearby images  
    const forwardBias = lastDirection === 'next' ? 4 : 2; // Extra images forward
    const backwardBias = lastDirection === 'prev' ? 4 : 2; // Extra images backward
    
    const startIndex = Math.max(0, currentIndex - backwardBias);
    const endIndex = Math.min(images.length - 1, currentIndex + baseRange + forwardBias);
    
    // Find images to load
    for (let i = startIndex; i <= endIndex; i++) {
      if (!loadedImages.has(i)) {
        imagesToLoad.push(i);
      }
    }
    
    // Find images to unload (far from current position to manage memory)
    const unloadDistance = 3; // Unload images more than 3 positions away (reduced from 8)
    loadedImages.forEach(index => {
      if (Math.abs(index - currentIndex) > unloadDistance) {
        imagesToUnload.push(index);
      }
    });
    
    // Load new images with staggered timing
    const timeouts: NodeJS.Timeout[] = [];
    imagesToLoad.forEach((index, priority) => {
      const timeout = setTimeout(() => {
        setLoadedImages(prev => new Set(prev).add(index));
      }, priority * 100); // Stagger loading to prevent overload
      timeouts.push(timeout);
    });
    
    // Cleanup function to clear timeouts
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
    
    // Unload distant images
    if (imagesToUnload.length > 0) {
      setLoadedImages(prev => {
        const newSet = new Set(prev);
        imagesToUnload.forEach(index => newSet.delete(index));
        return newSet;
      });
    }
  }, [currentIndex, images.length, lastDirection, loadedImages]);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (swipeCommitTimeoutRef.current) {
        clearTimeout(swipeCommitTimeoutRef.current)
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

  // Navigation functions
  const goToNext = useCallback(
    (showClickEffect = true) => {
      if (isTransitioning) return

      // Track navigation direction
      setLastDirection('next')

      // Show clicked effect only when explicitly requested (button clicks)
      if (showClickEffect) {
        setClickedButton('next')
        setTimeout(() => setClickedButton(null), 400)
      }

      // If we're at the last image, go to masonry view
      if (currentIndex === images.length - 1) {
        setShowMasonryView(true)
        return
      }

      setIsTransitioning(true)
      setVelocity(0)

      // Calculate the target position for next image (accounting for spacing)
      const targetIndex = currentIndex + 1
      
      // Animate directly from current position to target position
      animateToPosition(0, 350, targetIndex)

      setTimeout(() => {
        setIsTransitioning(false)
      }, 350)
    },
    [currentIndex, images.length, isTransitioning, animateToPosition],
  )

  const goToPrevious = useCallback(
    (showClickEffect = true) => {
      if (isTransitioning || currentIndex === 0) return

      // Track navigation direction
      setLastDirection('prev')

      // Show clicked effect only when explicitly requested (button clicks)
      if (showClickEffect) {
        setClickedButton('prev')
        setTimeout(() => setClickedButton(null), 300)
      }

      setIsTransitioning(true)
      setVelocity(0)

      // Calculate the target position for previous image (accounting for spacing)
      const targetIndex = currentIndex - 1
      
      // Animate directly from current position to target position
      animateToPosition(0, 350, targetIndex)

      setTimeout(() => {
        setIsTransitioning(false)
      }, 350)
    },
    [currentIndex, isTransitioning, animateToPosition],
  )

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

      {/* Photo Area - Large and simple */}
      <div className="px-4" style={{ height: '45vh' }}>
        <div
          className="w-full h-full relative rounded-sm overflow-hidden cursor-pointer"
          style={{ maxHeight: '70vh' }}
          onClick={() => setShowMetadata(!showMetadata)}
          onTouchStart={(e) => {
            // Cancel any ongoing animations
            if (animationRef.current) {
              cancelAnimationFrame(animationRef.current)
            }
            
            // Clear any pending commit timeout
            if (swipeCommitTimeoutRef.current) {
              clearTimeout(swipeCommitTimeoutRef.current)
              swipeCommitTimeoutRef.current = null
            }

            const touch = e.touches[0]
            const startTime = Date.now()
            setTouchStart({ x: touch.clientX, y: touch.clientY, time: startTime })
            setIsDragging(true)
            setVelocity(0)
            setHasCommittedToSwipe(false)

            // Initialize velocity tracking
            lastTouchTime.current = startTime
            lastTouchX.current = touch.clientX
          }}
          onTouchMove={(e) => {
            if (!isDragging || hasCommittedToSwipe) return

            const touch = e.touches[0]
            const currentTime = Date.now()
            const deltaX = touchStart.x - touch.clientX
            const deltaY = touchStart.y - touch.clientY

            // Calculate velocity for momentum
            const timeDiff = currentTime - lastTouchTime.current
            if (timeDiff > 0) {
              const positionDiff = touch.clientX - lastTouchX.current
              setVelocity(positionDiff / timeDiff)
            }

            lastTouchTime.current = currentTime
            lastTouchX.current = touch.clientX

            // Only handle horizontal swipes
            if (Math.abs(deltaY) < Math.abs(deltaX)) {
              e.preventDefault()

              // Calculate drag offset relative to image width + gap
              let offset = -deltaX
              const imageWidth = window.innerWidth - 32 // Account for padding
              const maxSwipe = imageWidth * 0.9
              
              // Check for momentum commit threshold
              const commitThreshold = imageWidth * 0.35 // 35% of screen width
              const velocityThreshold = 0.4
              
              if (!hasCommittedToSwipe && Math.abs(deltaX) > commitThreshold && Math.abs(velocity) > velocityThreshold) {
                // Commit to swipe direction
                if (deltaX > 0 && (currentIndex < images.length - 1 || currentIndex === images.length - 1)) {
                  commitToSwipe('next')
                  return
                } else if (deltaX < 0 && currentIndex > 0) {
                  commitToSwipe('prev')
                  return
                }
              }

              // Add resistance at the edges with smoother falloff
              if (currentIndex === 0 && offset > 0) {
                // Resistance when trying to swipe right on first image
                const resistanceStrength = Math.abs(offset) / (imageWidth * 0.5)
                const resistance = Math.pow(resistanceStrength, 1.5) * 0.8
                offset = offset * Math.max(0.1, 1 - resistance)
              }
              // Note: Removed resistance for last image left swipe to allow masonry navigation

              // Limit maximum swipe distance
              offset = Math.max(-maxSwipe, Math.min(maxSwipe, offset))

              setDragOffset(offset)
            }
          }}
          onTouchEnd={(e) => {
            const touch = e.changedTouches[0]
            const deltaX = touchStart.x - touch.clientX
            const deltaY = touchStart.y - touch.clientY
            const deltaTime = Date.now() - touchStart.time

            setIsDragging(false)
            
            // If already committed to swipe, don't process touch end
            if (hasCommittedToSwipe) {
              return
            }

            // Check for tap (short touch with minimal movement)
            if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10 && deltaTime < 200) {
              setShowMetadata(!showMetadata)
              animateToPosition(0, 200)
              return
            }

            // Velocity-based navigation with momentum
            const swipeThreshold = 50
            const velocityThreshold = 0.3
            const distanceThreshold = (window.innerWidth - 32) * 0.25 // Account for padding

            const shouldNavigate =
              (Math.abs(deltaX) > swipeThreshold && Math.abs(velocity) > velocityThreshold) ||
              Math.abs(deltaX) > distanceThreshold

            if (shouldNavigate) {
              if (deltaX > 0 && currentIndex < images.length - 1) {
                // Swipe left to next image - calculate slide-through animation
                setLastDirection('next')
                setIsTransitioning(true)
                const targetIndex = currentIndex + 1
                
                // Calculate final position: slide completely out of view
                const imageWidth = window.innerWidth - 32 // Account for padding
                const finalOffset = -(imageWidth + 48)
                
                // Animate to final position while changing index mid-way
                animateToPosition(finalOffset, 300, targetIndex, true)
                
                setTimeout(() => {
                  setIsTransitioning(false)
                }, 300)
                
              } else if (deltaX > 0 && currentIndex === images.length - 1) {
                // Swipe right on last image - go to masonry
                setShowMasonryView(true)
                
              } else if (deltaX < 0 && currentIndex > 0) {
                // Swipe right to previous image - calculate slide-through animation  
                setLastDirection('prev')
                setIsTransitioning(true)
                const targetIndex = currentIndex - 1
                
                // Calculate final position: slide completely out of view
                const imageWidth = window.innerWidth - 32 // Account for padding
                const finalOffset = imageWidth + 48
                
                // Animate to final position while changing index mid-way
                animateToPosition(finalOffset, 300, targetIndex, true)
                
                setTimeout(() => {
                  setIsTransitioning(false)
                }, 300)
                
              } else {
                // Snap back with momentum if can't navigate
                const bounceDistance = Math.abs(dragOffset) * 0.3
                animateToPosition(deltaX > 0 ? bounceDistance : -bounceDistance, 150)
                setTimeout(() => animateToPosition(0, 200), 150)
              }
            } else {
              // Snap back with easing for insufficient swipe
              animateToPosition(0, 250)
            }
          }}
        >
          {/* Container for all images with smooth drag transform */}
          <div
            ref={containerRef}
            className="h-full flex"
            style={{
              width: `calc(${images.length} * (100vw - 32px) + ${(images.length - 1) * 48}px)`,
              transform: `translateX(calc(-${currentIndex} * (100vw - 32px) - ${currentIndex * 48}px + ${dragOffset}px))`,
              willChange: 'transform',
              gap: '48px',
            }}
          >
            {images.map((image, index) => (
              <div 
                key={index}
                className="h-full flex-shrink-0"
                style={{ width: 'calc(100vw - 32px)' }} // Account for px-4 padding (16px * 2)
              >
                {loadedImages.has(index) ? (
                  <GalleryImage 
                    image={image} 
                    priority={Math.abs(index - currentIndex) <= 1} // Priority for current and adjacent images
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-800/50 flex items-center justify-center">
                    <div className="text-white/30 text-sm">Loading...</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 pt-12 pb-4 flex justify-between items-center">
        <span className="text-white-rose/50 text-base font-light">
          {currentIndex + 1} / {images.length}
        </span>

        <div className="flex gap-4">
          <button
            onClick={() => goToPrevious()}
            disabled={currentIndex === 0 || isTransitioning}
            className={`p-2 rounded-full transition-all duration-200 ${
              currentIndex === 0
                ? 'bg-neutral-800/50 text-neutral-600 cursor-not-allowed'
                : `bg-neutral-700/60 text-white-rose/70 hover:bg-neutral-600 hover:text-white-rose active:scale-95 ${
                    clickedButton === 'prev' ? 'ring-4 ring-hot-pink' : ''
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
            onClick={() => goToNext()}
            disabled={isTransitioning}
            className={`p-2 rounded-full bg-neutral-700/60 text-white-rose/70 hover:bg-neutral-600 hover:text-white-rose active:scale-95 transition-all duration-200 ${
              clickedButton === 'next' ? 'ring-4 ring-hot-pink' : ''
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

export default MobileGallery
