'use client'

import { useEffect, useState } from 'react'
import { getGalleryImages } from '@/features/gallery-management/services/galleryData'
import DesktopGallery from '@/features/gallery-management/components/DesktopGallery'
import MobileGallery from '@/features/gallery-management/components/MobileGallery'
import { GalleryImage } from '@/features/gallery-management/components/types/gallery'

export default function HumanGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 768
  })

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
      const galleryImages = await getGalleryImages('human')
      setImages(galleryImages)
    }
    loadImages()
  }, [])

  return isMobile ? (
    <MobileGallery images={images} title="Human" alternateGalleryLink="/gallery/non-human" />
  ) : (
    <DesktopGallery images={images} title="Human" alternateGalleryLink="/gallery/non-human" />
  )
}
