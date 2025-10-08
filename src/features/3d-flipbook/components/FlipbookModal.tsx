'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { CSSFlipbook } from './CSSFlipbook';

interface FlipbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  images?: string[];
}

export const FlipbookModal: React.FC<FlipbookModalProps> = ({
  isOpen,
  onClose,
  images = Array.from({length: 64}, (_, i) => `/flipbook-images/${i + 1}.png`)
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Preload all images when modal opens
  useEffect(() => {
    if (isOpen && !imagesLoaded) {
      let loadedCount = 0;
      images.forEach((src, index) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          if (loadedCount === images.length) {
            setImagesLoaded(true);
          }
        };
        img.src = src;
      });
    }
  }, [isOpen, images, imagesLoaded]);

  // Handle ESC key only - arrow navigation is handled by CSSFlipbook
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
      // Arrow key navigation is handled by CSSFlipbook component
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, images.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-grainy backdrop-blur-sm" onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div className="absolute inset-0 flex items-center justify-center p-4" onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-60 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <div className="absolute top-4 left-4 z-60">
          <h2 className="text-xl font-light text-white/90">Lichtbildnerei | The Social Book</h2>
        </div>

        {/* Loading Message */}
        {!imagesLoaded && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
            <div className="text-lg mb-4">Loading Portfolio...</div>
            <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/80 animate-pulse" />
            </div>
          </div>
        )}

        {/* CSS Flipbook Container */}
        {imagesLoaded && (
          <div className="w-full h-[85vh] md:max-w-[90vw] md:h-[85vh] rounded-lg flex items-center justify-center">
            <div className="w-full h-full flex items-center justify-center">
              <CSSFlipbook
                images={images}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        )}

        {/* Navigation Hint - Desktop only */}
        <div className="hidden md:block absolute bottom-4 right-4 text-white/60 text-xs text-right">
          <div>Use arrow keys or click to navigate</div>
          <div>Press ESC to close</div>
        </div>
      </div>
    </div>
  );
};

export default FlipbookModal;