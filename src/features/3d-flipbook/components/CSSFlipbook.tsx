'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './flipbook-blur.css';

interface CSSFlipbookProps {
  images: string[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const CSSFlipbook: React.FC<CSSFlipbookProps> = ({
  images,
  currentPage,
  onPageChange
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'back' | null>(null);
  const [displaySpread, setDisplaySpread] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [flippingPageImage, setFlippingPageImage] = useState<string | null>(null);
  const [isBackFace, setIsBackFace] = useState(false);
  
  // Create spreads - first page is front cover (single), middle pages are pairs, last is back cover (single)
  const spreads: Array<{ left: string | null; right: string | null; isCover?: boolean; isBack?: boolean }> = [];
  
  // First spread is the front cover - single page
  if (images.length > 0) {
    spreads.push({
      left: null,           // No left page for front cover
      right: images[0],     // Front cover on right side
      isCover: true,
      isBack: false
    });
  }
  
  // Middle pages are paired (1-2, 3-4, 5-6, etc.)
  // Skip first and last images (covers)
  for (let i = 1; i < images.length - 1; i += 2) {
    spreads.push({
      left: images[i] || null,
      right: images[i + 1] || null,
      isCover: false,
      isBack: false
    });
  }
  
  // Last spread is the back cover - single page
  if (images.length > 1) {
    spreads.push({
      left: images[images.length - 1],  // Back cover on left side
      right: null,                      // No right page for back cover
      isCover: false,
      isBack: true
    });
  }
  
  const currentSpread = Math.floor(currentPage / 2);
  
  // Sync display spread with current spread when not flipping
  useEffect(() => {
    if (!isFlipping) {
      setDisplaySpread(currentSpread);
    }
  }, [currentSpread, isFlipping]);
  
  // Preload nearby images
  useEffect(() => {
    const imagesToLoad = [];
    for (let i = Math.max(0, currentPage - 2); i <= Math.min(images.length - 1, currentPage + 4); i++) {
      if (!loadedImages.has(i)) {
        imagesToLoad.push(i);
      }
    }
    
    imagesToLoad.forEach(index => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set(prev).add(index));
      };
      img.src = images[index];
    });
  }, [currentPage, images, loadedImages]);
  
  const goToNextSpread = useCallback(() => {
    if (!isFlipping && currentSpread < spreads.length - 1) {
      setIsFlipping(true);
      setFlipDirection('forward');
      setDisplaySpread(currentSpread + 1);
      setIsBackFace(false);
      
      // Set the flipping page image
      setFlippingPageImage(spreads[currentSpread].right);
      
      // Swap to back face image earlier to prevent glitch
      setTimeout(() => {
        const nextSpread = spreads[currentSpread + 1];
        if (nextSpread) {
          // If next spread is back cover, show it on the left
          setFlippingPageImage(nextSpread.left || nextSpread.right);
          setIsBackFace(true);
        }
      }, 380); // Earlier than halfway for smoother transition
      
      // Update page state AFTER the flip animation completes
      setTimeout(() => {
        setIsFlipping(false);
        setFlipDirection(null);
        setFlippingPageImage(null);
        setIsBackFace(false);
        onPageChange((currentSpread + 1) * 2);
      }, 900);
    }
  }, [currentSpread, isFlipping, spreads, onPageChange]);
  
  const goToPrevSpread = useCallback(() => {
    if (!isFlipping && currentSpread > 0) {
      setIsFlipping(true);
      setFlipDirection('back');
      setDisplaySpread(currentSpread - 1);
      setIsBackFace(false);
      
      // Start with front face image (x)
      setFlippingPageImage(spreads[currentSpread].left);
      
      // Swap to back face image earlier to prevent glitch
      setTimeout(() => {
        const prevSpread = spreads[currentSpread - 1];
        if (prevSpread) {
          // If flipping back to front cover, show it on the right
          setFlippingPageImage(prevSpread.right || prevSpread.left);
          setIsBackFace(true);
        }
      }, 380); // Earlier than halfway for smoother transition
      
      // Update page state AFTER the flip animation completes
      setTimeout(() => {
        setIsFlipping(false);
        setFlipDirection(null);
        setFlippingPageImage(null);
        setIsBackFace(false);
        onPageChange((currentSpread - 1) * 2);
      }, 900);
    }
  }, [currentSpread, isFlipping, spreads, onPageChange]);
  
  // Keyboard navigation - instant page change without animation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFlipping) return; // Don't allow during animation
      
      if (e.key === 'ArrowRight') {
        // Instant forward navigation
        if (currentSpread < spreads.length - 1) {
          setDisplaySpread(currentSpread + 1);
          onPageChange((currentSpread + 1) * 2);
        }
      } else if (e.key === 'ArrowLeft') {
        // Instant backward navigation
        if (currentSpread > 0) {
          setDisplaySpread(currentSpread - 1);
          onPageChange((currentSpread - 1) * 2);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSpread, spreads.length, onPageChange, isFlipping]);
  
  return (
    <div className="flipbook-wrapper">
      <div className="flipbook-container">
        <div className="flipbook">
          {/* Current spread */}
          <div className="spread">
            {/* Book spine - moved inside spread */}
            <div className="book-spine"></div>
            {/* Render pages based on current spread */}
            {(() => {
              const spread = spreads[currentSpread];
              const nextSpread = spreads[currentSpread + 1];
              const prevSpread = spreads[currentSpread - 1];
              
              if (spread?.isCover) {
                // Front cover - single page on right
                return (
                  <>
                    <div className="page page-left">
                      {/* Empty left page for front cover */}
                    </div>
                    <div className="page page-right">
                      {!(isFlipping && flipDirection === 'forward') && spread.right && (
                        <img 
                          src={spread.right} 
                          alt="Front Cover"
                          className="page-image page-cover-image"
                        />
                      )}
                      {/* Show next right page underneath when flipping forward from cover */}
                      {isFlipping && flipDirection === 'forward' && nextSpread?.right && (
                        <img 
                          src={nextSpread.right} 
                          alt="Next Page"
                          className="page-image"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            objectPosition: 'center'
                          }}
                        />
                      )}
                    </div>
                  </>
                );
              } else if (spread?.isBack) {
                // Back cover - single page on left
                return (
                  <>
                    <div className="page page-left">
                      {!(isFlipping && flipDirection === 'back') && spread.left && (
                        <img 
                          src={spread.left} 
                          alt="Back Cover"
                          className="page-image page-cover-image"
                        />
                      )}
                      {/* Show previous left page underneath when flipping back from back cover */}
                      {isFlipping && flipDirection === 'back' && prevSpread?.left && (
                        <img 
                          src={prevSpread.left} 
                          alt="Previous Page"
                          className="page-image"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            objectPosition: 'center'
                          }}
                        />
                      )}
                    </div>
                    <div className="page page-right">
                      {/* Empty right page for back cover */}
                    </div>
                  </>
                );
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
                          return spreads[displaySpread]?.left && (
                            <img 
                              src={spreads[displaySpread].left} 
                              alt="Left Page"
                              className="page-image"
                            />
                          );
                        }
                        return spread?.left && (
                          <img 
                            src={spread.left} 
                            alt="Left Page"
                            className="page-image"
                          />
                        );
                      })()}
                    </div>
                    
                    {/* Right page */}
                    <div className="page page-right">
                      {(() => {
                        // Handle animation states for right page
                        if (isFlipping && flipDirection === 'forward') {
                          // When flipping forward, show the next spread's right page
                          return spreads[displaySpread]?.right && (
                            <img 
                              src={spreads[displaySpread].right} 
                              alt="Right Page"
                              className="page-image"
                            />
                          );
                        }
                        return spread?.right && (
                          <img 
                            src={spread.right} 
                            alt="Right Page"
                            className="page-image"
                          />
                        );
                      })()}
                    </div>
                  </>
                );
              }
            })()}
          </div>
          
          {/* Flipping page for forward animation */}
          {isFlipping && flipDirection === 'forward' && flippingPageImage && (
            <div className="flipping-page-container">
              <div className="flipping-page flip-forward">
                <img 
                  src={flippingPageImage}
                  alt="Flipping page"
                  className="page-image"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain',
                    transform: isBackFace ? 'scaleX(-1)' : 'none'
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
                <img 
                  src={flippingPageImage}
                  alt="Flipping page"
                  className="page-image"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain',
                    transform: isBackFace ? 'scaleX(-1)' : 'none'
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
      
      {/* Page indicator - now outside container */}
      <div className="page-indicator">
        Page {currentSpread + 1} / {spreads.length}
      </div>
    </div>
  );
};