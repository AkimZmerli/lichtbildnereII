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
  
  // Create spreads - first page is cover (displayed alone), then pairs
  const spreads: Array<{ left: string | null; right: string | null; isCover?: boolean }> = [];
  
  // First spread is the cover - only shows page 1 (full spread image)
  if (images.length > 0) {
    spreads.push({
      left: images[0],  // Cover image (full spread)
      right: null,      // No right page for cover
      isCover: true
    });
  }
  
  // Rest of the pages are paired (2-3, 4-5, 6-7, etc.)
  for (let i = 1; i < images.length; i += 2) {
    spreads.push({
      left: images[i] || null,
      right: images[i + 1] || null,
      isCover: false
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
      
      // For cover page, flip the right half of the cover image
      if (currentSpread === 0) {
        // Create a temporary image that shows the right half of the cover
        setFlippingPageImage(spreads[0].left); // Use the cover image
      } else {
        // Normal page flip
        setFlippingPageImage(spreads[currentSpread].right);
      }
      
      // Swap to back face image (r) earlier to prevent glitch
      setTimeout(() => {
        setFlippingPageImage(spreads[currentSpread + 1]?.left || null);
        setIsBackFace(true);
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
        // If flipping back to cover, show right half of cover
        if (currentSpread === 1) {
          setFlippingPageImage(spreads[0].left); // Cover image
        } else {
          setFlippingPageImage(spreads[currentSpread - 1]?.right || null);
        }
        setIsBackFace(true);
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
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isFlipping) return; // Don't allow during animation
      
      if (e.key === 'ArrowRight') {
        goToNextSpread();
      } else if (e.key === 'ArrowLeft') {
        goToPrevSpread();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSpread, goToPrevSpread, isFlipping]);
  
  return (
    <div className="flipbook-wrapper">
      <div className="flipbook-container">
        <div className="flipbook">
          {/* Current spread */}
          <div className="spread">
            {/* Book spine - moved inside spread */}
            <div className="book-spine"></div>
            {/* Determine if we should show the cover */}
            {currentSpread === 0 ? (
              // Cover page - spans both pages when on spread 0
              <>
                <div className="page page-left" style={{ overflow: 'hidden' }}>
                  <img 
                    src={spreads[0].left} 
                    alt="Cover"
                    className="page-image"
                    style={{ 
                      width: '200%',
                      maxWidth: '200%',
                      objectFit: 'contain',
                      objectPosition: 'left'
                    }}
                  />
                </div>
                <div className="page page-right" style={{ overflow: 'hidden' }}>
                  {/* Right side of cover - only show when not flipping forward from cover */}
                  {!(isFlipping && flipDirection === 'forward') && (
                    <img 
                      src={spreads[0].left} 
                      alt="Cover"
                      className="page-image"
                      style={{ 
                        width: '200%',
                        maxWidth: '200%',
                        objectFit: 'contain',
                        objectPosition: 'right',
                        transform: 'translateX(-50%)'
                      }}
                    />
                  )}
                  {/* Show next right page underneath when flipping forward from cover */}
                  {isFlipping && flipDirection === 'forward' && spreads[1]?.right && (
                    <img 
                      src={spreads[1].right} 
                      alt={`Page 3`}
                      className="page-image"
                    />
                  )}
                </div>
              </>
            ) : (
              // Regular spreads
              <>
                {/* Left page */}
                <div className="page page-left" style={{ overflow: 'hidden' }}>
                  {(() => {
                    // When flipping back to cover, show left half of cover properly
                    if (currentSpread === 1 && isFlipping && flipDirection === 'back') {
                      return (
                        <img 
                          src={spreads[0].left}  // Cover image
                          alt="Cover"
                          className="page-image"
                          style={{ 
                            width: '200%',
                            maxWidth: '200%',
                            objectFit: 'contain',
                            objectPosition: 'left'
                          }}
                        />
                      );
                    }
                    const leftSpread = isFlipping && flipDirection === 'back' ? displaySpread : currentSpread;
                    return spreads[leftSpread]?.left && (
                      <img 
                        src={spreads[leftSpread].left} 
                        alt={`Page ${leftSpread === 0 ? 1 : leftSpread * 2}`}
                        className="page-image"
                      />
                    );
                  })()}
                </div>
                
                {/* Right page */}
                <div className="page page-right">
                  {(() => {
                    // Don't change right page when flipping back to cover
                    if (currentSpread === 1 && isFlipping && flipDirection === 'back') {
                      // Keep showing page 3 until flip completes
                      return spreads[1]?.right && (
                        <img 
                          src={spreads[1].right} 
                          alt={`Page 3`}
                          className="page-image"
                        />
                      );
                    }
                    const rightSpread = isFlipping && flipDirection === 'forward' ? displaySpread : currentSpread;
                    return spreads[rightSpread]?.right && (
                      <img 
                        src={spreads[rightSpread].right} 
                        alt={`Page ${rightSpread * 2 + 1}`}
                        className="page-image"
                      />
                    );
                  })()}
                </div>
              </>
            )}
          </div>
          
          {/* Flipping page for forward animation */}
          {isFlipping && flipDirection === 'forward' && flippingPageImage && (
            <div className="flipping-page-container">
              <div className="flipping-page flip-forward" style={{ overflow: 'hidden' }}>
                {/* For cover flip, show right half of cover image */}
                {currentSpread === 0 && !isBackFace ? (
                  <img 
                    src={flippingPageImage}
                    alt="Flipping page"
                    className="page-image"
                    style={{ 
                      width: '200%',
                      maxWidth: '200%',
                      objectFit: 'contain',
                      objectPosition: 'right',
                      transform: 'translateX(-50%)'
                    }}
                  />
                ) : (
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
                )}
              </div>
              <div className="page-shadow-overlay"></div>
            </div>
          )}
          
          {/* Flipping page for back animation */}
          {isFlipping && flipDirection === 'back' && flippingPageImage && (
            <div className="flipping-page-container flipping-page-container-back">
              <div className="flipping-page flipping-page-back flip-back" style={{ overflow: 'hidden' }}>
                {/* For flipping back to cover, handle the cover image properly */}
                {currentSpread === 1 && isBackFace ? (
                  // Back face when flipping to cover - show RIGHT half of cover
                  <img 
                    src={flippingPageImage}
                    alt="Flipping page"
                    className="page-image"
                    style={{ 
                      width: '200%',
                      maxWidth: '200%',
                      objectFit: 'contain',
                      objectPosition: 'left',
                      transform: 'scaleX(-1)'
                    }}
                  />
                ) : (
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
                )}
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
        Page {currentSpread + 1} / {Math.ceil(images.length / 2)}
      </div>
    </div>
  );
};