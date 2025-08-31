'use client';

import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFlipbook } from '../hooks/useFlipbook';

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
  images = [
    '/flipbook-images/page1.png',
    '/flipbook-images/page2.png'
  ]
}) => {
  const {
    containerRef,
    currentPage,
    totalPages,
    isAnimating,
    isReady,
    loadProgress,
    nextPage,
    prevPage,
    goToPage
  } = useFlipbook({
    images,
    onPageChange: (page) => {
      console.log('✓ Flipbook page changed to:', page + 1);
    }
  });

  // Debug logging
  console.log('🔍 FlipbookModal render:', { isOpen, isReady, loadProgress, currentPage, totalPages, images });

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
          }}
        >
          {/* Temporary: Simple image display for testing */}
          {!isReady && (
            <div className="w-full h-full flex items-center justify-center text-white">
              <div>
                <div>Container Ref: {containerRef.current ? '✅' : '❌'}</div>
                <div>Images: {images.length}</div>
                <div>Ready: {isReady ? '✅' : '❌'}</div>
                <div>Progress: {Math.round(loadProgress * 100)}%</div>
              </div>
            </div>
          )}
          {isReady && (
            <div className="w-full h-full flex items-center justify-center p-4">
              {/* Social Book: Two pages side by side */}
              <div className="flex w-full h-full max-w-4xl gap-4">
                {/* Left Page - Normal orientation for person on left */}
                <div className="flex-1 flex items-center justify-center border-r border-gray-300">
                  <img 
                    src={images[Math.floor(currentPage / 2) * 2]} 
                    alt={`Left page ${Math.floor(currentPage / 2) * 2 + 1}`}
                    className="max-w-full max-h-full object-contain"
                    onLoad={() => console.log('✅ Left page loaded:', images[Math.floor(currentPage / 2) * 2])}
                    onError={() => console.log('❌ Left page failed:', images[Math.floor(currentPage / 2) * 2])}
                  />
                </div>
                
                {/* Right Page - Upside down for person on right */}
                <div className="flex-1 flex items-center justify-center">
                  {images[Math.floor(currentPage / 2) * 2 + 1] ? (
                    <img 
                      src={images[Math.floor(currentPage / 2) * 2 + 1]} 
                      alt={`Right page ${Math.floor(currentPage / 2) * 2 + 2}`}
                      className="max-w-full max-h-full object-contain transform rotate-180"
                      onLoad={() => console.log('✅ Right page loaded (upside down):', images[Math.floor(currentPage / 2) * 2 + 1])}
                      onError={() => console.log('❌ Right page failed:', images[Math.floor(currentPage / 2) * 2 + 1])}
                    />
                  ) : (
                    <div className="text-white/60 text-lg">No second page</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        {isReady && (
          <>
            {/* Previous Page Button */}
            <button
              onClick={prevPage}
              disabled={currentPage === 0 || isAnimating}
              className="absolute left-8 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 disabled:bg-black/20 disabled:cursor-not-allowed text-white rounded-full transition-all duration-200"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Page Button */}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1 || isAnimating}
              className="absolute right-8 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 disabled:bg-black/20 disabled:cursor-not-allowed text-white rounded-full transition-all duration-200"
            >
              <ChevronRight size={24} />
            </button>

            {/* Page Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              Spread {Math.floor(currentPage / 2) + 1} / {Math.ceil(totalPages / 2)}
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