'use client'

import { useState, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import GalleryImage from './GalleryImage'
import MasonryGallery from './MasonryGallery'
import Header from '../layout/Header'
import { GalleryProps } from './types/gallery'
import Footer from '../layout/Footer'

const MobileGallery = ({ images, title, alternateGalleryLink }: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showMasonryView, setShowMasonryView] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const minSwipeDistance = 50

  if (showMasonryView) {
    return <MasonryGallery images={images} title={title} />
  }

  return (
    <div className="min-h-screen bg-grainy flex flex-col">
      {/* Header */}
      <Header />

      {/* Gallery Content */}
      <div className=" flex flex-col">
        {/* Title */}
        <div className="">
          <h1 className="text-white-rose text-2xl tracking-[0.5em] mt-8 uppercase text-center">
            {title}
          </h1>
        </div>

        {/* Image Area */}
        <div className="flex items-center justify-center p-5">
          <div className="w-full bg-white-rose p-1">
            <div className="w-full h-64 bg-white flex items-center justify-center">
              Test Image Area
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 flex justify-between items-center">
          <span className="text-white-rose text-lg">1 / {images.length}</span>
          <div className="flex gap-4">
            <button className="text-white-rose p-4 rounded-full bg-black-almost/20">←</button>
            <button className="text-white-rose p-4 rounded-full bg-black-almost/20">→</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default MobileGallery
