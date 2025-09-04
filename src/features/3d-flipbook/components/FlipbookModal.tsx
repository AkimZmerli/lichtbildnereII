'use client';

import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useBookSpread } from '../hooks/useBookSpread';

interface FlipbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  images?: string[];
}

export const FlipbookModal: React.FC<FlipbookModalProps> = ({
  isOpen,
  onClose,
  title = "Portfolio Book",
  images = Array.from({length: 63}, (_, i) => `/flipbook-images/${i + 1}.png`)
}) => {
  // Only initialize the flipbook when modal is open
  const {
    containerRef,
    currentSpread,
    totalSpreads,
    isAnimating,
    isReady,
    loadProgress,
    nextPage,
    prevPage
  } = useBookSpread({
    images,
    enabled: isOpen, // Add enabled flag
    onPageChange: (spread) => {
      console.log('✓ Book spread changed to:', spread);
    }
  });

  // Debug logging
  console.log('🔍 FlipbookModal render:', { isOpen, isReady, loadProgress, currentSpread, totalSpreads, images });

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight') {
        nextPage();
      } else if (event.key === 'ArrowLeft') {
        prevPage();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, nextPage, prevPage, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      <div className="absolute inset-0 flex items-center justify-center p-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-60 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <div className="absolute top-4 left-4 z-60">
          <h2 className="text-xl font-light text-white/90">{title}</h2>
        </div>

        {/* Loading Progress */}
        {!isReady && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
            <div className="text-lg mb-4">Loading Portfolio...</div>
            <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/80 transition-all duration-300"
                style={{ width: `${loadProgress * 100}%` }}
              />
            </div>
            <div className="text-sm mt-2 text-white/70">
              {Math.round(loadProgress * 100)}%
            </div>
          </div>
        )}

        {/* Three.js Flipbook Container */}
        <div 
          ref={containerRef}
          className={`w-full h-full max-w-6xl max-h-[90vh] rounded-lg shadow-2xl ${
            isReady ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-500`}
          style={{ 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '600px' // Ensure minimum height for Three.js
          }}
        >
          {/* The Three.js canvas will be appended here by FlipbookEngine */}
        </div>

        {/* Navigation Controls */}
        {isReady && (
          <>
            {/* Previous Page Button */}
            <button
              onClick={prevPage}
              disabled={currentSpread === 0 || isAnimating}
              className="absolute left-8 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 disabled:bg-black/20 disabled:cursor-not-allowed text-white rounded-full transition-all duration-200"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Page Button */}
            <button
              onClick={nextPage}
              disabled={currentSpread === totalSpreads - 1 || isAnimating}
              className="absolute right-8 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 disabled:bg-black/20 disabled:cursor-not-allowed text-white rounded-full transition-all duration-200"
            >
              <ChevronRight size={24} />
            </button>

            {/* Page Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              Pages {currentSpread * 2 + 1}-{currentSpread * 2 + 2} | {currentSpread + 1} / {totalSpreads}
            </div>
          </>
        )}

        {/* Navigation Hint */}
        <div className="absolute bottom-4 right-4 text-white/60 text-xs text-right">
          <div>Use arrow keys or click to navigate</div>
          <div>Press ESC to close</div>
        </div>
      </div>
    </div>
  );
};

export default FlipbookModal;