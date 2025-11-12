'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { getGalleryImages } from '@/features/gallery/services/galleryData'
import DesktopGallery from '@/features/gallery/components/DesktopGallery'
import MobileGallery from '@/features/gallery/components/MobileGallery'
import { GalleryImage } from '@/types/gallery'
import { useGalleryTracking } from '@/features/gallery/hooks/useGalleryTracking'
import LoadingSpinner from '@/shared/ui/LoadingSpinner'

export default function HumanGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null)
  
  // Track that this gallery has been viewed
  const { hasViewedBothMainGalleries: _hasViewedBothMainGalleries } = useGalleryTracking('human')

  const checkMobile = useCallback(() => {
    const width = window.innerWidth
    setIsMobile(width < 768)
  }, [])

  const handleResize = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
    }
    timeoutIdRef.current = setTimeout(checkMobile, 100)
  }, [checkMobile])

  useEffect(() => {
    // Initial check
    checkMobile()

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current)
        timeoutIdRef.current = null
      }
    }
  }, [checkMobile, handleResize])

  useEffect(() => {
    const loadImages = async () => {
      const galleryImages = await getGalleryImages('human')
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
    <MobileGallery images={images} title="Human" galleryType="human" />
  ) : (
    <DesktopGallery images={images} title="Human" galleryType="human" />
  )
}
