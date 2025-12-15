import { useState } from 'react'
import Image from 'next/image'
import { GalleryImageProps } from '@/types/gallery'
import LoadingSpinner from './LoadingSpinner'

const ImageWithLoader = ({
  image,
  priority = false,
  onLoad,
  sizes = '100vw',
}: GalleryImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  
  // Get optimized Cloudinary URL with specific width for better performance
  const getOptimizedUrl = (url: string, width?: number) => {
    if (!url.includes('cloudinary')) return url
    
    // Use specific width for faster loading (no client-side JS needed)
    // Default to 1920px max width if not specified
    const targetWidth = width || 1920
    
    // For mobile, use lower quality for faster loading
    const quality = targetWidth <= 768 ? 'q_auto:low' : 'q_auto:eco'
    
    // Replace the optimization params with specific width
    return url.replace(
      '/f_auto,q_auto/',
      `/f_auto,${quality},w_${targetWidth},c_limit/`
    )
  }
  
  // Determine optimal width based on sizes prop
  const getTargetWidth = () => {
    // Parse the sizes prop to determine max needed width
    if (sizes.includes('640px')) return 640
    if (sizes.includes('768px')) return 768
    if (sizes.includes('1280px')) return 1280
    return 1920 // Default max
  }
  
  const optimizedUrl = getOptimizedUrl(image.url, getTargetWidth())

  return (
    <div className="relative w-full h-full">
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
      <Image
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
        unoptimized={optimizedUrl.includes('cloudinary')}
        onLoad={() => {
          setIsLoading(false)
          onLoad?.()
        }}
      />

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

export default ImageWithLoader
