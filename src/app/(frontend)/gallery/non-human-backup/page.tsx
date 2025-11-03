'use client'

import { useEffect, useState } from 'react'
import { getGalleryImages } from '@/features/gallery-management/services/galleryData'
import DesktopGallery from '@/features/gallery-management/components/DesktopGallery'
import MobileGallery from '@/features/gallery-management/components/MobileGallery'
import { GalleryImage } from '@/features/gallery-management/components/types/gallery'
import { useGalleryTracking } from '@/features/gallery-management/hooks/useGalleryTracking'
import LoadingSpinner from '@/features/shared/components/LoadingSpinner'

export default function NonHumanGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  
  // Track that this gallery has been viewed
  const { hasViewedBothMainGalleries: _hasViewedBothMainGalleries } = useGalleryTracking('non-human')
  
  // Always start with human to avoid hydration mismatch
  // The component itself will handle the logic internally
  const alternateLink = '/gallery/human'

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
    <MobileGallery images={images} title="Non-Human" alternateGalleryLink={alternateLink} galleryType="non-human" />
  ) : (
    <DesktopGallery images={images} title="Non-Human" alternateGalleryLink={alternateLink} galleryType="non-human" />
  )
}
