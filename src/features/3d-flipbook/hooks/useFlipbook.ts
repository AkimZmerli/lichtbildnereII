import { useEffect, useRef, useState, useMemo } from 'react';
import { FlipbookEngine, FlipbookEngineOptions } from '../services/FlipbookEngine';

interface UseFlipbookOptions {
  images: string[];
  initialPage?: number;
  enabled?: boolean;
  onPageChange?: (page: number) => void;
}

export const useFlipbook = (options: UseFlipbookOptions) => {
  const [currentPage, setCurrentPage] = useState(options.initialPage || 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  const engineRef = useRef<FlipbookEngine | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Memoize images to prevent re-renders
  const memoizedImages = useMemo(() => options.images, [JSON.stringify(options.images)]);

  const initializeEngine = () => {
    console.log('🔧 Attempting to initialize engine...', {
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
      const engineOptions: FlipbookEngineOptions = {
        container: containerRef.current,
        images: memoizedImages,
        onPageChange: (page: number) => {
          setCurrentPage(page);
          options.onPageChange?.(page);
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

      console.log('🚀 Starting FlipbookEngine initialization...');
      engineRef.current = new FlipbookEngine(engineOptions);
    } catch (error) {
      console.error('❌ Failed to initialize FlipbookEngine:', error);
      setIsReady(false);
    }
  };

  useEffect(() => {
    // Don't initialize if not enabled
    if (!options.enabled) {
      console.log('🔄 Flipbook not enabled, skipping initialization');
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
          console.log('🧹 useFlipbook cleanup: disposing engine...');
          engineRef.current.dispose();
        } catch (error) {
          console.error('❌ Error disposing FlipbookEngine:', error);
        } finally {
          engineRef.current = null;
        }
      }
      
      // Reset states
      setIsReady(false);
      setLoadProgress(0);
      setIsAnimating(false);
      setCurrentPage(0);
    };
  }, [memoizedImages, options.enabled]); // Use memoized images and enabled flag
  

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

  const goToPage = (pageIndex: number) => {
    if (engineRef.current && !isAnimating) {
      engineRef.current.goToPage(pageIndex);
    }
  };

  return {
    containerRef,
    currentPage,
    totalPages: memoizedImages.length,
    isAnimating,
    isReady,
    loadProgress,
    nextPage,
    prevPage,
    goToPage
  };
};