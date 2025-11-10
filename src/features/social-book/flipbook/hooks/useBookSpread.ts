import { useEffect, useRef, useState, useMemo } from 'react';
import { BookSpreadEngine, BookSpreadEngineOptions } from '../services/BookSpreadEngine';

interface UseBookSpreadOptions {
  images: string[];
  enabled?: boolean;
  onPageChange?: (spread: number) => void;
}

export const useBookSpread = (options: UseBookSpreadOptions) => {
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  const engineRef = useRef<BookSpreadEngine | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Memoize images to prevent re-renders
  const memoizedImages = useMemo(() => options.images, [JSON.stringify(options.images)]);

  const initializeEngine = () => {
    console.log('🔧 Attempting to initialize book spread engine...', {
      hasContainer: !!containerRef.current,
      imageCount: memoizedImages.length,
      images: memoizedImages
    });
    
    if (!containerRef.current || memoizedImages.length === 0) {
      console.log('❌ Cannot initialize: missing container or images');
      return;
    }

    // Clean up existing engine
    if (engineRef.current) {
      console.log('🧹 Cleaning up existing engine before initialization');
      engineRef.current.dispose();
      engineRef.current = null;
    }

    try {
      const engineOptions: BookSpreadEngineOptions = {
        container: containerRef.current,
        images: memoizedImages,
        onPageChange: (spread: number) => {
          setCurrentSpread(spread);
          options.onPageChange?.(spread);
        },
        onAnimationStart: () => setIsAnimating(true),
        onAnimationEnd: () => setIsAnimating(false),
        onLoadProgress: (progress: number) => {
          setLoadProgress(progress);
          if (progress === 1) {
            setIsReady(true);
          }
        }
      };

      console.log('🚀 Starting BookSpreadEngine initialization...');
      engineRef.current = new BookSpreadEngine(engineOptions);
    } catch (error) {
      console.error('❌ Failed to initialize BookSpreadEngine:', error);
      setIsReady(false);
    }
  };

  useEffect(() => {
    // Don't initialize if not enabled
    if (!options.enabled) {
      console.log('🔄 Book spread not enabled, skipping initialization');
      return;
    }
    
    // Don't initialize immediately - wait for container to be available
    let initTimer: NodeJS.Timeout;
    let retryCount = 0;
    const maxRetries = 10;
    
    const tryInitialize = () => {
      if (containerRef.current && memoizedImages.length > 0) {
        initializeEngine();
      } else if (retryCount < maxRetries) {
        retryCount++;
        console.log(`🔄 Waiting for container (attempt ${retryCount}/${maxRetries})...`);
        initTimer = setTimeout(tryInitialize, 200);
      } else {
        console.error('❌ Failed to initialize after maximum retries');
      }
    };
    
    initTimer = setTimeout(tryInitialize, 100);
    
    return () => {
      clearTimeout(initTimer);
      if (engineRef.current) {
        try {
          console.log('🧹 useBookSpread cleanup: disposing engine...');
          engineRef.current.dispose();
        } catch (error) {
          console.error('❌ Error disposing BookSpreadEngine:', error);
        } finally {
          engineRef.current = null;
        }
      }
      
      // Reset states
      setIsReady(false);
      setLoadProgress(0);
      setIsAnimating(false);
      setCurrentSpread(0);
    };
  }, [memoizedImages, options.enabled]);

  const nextPage = () => {
    if (engineRef.current && !isAnimating) {
      engineRef.current.nextPage();
    }
  };

  const prevPage = () => {
    if (engineRef.current && !isAnimating) {
      engineRef.current.prevPage();
    }
  };

  // Calculate total spreads based on images
  // No cover - just pairs of pages
  const totalSpreads = Math.ceil(memoizedImages.length / 2);

  return {
    containerRef,
    currentSpread,
    totalSpreads,
    isAnimating,
    isReady,
    loadProgress,
    nextPage,
    prevPage
  };
};