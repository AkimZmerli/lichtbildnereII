'use client'
import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/shared/layout/Header'
import Footer from '@/shared/layout/Footer'
import ImagePopup from '@/shared/ui/ImagePopup'
import LoadingSpinner from '@/shared/ui/LoadingSpinner'
import { MasonryGalleryProps } from '@/types/gallery'
import { createSmoothLink } from '@/shared/utils/smoothNavigation'

interface ExtendedMasonryGalleryProps extends Omit<MasonryGalleryProps, 'title'> {
  title?: string
  type?: 'human' | 'non-human' | 'exhibition'
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
  const displayTitle = title || (type === 'human' ? 'HUMAN' : 'NON HUMAN')
  const alternateTitle = type === 'human' ? 'NON HUMAN' : type === 'non-human' ? 'HUMAN' : ''

  const [popupState, setPopupState] = useState({
    isOpen: false,
    src: '',
    alt: '',
  })

  // Track loading state for each image
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())

  const openPopup = (imageIndex: number) => {
    const image = images[imageIndex]
    setPopupState({
      isOpen: true,
      src: image.url,
      alt: image.alt || '',
    })
  }

  const closePopup = () => {
    setPopupState({
      isOpen: false,
      src: '',
      alt: '',
    })
  }

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set(prev).add(index))
  }

  // Determine the go back link based on gallery type
  const getGoBackLink = () => {
    if (type === 'exhibition') {
      return '/about-exhibition#exhibition'
    }
    return '/works'
  }

  return (
    <div className="min-h-screen bg-grainy flex flex-col">
      <Header />

      <div className="flex-1 p-6 pt-24">
        {' '}
        {/* Increased padding to prevent header cropping */}
        {/* Header with gallery switch button */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <h2 className="text-white-rose text-xl md:text-2xl tracking-[0.3em] md:tracking-[0.5em] uppercase max-w-[55%] leading-tight">
            {displayTitle}
          </h2>

          <Link
            href={getGoBackLink()}
            onClick={createSmoothLink(getGoBackLink())}
            className="group inline-flex items-center px-4 py-2 text-hot-pink hover:text-white-rose hover:scale-105 active:scale-95 transition-all duration-300 ease-out text-sm font-light tracking-wider uppercase whitespace-nowrap"
          >
            <span className="flex items-center gap-1">
              Go Back ↗
            </span>
          </Link>
        </div>
        {/* Loading Spinner removed - images load progressively */}
        <div className="columns-2 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={`${image.url}-${index}`}
              className="mb-4 break-inside-avoid"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '50px' }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="relative overflow-hidden rounded-sm bg-neutral-800 cursor-pointer"
                onClick={() => openPopup(index)}
              >
                {!loadedImages.has(index) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 z-10">
                    <LoadingSpinner size="sm" />
                  </div>
                )}
                <Image
                  src={image.url}
                  alt={image.alt || ''}
                  width={image.width || 400}
                  height={image.height || 400}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 768px) 50vw, 33vw"
                  priority={index < 4}
                  onLoad={() => handleImageLoad(index)}
                />
              </div>
            </motion.div>
          ))}
        </div>
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
