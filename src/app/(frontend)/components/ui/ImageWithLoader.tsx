import { useState } from 'react'
import Image from 'next/image'
import { GalleryImageProps } from '../../types/gallery'

const ImageWithLoader = ({ image, priority = false, onLoad }: GalleryImageProps) => {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative w-full h-full">
      {isLoading && <div className="absolute inset-0 bg-gray-900 animate-pulse" />}
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className={`object-contain transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={priority}
        onLoad={() => {
          setIsLoading(false)
          onLoad?.()
        }}
      />
    </div>
  )
}

export default ImageWithLoader
