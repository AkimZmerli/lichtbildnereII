'use client'

import { useEffect, useState } from 'react'
import { getGalleryImages } from '@/features/gallery-management/services/galleryData'
import DesktopGallery from '@/features/gallery-management/components/DesktopGallery'
import MobileGallery from '@/features/gallery-management/components/MobileGallery'
import { GalleryImage } from '@/features/gallery-management/components/types/gallery'
import { useGalleryTracking } from '@/features/gallery-management/hooks/useGalleryTracking'

export default function InvertedGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
  })
  
  // Track that this gallery has been viewed
  const { hasViewedBothMainGalleries } = useGalleryTracking('inverted')
  
  // After inverted gallery, go to social book page directly
  const handleSocialBookNavigation = () => {
    window.location.href = '/socialbook'
  }
  
  const alternateLink = '/socialbook'

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
    }

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
      const galleryImages = await getGalleryImages('inverted')
      setImages(galleryImages)
    }
    loadImages()
  }, [])

  return isMobile ? (
    <MobileGallery images={images} title="Inverted" alternateGalleryLink={alternateLink} galleryType="inverted" />
  ) : (
    <DesktopGallery images={images} title="Inverted" alternateGalleryLink={alternateLink} galleryType="inverted" />
  )
}