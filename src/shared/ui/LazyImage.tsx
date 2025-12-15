import { useState, useRef, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { GalleryImageProps } from '@/types/gallery'
import LoadingSpinner from './LoadingSpinner'

interface LazyImageProps extends GalleryImageProps {
  threshold?: number
}

const LazyImage = ({
  image,
  priority = false,
  onLoad,
  sizes = '100vw',
  threshold = 100,
}: LazyImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [shouldLoad, setShouldLoad] = useState(priority) // Load based on priority
  const imageRef = useRef<HTMLDivElement>(null)
  
  // Optimize Cloudinary URL for better performance
  const getOptimizedUrl = (url: string) => {
    if (!url.includes('cloudinary.com')) return url
    
    // Add responsive width parameter for automatic sizing
    // This tells Cloudinary to serve appropriately sized images
    return url.replace(
      '/f_auto,q_auto/',
      '/f_auto,q_auto,w_auto:100:2000,dpr_auto/'
    )
  }
  
  const optimizedUrl = getOptimizedUrl(image.url)
  
  // Load non-priority images after a short delay
  useEffect(() => {
    if (!priority && !shouldLoad) {
      const timer = setTimeout(() => {
        setShouldLoad(true)
      }, 100) // Small delay to prioritize priority images
      return () => clearTimeout(timer)
    }
  }, [priority, shouldLoad])
  
  // Handle image load error with retry logic
  const handleImageError = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1)
      console.log(`Retrying image (attempt ${retryCount + 1}):`, image.url)
    } else {
      console.error('Image failed after 3 attempts:', image.url)
      setHasError(true)
      setIsLoading(false)
    }
  }, [image.url, retryCount])

  return (
    <div ref={imageRef} className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-grainy">
          {/* Shimmer effect */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-hot-pink/10 to-transparent animate-[shimmer_1.5s_ease-in-out_infinite] motion-reduce:animate-none"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255, 105, 180, 0.1) 50%, transparent 100%)',
              animation: 'shimmer 1.5s ease-in-out infinite',
            }}
          />

          {/* Skeleton placeholder */}
          <div className="absolute inset-4 bg-neutral-800/30 rounded-sm animate-pulse motion-reduce:animate-none" />

          {/* Loading spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="sm" showText={false} />
          </div>
        </div>
      )}
      
      {shouldLoad && !hasError && (
        <Image
          key={`${optimizedUrl}-${retryCount}`} // Force re-render on retry
          src={optimizedUrl}
          alt={image.alt || ''}
          fill
          className={`object-contain transition-opacity duration-500 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
          sizes={sizes}
          quality={85}
          unoptimized={false} // Let Next.js handle optimization
          placeholder={image.blurDataUrl ? 'blur' : 'empty'}
          blurDataURL={image.blurDataUrl}
          onLoad={() => {
            setIsLoading(false)
            setHasError(false)
            onLoad?.()
          }}
          onError={handleImageError}
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/50">
          <div className="text-center text-white-rose/60 text-xs">
            <p>Image unavailable</p>
            <button 
              onClick={() => {
                setRetryCount(0)
                setHasError(false)
                setIsLoading(true)
              }}
              className="mt-2 px-3 py-1 bg-hot-pink/20 hover:bg-hot-pink/30 rounded transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Custom shimmer keyframes */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}

export default LazyImage