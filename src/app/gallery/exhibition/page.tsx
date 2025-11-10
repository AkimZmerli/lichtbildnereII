'use client'

import { useEffect, useState } from 'react'
import { getExhibitionImages } from '@/features/exhibition/services/getExhibitionImages'
import DesktopGallery from '@/features/gallery/components/DesktopGallery'
import MobileGallery from '@/features/gallery/components/MobileGallery'
import { GalleryImage } from '@/types/gallery'
import LoadingSpinner from '@/shared/ui/LoadingSpinner'

export default function ExhibitionGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  
  // Link back to exhibition section
  const alternateLink = '/about-exhibition#exhibition'

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
    }

    // Initial check
    checkMobile()

    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkMobile, 100)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    const loadImages = async () => {
      const exhibitionImages = await getExhibitionImages()
      setImages(exhibitionImages)
    }
    loadImages()
  }, [])

  // Show loading state until we determine device type
  if (isMobile === null) {
    return (
      <div className="min-h-screen bg-grainy flex flex-col items-center justify-center">
        <LoadingSpinner size="md" showText={true} />
      </div>
    )
  }

  return isMobile ? (
    <MobileGallery 
      images={images} 
      title="exhibitions" 
      alternateGalleryLink={alternateLink} 
      galleryType="exhibition" 
    />
  ) : (
    <DesktopGallery 
      images={images} 
      title="exhibitions" 
      alternateGalleryLink={alternateLink} 
      galleryType="exhibition" 
    />
  )
}