'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import ImageSlideshow from './ImagesSlideshow'
import type { Slide } from '../services/hero/getSlides'

interface SlideWithImages extends Slide {
  images?: {
    url: string
    alt: string
    id: string
  }[]
}

// Helper function to safely render content that might be a rich text object
const renderContent = (content: any) => {
  if (!content) return ''
  if (typeof content === 'string') return content
  if (content.root && typeof content.root === 'object') {
    return 'Rich text content - please add a rich text renderer'
  }
  return JSON.stringify(content)
}

// Smooth easing curves
const easing = [0.25, 0.1, 0.25, 1]
const smoothEasing = [0.4, 0, 0.2, 1]

export default function ExhibitionList({ slides }: { slides: Slide[] }) {
  const [slideshowState, setSlideshowState] = useState({
    isOpen: false,
    images: [] as { url: string; alt: string; id: string }[],
    initialIndex: 0,
  })

  const openSlideshow = (
    images: { url: string; alt: string; id: string }[],
    startIndex: number,
  ) => {
    setSlideshowState({
      isOpen: true,
      images,
      initialIndex: startIndex,
    })
  }

  const closeSlideshow = () => {
    setSlideshowState((prev) => ({ ...prev, isOpen: false }))
  }

  return (
    <>
      <div className="space-y-0.5">
        {slides.map((slide, index) => (
          <ExhibitionItem
            key={slide.id}
            slides={slide as SlideWithImages}
            index={index}
            onImageClick={openSlideshow}
          />
        ))}
      </div>

      {/* Slideshow Modal */}
      <ImageSlideshow
        images={slideshowState.images}
        isOpen={slideshowState.isOpen}
        onClose={closeSlideshow}
        initialIndex={slideshowState.initialIndex}
      />
    </>
  )
}

function ExhibitionItem({
  slides,
  index,
  onImageClick,
}: {
  slides: SlideWithImages
  index: number
  onImageClick: (images: { url: string; alt: string; id: string }[], startIndex: number) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Prepare images for slideshow
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

  const handleImageClick = (clickedIndex: number) => {
    onImageClick(preparedImages, clickedIndex)
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
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-6 px-4 flex items-center justify-between hover:bg-neutral-900/30 transition-colors duration-200 group"
      >
        <span className="text-sm group-hover:translate-x-1 transition-transform duration-200 ease-out">
          {slides.label}
        </span>

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
              <div className="text-sm text-neutral-400 mb-4">{renderContent(slides.content)}</div>

              {/* Clickable Image gallery */}
              {slides.images && slides.images.length > 0 && (
                <div className="flex flex-row gap-4 mt-4 overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent">
                  {slides.images.map((imageItem, imageIndex) => {
                    const imageData = imageItem as unknown as {
                      image?: { url: string; alt: string; id: string }
                    }
                    const image = imageData.image || imageItem
                    const imageUrl = image?.url || ''
                    const imageAlt = image?.alt || 'Exhibition image'

                    return (
                      <motion.div
                        key={image?.id || imageIndex}
                        className="flex-shrink-0"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: imageIndex * 0.05,
                          ease: smoothEasing,
                        }}
                      >
                        <button
                          onClick={() => handleImageClick(imageIndex)}
                          className="relative overflow-hidden rounded-sm group/img cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
                        >
                          <Image
                            src={
                              imageUrl.startsWith('/')
                                ? `${process.env.NEXT_PUBLIC_SERVER_URL}${imageUrl}`
                                : imageUrl
                            }
                            alt={imageAlt}
                            width={150}
                            height={100}
                            className="object-cover transition-all duration-300 ease-out group-hover/img:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" />

                          {/* Click indicator */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-300">
                            <div className="bg-black/50 rounded-full p-2">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                              </svg>
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
