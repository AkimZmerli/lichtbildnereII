'use client'

import { useEffect, useState } from 'react'
import { getGalleryImages } from '../../lib/galleryData'
import DesktopGallery from '../../components/galleries/DesktopGallery'
import GalleryNavigation from '../../components/galleries/GalleryNavigation'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { GalleryImage } from '../../components/galleries/types/gallery'

export default function NonHumanGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])

  useEffect(() => {
    const loadImages = async () => {
      const galleryImages = await getGalleryImages('non-human')
      setImages(galleryImages)
    }
    loadImages()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-grainy">
      <Header />
      <main className="flex-grow">
        <GalleryNavigation type="non-human" />
        <DesktopGallery images={images} />
      </main>
      <Footer />
    </div>
  )
}
