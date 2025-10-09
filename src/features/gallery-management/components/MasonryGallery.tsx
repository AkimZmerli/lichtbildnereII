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
  onBack,
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

      <div className="flex-1 p-6 pt-20"> {/* Added pt-20 to account for fixed header */}
        {/* Header with gallery switch button */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-white-rose text-2xl tracking-[0.5em] uppercase">{displayTitle}</h2>

          <Link
            href={alternateGalleryLink || `/gallery/${type === 'human' ? 'non-human' : 'human'}`}
            onClick={createSmoothLink(alternateGalleryLink || `/gallery/${type === 'human' ? 'non-human' : 'human'}`)}
            className="flex items-center gap-2 text-hot-pink hover:text-white-rose transition-colors text-sm"
          >
            {alternateGalleryLink?.includes('#social-book') ? (
              <>
                <span>Social Book</span>
                <span className="text-base">→</span>
              </>
            ) : (
              <>
                <span className="text-base">⇄</span>
                <span>{alternateGalleryLink?.includes('inverted') ? 'Inverted' : alternateTitle}</span>
              </>
            )}
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
