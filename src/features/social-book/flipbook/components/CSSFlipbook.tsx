'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './flipbook-blur.css'

// Safari detection utility
const isSafari = () => {
  if (typeof window === 'undefined') return false
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

const getSafariImageTransform = (
  isBackFace: boolean,
  isSafari: boolean,
  flipDirection: string | null,
) => {
  // Standard behavior for all browsers (including Safari in this reverted state)
  return isBackFace ? 'scaleX(-1)' : 'none'
}

interface CSSFlipbookProps {
  images: string[]
  currentPage: number
  onPageChange: (page: number) => void
}

export const CSSFlipbook: React.FC<CSSFlipbookProps> = ({ images, currentPage, onPageChange }) => {
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState<'forward' | 'back' | null>(null)
  const [displaySpread, setDisplaySpread] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [lastDirection, setLastDirection] = useState<'forward' | 'back' | null>(null)
  const [flippingPageImage, setFlippingPageImage] = useState<string | null>(null)
  const [isBackFace, setIsBackFace] = useState(false)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null)
  const [isSafariBrowser, setIsSafariBrowser] = useState(false)

  // Detect Safari on component mount
  useEffect(() => {
    setIsSafariBrowser(isSafari())
  }, [])

  // Create spreads - first page is front cover (single), middle pages are pairs, last is back cover (single)
  const spreads: Array<{
    left: string | null
    right: string | null
    isCover?: boolean
    isBack?: boolean
  }> = []

  // First spread is the front cover - single page
  if (images.length > 0) {
    spreads.push({
      left: null, // No left page for front cover
      right: images[0], // Front cover on right side
      isCover: true,
      isBack: false,
    })
  }

  // Middle pages are paired (1-2, 3-4, 5-6, etc.)
  // Skip first and last images (covers)
  for (let i = 1; i < images.length - 1; i += 2) {
    spreads.push({
      left: images[i] || null,
      right: images[i + 1] || null,
      isCover: false,
      isBack: false,
    })
  }

  // Last spread is the back cover - single page
  if (images.length > 1) {
    spreads.push({
      left: images[images.length - 1], // Back cover on left side
      right: null, // No right page for back cover
      isCover: false,
      isBack: true,
    })
  }

  const currentSpread = Math.floor(currentPage / 2)

  // Helper function to check if an image is loaded
  const isImageLoaded = (imageSrc: string) => {
    const imageIndex = images.indexOf(imageSrc)
    return imageIndex !== -1 && loadedImages.has(imageIndex)
  }

  // Component for image with loading state
  const ImageWithLoader: React.FC<{
    src: string
    alt: string
    className?: string
    style?: React.CSSProperties
  }> = ({ src, alt, className, style }) => {
    const loaded = isImageLoaded(src)

    return (
      <div className="relative w-full h-full">
        {loaded ? (
          <img src={src} alt={alt} className={className} style={style} />
        ) : (
          <div className="w-full h-full bg-neutral-800/50 flex items-center justify-center">
            <div className="text-white/30 text-xs">Loading...</div>
          </div>
        )}
      </div>
    )
  }

  // Sync display spread with current spread when not flipping
  useEffect(() => {
    if (!isFlipping) {
      setDisplaySpread(currentSpread)
    }
  }, [currentSpread, isFlipping])

  // Enhanced preloading with direction awareness and memory management
  useEffect(() => {
    const imagesToLoad: number[] = []
    const imagesToUnload: number[] = []

    // Direction-aware preloading range
    const baseRange = 8 // Base range for nearby images
    const forwardBias = lastDirection === 'forward' ? 6 : 3 // Extra pages forward
    const backwardBias = lastDirection === 'back' ? 6 : 3 // Extra pages backward

    const startIndex = Math.max(0, currentPage - backwardBias)
    const endIndex = Math.min(images.length - 1, currentPage + baseRange + forwardBias)

    // Find images to load
    for (let i = startIndex; i <= endIndex; i++) {
      if (!loadedImages.has(i)) {
        imagesToLoad.push(i)
      }
    }

    // Find images to unload (far from current position to manage memory)
    const unloadDistance = 20 // Unload images more than 20 positions away
    loadedImages.forEach((index) => {
      if (Math.abs(index - currentPage) > unloadDistance) {
        imagesToUnload.push(index)
      }
    })

    // Load new images with priority
    imagesToLoad.forEach((index, priority) => {
      setTimeout(() => {
        const img = new Image()
        img.onload = () => {
          setLoadedImages((prev) => new Set(prev).add(index))
        }
        img.onerror = () => {
          // Even on error, mark as "loaded" to prevent retry loops
          setLoadedImages((prev) => new Set(prev).add(index))
        }
        img.src = images[index]
      }, priority * 50) // Stagger loading to prevent browser overload
    })

    // Unload distant images
    if (imagesToUnload.length > 0) {
      setLoadedImages((prev) => {
        const newSet = new Set(prev)
        imagesToUnload.forEach((index) => newSet.delete(index))
        return newSet
      })
    }
  }, [currentPage, images, loadedImages, lastDirection])

  const goToNextSpread = useCallback(() => {
    if (!isFlipping && currentSpread < spreads.length - 1) {
      setIsFlipping(true)
      setFlipDirection('forward')
      setLastDirection('forward') // Track navigation direction
      setDisplaySpread(currentSpread + 1)
      setIsBackFace(false)

      // Set the flipping page image (already preloaded)
      const frontImage = spreads[currentSpread].right
      const nextSpread = spreads[currentSpread + 1]
      const backImage = nextSpread?.left || nextSpread?.right

      // Ensure both images are loaded before starting animation
      if (
        frontImage &&
        loadedImages.has(images.indexOf(frontImage)) &&
        backImage &&
        loadedImages.has(images.indexOf(backImage))
      ) {
        setFlippingPageImage(frontImage)

        // Safari-optimized image swap timing
        // Use requestAnimationFrame for better sync with Safari's rendering
        const swapDelay = isSafariBrowser ? 420 : 380 // Slightly later for Safari

        setTimeout(() => {
          // Double check we're still in the right state before swapping
          requestAnimationFrame(() => {
            setFlippingPageImage(backImage)
            setIsBackFace(true)
          })
        }, swapDelay)
      }

      // Update page state AFTER the flip animation completes
      setTimeout(() => {
        setIsFlipping(false)
        setFlipDirection(null)
        setFlippingPageImage(null)
        setIsBackFace(false)
        onPageChange((currentSpread + 1) * 2)
      }, 900)
    }
  }, [currentSpread, isFlipping, spreads, onPageChange, loadedImages, images, isSafariBrowser])

  const goToPrevSpread = useCallback(() => {
    if (!isFlipping && currentSpread > 0) {
      setIsFlipping(true)
      setFlipDirection('back')
      setLastDirection('back') // Track navigation direction
      setDisplaySpread(currentSpread - 1)
      setIsBackFace(false)

      // Start with front face image (already preloaded)
      const frontImage = spreads[currentSpread].left
      const prevSpread = spreads[currentSpread - 1]
      const backImage = prevSpread?.right || prevSpread?.left

      // Ensure both images are loaded before starting animation
      if (
        frontImage &&
        loadedImages.has(images.indexOf(frontImage)) &&
        backImage &&
        loadedImages.has(images.indexOf(backImage))
      ) {
        setFlippingPageImage(frontImage)

        // Safari-optimized image swap timing for back flip
        const swapDelay = isSafariBrowser ? 420 : 380 // Slightly later for Safari

        setTimeout(() => {
          // Double check we're still in the right state before swapping
          requestAnimationFrame(() => {
            setFlippingPageImage(backImage)
            setIsBackFace(true)
          })
        }, swapDelay)
      }

      // Update page state AFTER the flip animation completes
      setTimeout(() => {
        setIsFlipping(false)
        setFlipDirection(null)
        setFlippingPageImage(null)
        setIsBackFace(false)
        onPageChange((currentSpread - 1) * 2)
      }, 900)
    }
  }, [currentSpread, isFlipping, spreads, onPageChange, loadedImages, images, isSafariBrowser])

  // Keyboard navigation - instant page change without animation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFlipping) return // Don't allow during animation

      if (e.key === 'ArrowRight') {
        // Instant forward navigation
        if (currentSpread < spreads.length - 1) {
          setDisplaySpread(currentSpread + 1)
          onPageChange((currentSpread + 1) * 2)
        }
      } else if (e.key === 'ArrowLeft') {
        // Instant backward navigation
        if (currentSpread > 0) {
          setDisplaySpread(currentSpread - 1)
          onPageChange((currentSpread - 1) * 2)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSpread, spreads.length, onPageChange, isFlipping])

  // Touch handlers for swipe gestures
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isFlipping) return

      const touch = e.touches[0]
      setTouchStart({
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      })
    },
    [isFlipping],
  )

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart || isFlipping) return

      const touch = e.changedTouches[0]
      const deltaX = touchStart.x - touch.clientX
      const deltaY = touchStart.y - touch.clientY
      const deltaTime = Date.now() - touchStart.time

      // Reset touch start
      setTouchStart(null)

      // Check if it's a horizontal swipe (more horizontal than vertical movement)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50 && deltaTime < 500) {
        if (deltaX > 0) {
          // Swipe left - go to next page (forward)
          goToNextSpread()
        } else {
          // Swipe right - go to previous page (back)
          goToPrevSpread()
        }
      }
    },
    [touchStart, isFlipping, goToNextSpread, goToPrevSpread],
  )

  return (
    <div className={`flipbook-wrapper ${isSafariBrowser ? 'safari-browser' : ''}`}>
      <div className="flipbook-container">
        <div className="flipbook" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          {/* Current spread */}
          <div className="spread">
            {/* Book spine - moved inside spread */}
            <div className="book-spine"></div>
            {/* Render pages based on current spread */}
            {(() => {
              const spread = spreads[currentSpread]
              const nextSpread = spreads[currentSpread + 1]
              const prevSpread = spreads[currentSpread - 1]

              if (spread?.isCover) {
                // Front cover - single page on right
                return (
                  <>
                    <div className="page page-left">{/* Empty left page for front cover */}</div>
                    <div className="page page-right">
                      {!(isFlipping && flipDirection === 'forward') && spread.right && (
                        <ImageWithLoader
                          src={spread.right}
                          alt="Front Cover"
                          className="page-image page-cover-image"
                        />
                      )}
                      {/* Show next right page underneath when flipping forward from cover */}
                      {isFlipping && flipDirection === 'forward' && nextSpread?.right && (
                        <ImageWithLoader
                          src={nextSpread.right}
                          alt="Next Page"
                          className="page-image"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            objectPosition: 'center',
                          }}
                        />
                      )}
                    </div>
                  </>
                )
              } else if (spread?.isBack) {
                // Back cover - single page on left
                return (
                  <>
                    <div className="page page-left">
                      {!(isFlipping && flipDirection === 'back') && spread.left && (
                        <ImageWithLoader
                          src={spread.left}
                          alt="Back Cover"
                          className="page-image page-cover-image"
                        />
                      )}
                      {/* Show previous left page underneath when flipping back from back cover */}
                      {isFlipping && flipDirection === 'back' && prevSpread?.left && (
                        <ImageWithLoader
                          src={prevSpread.left}
                          alt="Previous Page"
                          className="page-image"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            objectPosition: 'center',
                          }}
                        />
                      )}
                    </div>
                    <div className="page page-right">{/* Empty right page for back cover */}</div>
                  </>
                )
              } else {
                // Regular double-page spreads
                return (
                  <>
                    {/* Left page */}
                    <div className="page page-left">
                      {(() => {
                        // Handle animation states for left page
                        if (isFlipping && flipDirection === 'back') {
                          // When flipping back, show the previous spread's left page
                          return (
                            spreads[displaySpread]?.left && (
                              <ImageWithLoader
                                src={spreads[displaySpread].left}
                                alt="Left Page"
                                className="page-image"
                              />
                            )
                          )
                        }
                        return (
                          spread?.left && (
                            <ImageWithLoader
                              src={spread.left}
                              alt="Left Page"
                              className="page-image"
                            />
                          )
                        )
                      })()}
                    </div>

                    {/* Right page */}
                    <div className="page page-right">
                      {(() => {
                        // Handle animation states for right page
                        if (isFlipping && flipDirection === 'forward') {
                          // When flipping forward, show the next spread's right page
                          return (
                            spreads[displaySpread]?.right && (
                              <ImageWithLoader
                                src={spreads[displaySpread].right}
                                alt="Right Page"
                                className="page-image"
                              />
                            )
                          )
                        }
                        return (
                          spread?.right && (
                            <ImageWithLoader
                              src={spread.right}
                              alt="Right Page"
                              className="page-image"
                            />
                          )
                        )
                      })()}
                    </div>
                  </>
                )
              }
            })()}
          </div>

          {/* Flipping page for forward animation */}
          {isFlipping && flipDirection === 'forward' && flippingPageImage && (
            <div className="flipping-page-container">
              <div className="flipping-page flip-forward">
                <ImageWithLoader
                  src={flippingPageImage}
                  alt="Flipping page"
                  className="page-image"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transform: getSafariImageTransform(isBackFace, isSafariBrowser, flipDirection),
                  }}
                />
              </div>
              <div className="page-shadow-overlay"></div>
            </div>
          )}

          {/* Flipping page for back animation */}
          {isFlipping && flipDirection === 'back' && flippingPageImage && (
            <div className="flipping-page-container flipping-page-container-back">
              <div className="flipping-page flipping-page-back flip-back">
                <ImageWithLoader
                  src={flippingPageImage}
                  alt="Flipping page"
                  className="page-image"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transform: getSafariImageTransform(isBackFace, isSafariBrowser, flipDirection),
                  }}
                />
              </div>
              <div className="page-shadow-overlay"></div>
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        <button
          onClick={goToPrevSpread}
          disabled={currentSpread === 0 || isFlipping}
          className="nav-button nav-button-prev"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={goToNextSpread}
          disabled={currentSpread === spreads.length - 1 || isFlipping}
          className="nav-button nav-button-next"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Page indicator for desktop, slider for mobile */}
      <div className="page-indicator desktop-only">
        Page {currentSpread + 1} / {spreads.length}
      </div>

      <div className="page-slider-container mobile-only">
        <input
          type="range"
          min="0"
          max={spreads.length - 1}
          value={currentSpread}
          onChange={(e) => {
            const newSpread = parseInt(e.target.value)
            if (!isFlipping && newSpread !== currentSpread) {
              setDisplaySpread(newSpread)
              onPageChange(newSpread * 2)
            }
          }}
          className="page-slider"
          disabled={isFlipping}
        />
        <div className="page-slider-labels">
          <span className="page-slider-label">Page {currentSpread + 1}</span>
          <span className="page-slider-label">{spreads.length} pages</span>
        </div>
      </div>
    </div>
  )
}
