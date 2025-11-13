'use client'

import { useEffect, useState } from 'react'
import { getGalleryImages } from '@/features/gallery/services/galleryData'
import DesktopGallery from '@/features/gallery/components/DesktopGallery'
import MobileGallery from '@/features/gallery/components/MobileGallery'
import { GalleryImage } from '@/types/gallery'
import LoadingSpinner from '@/shared/ui/LoadingSpinner'

export default function NonHumanGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  

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
      const galleryImages = await getGalleryImages('non-human')
      setImages(galleryImages)
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
      title="Non Human" 
      galleryType="non-human" 
    />
  ) : (
    <DesktopGallery 
      images={images} 
      title="Non Human" 
      galleryType="non-human" 
    />
  )
}