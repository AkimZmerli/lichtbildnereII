import { useEffect, useRef, useState } from 'react';
import { FlipbookEngine, FlipbookEngineOptions } from '../services/FlipbookEngine';

interface UseFlipbookOptions {
  images: string[];
  initialPage?: number;
  onPageChange?: (page: number) => void;
}

export const useFlipbook = (options: UseFlipbookOptions) => {
  const [currentPage, setCurrentPage] = useState(options.initialPage || 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  const engineRef = useRef<FlipbookEngine | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const initializeEngine = () => {
    if (!containerRef.current || options.images.length === 0) return;

    // Clean up existing engine
    if (engineRef.current) {
      engineRef.current.dispose();
      engineRef.current = null;
    }

    try {
      const engineOptions: FlipbookEngineOptions = {
        container: containerRef.current,
        images: options.images,
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

      engineRef.current = new FlipbookEngine(engineOptions);
    } catch (error) {
      console.error('Failed to initialize FlipbookEngine:', error);
      setIsReady(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(initializeEngine, 100); // Small delay for container setup
    
    return () => {
      clearTimeout(timer);
      if (engineRef.current) {
        try {
          engineRef.current.dispose();
        } catch (error) {
          console.error('Error disposing FlipbookEngine:', error);
        }
        engineRef.current = null;
      }
      
      // Reset states
      setIsReady(false);
      setLoadProgress(0);
    };
  }, [options.images]);

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
    totalPages: options.images.length,
    isAnimating,
    isReady,
    loadProgress,
    nextPage,
    prevPage,
    goToPage
  };
};