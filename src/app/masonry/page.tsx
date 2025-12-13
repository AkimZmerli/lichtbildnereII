'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getHumanImages, getNonHumanImages, getExhibitionImages } from '@/features/gallery/services/galleryData'
import MasonryGallery from '@/features/gallery/components/MasonryGallery'
import { GalleryImage } from '@/types/gallery'
import LoadingSpinner from '@/shared/ui/LoadingSpinner'

export default function MasonryPage() {
  const searchParams = useSearchParams()
  const galleryType = searchParams.get('type') as 'human' | 'non-human' | 'exhibition'
  
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadImages = async () => {
      if (!galleryType) {
        setIsLoading(false)
        return
      }

      try {
        let galleryImages: GalleryImage[] = []
        
        switch (galleryType) {
          case 'human':
            galleryImages = await getHumanImages()
            break
          case 'non-human':
            galleryImages = await getNonHumanImages()
            break
          case 'exhibition':
            galleryImages = await getExhibitionImages()
            break
          default:
            galleryImages = []
        }
        
        setImages(galleryImages)
      } finally {
        setIsLoading(false)
      }
    }

    loadImages()
  }, [galleryType])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-grainy flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" showText={true} />
      </div>
    )
  }

  if (!galleryType || images.length === 0) {
    return (
      <div className="min-h-screen bg-grainy flex flex-col items-center justify-center">
        <div className="text-white-rose text-center">
          <h1 className="text-xl mb-4">Gallery not found</h1>
          <p className="text-white-rose/70">Please check the URL and try again.</p>
        </div>
      </div>
    )
  }

  // Determine titles and links based on gallery type
  const getGalleryTitle = () => {
    switch (galleryType) {
      case 'human':
        return 'HUMAN'
      case 'non-human':
        return 'NON HUMAN'
      case 'exhibition':
        return 'EXHIBITION'
      default:
        return ''
    }
  }

  const getAlternateGalleryLink = () => {
    switch (galleryType) {
      case 'human':
        return '/gallery/non-human'
      case 'non-human':
        return '/gallery/human'
      case 'exhibition':
        return '/about-exhibition#exhibition'
      default:
        return '/'
    }
  }

  return (
    <MasonryGallery
      images={images}
      title={getGalleryTitle()}
      type={galleryType}
      alternateGalleryLink={getAlternateGalleryLink()}
    />
  )
}