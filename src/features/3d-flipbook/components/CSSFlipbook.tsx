'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const flipbookRef = useRef<HTMLDivElement>(null);
  
  // Create spreads (pairs of pages)
  const spreads: Array<{ left: string; right: string | null }> = [];
  for (let i = 0; i < images.length; i += 2) {
    spreads.push({
      left: images[i],
      right: images[i + 1] || null
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
  
  // Touch event handlers for swipe navigation
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      goToNextSpread();
    }
    if (isRightSwipe) {
      goToPrevSpread();
    }
  };
  
  const goToNextSpread = () => {
    if (!isFlipping && currentSpread < spreads.length - 1) {
      setIsFlipping(true);
      setFlipDirection('forward');
      setDisplaySpread(currentSpread + 1);
      setIsBackFace(false);
      
      // Start with front face image (y)
      setFlippingPageImage(spreads[currentSpread].right);
      
      // Swap to back face image (r) at 50% point and flip it
      setTimeout(() => {
        setFlippingPageImage(spreads[currentSpread + 1]?.left || null);
        setIsBackFace(true);
      }, 450); // Half of 900ms animation
      
      // Update page state AFTER the flip animation completes
      setTimeout(() => {
        setIsFlipping(false);
        setFlipDirection(null);
        setFlippingPageImage(null);
        setIsBackFace(false);
        onPageChange((currentSpread + 1) * 2);
      }, 900);
    }
  };
  
  const goToPrevSpread = () => {
    if (!isFlipping && currentSpread > 0) {
      setIsFlipping(true);
      setFlipDirection('back');
      setDisplaySpread(currentSpread - 1);
      setIsBackFace(false);
      
      // Start with front face image (x)
      setFlippingPageImage(spreads[currentSpread].left);
      
      // Swap to back face image (w) at 50% point and flip it
      setTimeout(() => {
        setFlippingPageImage(spreads[currentSpread - 1]?.right || null);
        setIsBackFace(true);
      }, 450); // Half of 900ms animation
      
      // Update page state AFTER the flip animation completes
      setTimeout(() => {
        setIsFlipping(false);
        setFlipDirection(null);
        setFlippingPageImage(null);
        setIsBackFace(false);
        onPageChange((currentSpread - 1) * 2);
      }, 900);
    }
  };
  
  // Render spreads for all screen sizes
  return (
    <div className="flipbook-wrapper">
      <div className="flipbook-container">
        <div 
          ref={flipbookRef}
          className="flipbook"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Current spread with spine */}
          <div className="spread">
            {/* Book spine - positioned in the center of spread */}
            <div className="book-spine"></div>
            
            {/* Left page (x position) - stays as current left during forward flip, shows previous left during back flip */}
            <div className="page page-left">
              {(() => {
                // Forward flip: keep showing x (current left)
                // Back flip: show v (previous left) underneath
                const leftSpread = isFlipping && flipDirection === 'back' ? displaySpread : currentSpread;
                return spreads[leftSpread]?.left ? (
                  <img 
                    src={spreads[leftSpread].left} 
                    alt={`Page ${leftSpread * 2 + 1}`}
                    className="page-image"
                  />
                ) : (
                  <div className="page-placeholder" />
                );
              })()}
            </div>
            
            {/* Right page (y position) - shows s (next right) during forward flip, stays as current right during back flip */}
            <div className="page page-right">
              {(() => {
                // Forward flip: show s (next right) underneath
                // Back flip: keep showing y (current right)
                const rightSpread = isFlipping && flipDirection === 'forward' ? displaySpread : currentSpread;
                return spreads[rightSpread]?.right && (
                  <img 
                    src={spreads[rightSpread].right} 
                    alt={`Page ${rightSpread * 2 + 2}`}
                    className="page-image"
                  />
                );
              })()}
            </div>
            
            {/* Flipping page for forward animation */}
            {isFlipping && flipDirection === 'forward' && flippingPageImage && (
              <div className="flipping-page-container">
                <div className="flipping-page flip-forward">
                  {/* Single image that swaps at 50% */}
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
                  {/* Single image that swaps at 50% */}
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
      
      {/* Page indicator */}
      <div className="page-indicator">
        Spread {currentSpread + 1} / {Math.ceil(images.length / 2)}
      </div>
    </div>
  );
};