import { useState, useEffect } from 'react'
import { GalleryProps } from '../../types/gallery'
import MobileGallery from './MobileGallery'
import DesktopGallery from './DesktopGallery'

const GalleryView = ({ images, title }: GalleryProps) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile ? (
    <MobileGallery images={images} title={title} />
  ) : (
    <DesktopGallery images={images} title={title} />
  )
}

export default GalleryView
