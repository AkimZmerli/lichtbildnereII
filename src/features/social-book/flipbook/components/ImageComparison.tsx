'use client';

import React, { useState } from 'react';
import { getImageUrl } from '../../../../lib/cloudinary';

export const ImageComparison: React.FC = () => {
  const [showComparison, setShowComparison] = useState(false);

  if (!showComparison) {
    return (
      <button
        onClick={() => setShowComparison(true)}
        className="fixed bottom-20 left-4 z-[100] bg-blue-500 text-white px-4 py-2 rounded"
      >
        Show Image Comparison
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      <div className="flex gap-8">
        <div className="text-white text-center">
          <h3 className="mb-4">Original HTML Image</h3>
          <img 
            src={getImageUrl('flipbook-images/1.webp')} 
            alt="Original" 
            className="max-w-[400px]"
            style={{ imageRendering: 'auto' }}
          />
        </div>
        <div className="text-white text-center">
          <h3 className="mb-4">Three.js Canvas (for reference)</h3>
          <div className="max-w-[400px] bg-gray-800 p-4">
            See flipbook for Three.js rendering
          </div>
        </div>
      </div>
      <button
        onClick={() => setShowComparison(false)}
        className="absolute top-4 right-4 text-white text-2xl"
      >
        ×
      </button>
    </div>
  );
};