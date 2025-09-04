'use client';

import React, { useState, useEffect } from 'react';
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
  
  // Create spreads (pairs of pages)
  const spreads = [];
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
  
  const goToNextSpread = () => {
    if (!isFlipping && currentSpread < spreads.length - 1) {
      setIsFlipping(true);
      setFlipDirection('forward');
      setDisplaySpread(currentSpread + 1);
      // Update state at peak of blur (when motion is fastest)
      setTimeout(() => {
        onPageChange((currentSpread + 1) * 2);
      }, 450);
      setTimeout(() => {
        setIsFlipping(false);
        setFlipDirection(null);
      }, 900);
    }
  };
  
  const goToPrevSpread = () => {
    if (!isFlipping && currentSpread > 0) {
      setIsFlipping(true);
      setFlipDirection('back');
      setDisplaySpread(currentSpread - 1);
      // Update state at peak of blur (when motion is fastest)
      setTimeout(() => {
        onPageChange((currentSpread - 1) * 2);
      }, 450);
      setTimeout(() => {
        setIsFlipping(false);
        setFlipDirection(null);
      }, 900);
    }
  };
  
  return (
    <div className="flipbook-wrapper">
      <div className="flipbook-container">
        <div className="flipbook">
          {/* Book spine */}
          <div className="book-spine"></div>
          
          {/* Current spread */}
          <div className="spread">
            {/* Left page - stays on current when flipping forward, updates when flipping back */}
            <div className="page page-left">
              {(() => {
                const leftSpread = isFlipping && flipDirection === 'back' ? displaySpread : currentSpread;
                if (leftSpread === 0) {
                  return (
                    <div className="cover-page">
                      <img 
                        src={spreads[0].left} 
                        alt="Cover"
                        className="page-image"
                      />
                    </div>
                  );
                }
                return spreads[leftSpread]?.left && (
                  <img 
                    src={spreads[leftSpread].left} 
                    alt={`Page ${leftSpread * 2 + 1}`}
                    className="page-image"
                  />
                );
              })()}
            </div>
            
            {/* Right page - updates when flipping forward, stays on current when flipping back */}
            <div className="page page-right">
              {(() => {
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
          </div>
          
          {/* Flipping page for forward animation */}
          {isFlipping && flipDirection === 'forward' && (
            <div className="flipping-page-container">
              <div className="flipping-page flip-forward">
                <div className="page-face page-face-front">
                  {spreads[currentSpread]?.right && (
                    <img 
                      src={spreads[currentSpread].right}
                      alt="Flipping page front"
                      className="page-image"
                    />
                  )}
                </div>
                <div className="page-face page-face-back">
                  {spreads[displaySpread]?.left && (
                    <img 
                      src={spreads[displaySpread].left}
                      alt="Flipping page back"
                      className="page-image"
                    />
                  )}
                </div>
              </div>
              <div className="page-shadow-overlay"></div>
            </div>
          )}
          
          {/* Flipping page for back animation */}
          {isFlipping && flipDirection === 'back' && (
            <div className="flipping-page-container flipping-page-container-back">
              <div className="flipping-page flipping-page-back flip-back">
                <div className="page-face page-face-front">
                  {spreads[currentSpread]?.left && (
                    <img 
                      src={spreads[currentSpread].left}
                      alt="Flipping page front"
                      className="page-image"
                    />
                  )}
                </div>
                <div className="page-face page-face-back">
                  {spreads[displaySpread]?.right && (
                    <img 
                      src={spreads[displaySpread].right}
                      alt="Flipping page back"
                      className="page-image"
                    />
                  )}
                </div>
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
        Page {currentSpread * 2 + 1}-{Math.min(currentSpread * 2 + 2, images.length)} / {images.length}
      </div>
    </div>
  );
};