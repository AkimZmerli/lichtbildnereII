import { useState } from 'react'
import Image from 'next/image'
import { GalleryImageProps } from '@/types/gallery'
import LoadingSpinner from './LoadingSpinner'

const ImageWithLoader = ({ image, priority = false, onLoad }: GalleryImageProps) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-grainy">
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-hot-pink/10 to-transparent animate-[shimmer_1.5s_ease-in-out_infinite] motion-reduce:animate-none" 
               style={{
                 background: 'linear-gradient(90deg, transparent 0%, rgba(255, 105, 180, 0.1) 50%, transparent 100%)',
                 animation: 'shimmer 1.5s ease-in-out infinite'
               }} />
          
          {/* Skeleton placeholder */}
          <div className="absolute inset-4 bg-neutral-800/30 rounded-sm animate-pulse motion-reduce:animate-none" />
          
          {/* Loading spinner */}
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="sm" showText={false} />
          </div>
        </div>
      )}
      <Image
        src={image.url}
        alt={image.alt || ''}
        fill
        className={`object-contain transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={priority}
        onLoad={() => {
          setIsLoading(false)
          onLoad?.()
        }}
      />
      
      {/* Custom shimmer keyframes */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}

export default ImageWithLoader
