'use client'

import { useEffect, useState } from 'react'
import { getGalleryImages } from '../../lib/galleryData'
import GalleryView from '../../components/galleries/GalleryView'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { GalleryImage } from '../../types/gallery'

export default function HumanGallery() {
  const [images, setImages] = useState<GalleryImage[]>([])

  useEffect(() => {
    const loadImages = async () => {
      const galleryImages = await getGalleryImages('human')
      setImages(galleryImages)
    }
    loadImages()
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-grainy">
      <Header />
      <main className="flex-grow my-12">
        <GalleryView images={images} title="HUMAN" />
      </main>
      <Footer />
    </div>
  )
}
