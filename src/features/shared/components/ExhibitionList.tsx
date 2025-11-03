'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import ExhibitionModal from './ExhibitionModal'
import type { Slide } from '../services/hero/getSlides'

interface SlideWithImages extends Slide {
  images?: {
    url: string
    alt: string
    id: string
  }[]
}


// Smooth easing curves
const easing = [0.25, 0.1, 0.25, 1]
const smoothEasing = [0.4, 0, 0.2, 1]

export default function ExhibitionList({ slides }: { slides: Slide[] }) {
  const [exhibitionModalState, setExhibitionModalState] = useState({
    isOpen: false,
    images: [] as { url: string; alt: string; id: string }[],
    exhibitionTitle: '',
  })

  const openExhibitionModal = (
    images: { url: string; alt: string; id: string }[],
    title: string
  ) => {
    setExhibitionModalState({
      isOpen: true,
      images,
      exhibitionTitle: title,
    })
  }

  const closeExhibitionModal = () => {
    setExhibitionModalState(prev => ({ ...prev, isOpen: false }))
  }

  return (
    <>
      <div className="space-y-0.5">
        {slides.map((slide, index) => (
          <ExhibitionItem
            key={slide.id}
            slides={slide as SlideWithImages}
            index={index}
            onExhibitionClick={openExhibitionModal}
          />
        ))}
        {/* Special Interactive Exhibition Item */}
        <TankstelleExhibition index={slides.length} />
      </div>

      {/* Exhibition Modal */}
      <ExhibitionModal
        isOpen={exhibitionModalState.isOpen}
        onClose={closeExhibitionModal}
        images={exhibitionModalState.images}
        exhibitionTitle={exhibitionModalState.exhibitionTitle}
      />
    </>
  )
}

function ExhibitionItem({
  slides,
  index,
  onExhibitionClick,
}: {
  slides: SlideWithImages
  index: number
  onExhibitionClick: (images: { url: string; alt: string; id: string }[], title: string) => void
}) {
  // Prepare images for modal
  const preparedImages =
    slides.images?.map((imageItem) => {
      const imageData = imageItem as unknown as {
        image?: { url: string; alt: string; id: string }
      }
      const image = imageData.image || imageItem
      return {
        url: image?.url || '',
        alt: image?.alt || 'Exhibition image',
        id: image?.id || Math.random().toString(),
      }
    }) || []

  const handleClick = () => {
    if (preparedImages.length > 0) {
      onExhibitionClick(preparedImages, slides.label)
    }
  }

  return (
    <motion.div
      className="border-t border-neutral-700 last:border-b"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: smoothEasing,
      }}
    >
      <button
        onClick={handleClick}
        className="w-full py-6 px-4 flex items-center justify-between hover:bg-neutral-900/30 hover:scale-[1.02] transition-all duration-300 ease-out group transform-gpu"
        disabled={preparedImages.length === 0}
      >
        <span className="text-sm transition-transform duration-200 ease-out">
          {slides.label}
        </span>

        <svg
          className="w-4 h-4 text-neutral-500 group-hover:text-white-rose transition-colors duration-200"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </motion.div>
  )
}

function TankstelleExhibition({ index }: { index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      className="border-t border-neutral-700 last:border-b"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: smoothEasing,
      }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-6 px-4 flex items-center justify-between hover:bg-neutral-900/30 hover:scale-[1.02] transition-all duration-300 ease-out group transform-gpu"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm transition-transform duration-200 ease-out">
            Projektraum
          </span>
          {/* Interactive 3D Badge */}
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs bg-hot-pink/20 text-hot-pink rounded-full">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <span>Interactive 3D</span>
          </span>
        </div>

        <motion.svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{
            rotate: isExpanded ? 180 : 0,
          }}
          transition={{ duration: 0.3, ease: easing }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{
              duration: 0.4,
              ease: easing,
            }}
          >
            <motion.div
              className="px-4 pb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.1,
              }}
            >
              <div className="text-sm text-neutral-400 mb-4">
                Explore an interactive 3D scan of my first exhibition at Tankstelle. Navigate
                through the gallery as if you were there.
              </div>

              {/* Visit Exhibition Button */}
              <Link
                href="/tankstelle"
                className="inline-block text-hot-pink hover:underline underline-offset-4 transition-all duration-200 hover:translate-y-[-2px]"
              >
                visit exhibition ↗
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
