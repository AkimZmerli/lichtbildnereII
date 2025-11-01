'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/features/shared/components/Header'
import Footer from '@/features/shared/components/Footer'
import ImagePopup from '@/features/shared/components/ImagePopup'
import { MasonryGalleryProps } from './types/gallery'
import { createSmoothLink } from '@/features/shared/utils/smoothNavigation'

interface ExtendedMasonryGalleryProps extends Omit<MasonryGalleryProps, 'title'> {
  title?: string
  type?: 'human' | 'non-human' | 'inverted'
  alternateGalleryLink?: string
  onBack?: () => void
}

const MasonryGallery = ({
  images,
  title,
  type,
  alternateGalleryLink,
  onBack: _onBack,
}: ExtendedMasonryGalleryProps) => {
  // Determine display title based on type
  const displayTitle = type === 'inverted' ? 'INVERTED' : (title || (type === 'human' ? 'HUMAN' : 'NON-HUMAN'))
  const alternateTitle = type === 'human' ? 'non-human' : (type === 'non-human' ? 'human' : '')
  
  const [popupState, setPopupState] = useState({
    isOpen: false,
    src: '',
    alt: '',
  })

  const openPopup = (imageIndex: number) => {
    const image = images[imageIndex]
    setPopupState({
      isOpen: true,
      src: image.url,
      alt: image.alt,
    })
  }

  const closePopup = () => {
    setPopupState({
      isOpen: false,
      src: '',
      alt: '',
    })
  }

  return (
    <div className="min-h-screen bg-grainy flex flex-col">
      <Header />

      <div className="flex-1 p-6 pt-24"> {/* Increased padding to prevent header cropping */}
        {/* Header with gallery switch button */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-white-rose text-2xl tracking-[0.5em] uppercase">{displayTitle}</h2>

          <Link
            href={alternateGalleryLink || `/gallery/${type === 'human' ? 'non-human' : 'human'}`}
            onClick={createSmoothLink(alternateGalleryLink || `/gallery/${type === 'human' ? 'non-human' : 'human'}`)}
            className="group inline-flex items-center gap-2 px-4 py-2 text-hot-pink hover:text-white-rose hover:scale-105 active:scale-95 transition-all duration-300 ease-out text-sm font-light tracking-wider uppercase"
          >
            <span>
              {alternateGalleryLink?.includes('socialbook') 
                ? 'Social Book'
                : alternateGalleryLink?.includes('inverted') 
                  ? 'Inverted' 
                  : alternateTitle}
            </span>
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>

        {/* Masonry Grid */}
        <motion.div
          className="columns-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {images.map((image, index) => (
            <motion.div
              key={`${image.url}-${index}`}
              className="mb-4 break-inside-avoid"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: index * 0.05,
                duration: 0.4,
                ease: 'easeOut',
              }}
            >
              <div 
                className="relative overflow-hidden rounded-sm bg-neutral-800 cursor-pointer"
                onClick={() => openPopup(index)}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={image.width || 400}
                  height={image.height || 400}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      <Footer />
      
      {/* Image Popup */}
      <ImagePopup
        src={popupState.src}
        alt={popupState.alt}
        isOpen={popupState.isOpen}
        onClose={closePopup}
      />
    </div>
  )
}

export default MasonryGallery
