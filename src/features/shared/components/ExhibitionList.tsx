'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
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
  return (
    <div className="space-y-0.5">
      {slides.map((slide, index) => (
        <ExhibitionItem
          key={slide.id}
          slides={slide as SlideWithImages}
          index={index}
        />
      ))}
      {/* Exhibition Gallery Link */}
      <ExhibitionGalleryLink index={slides.length} />
      
      {/* Special Interactive Exhibition Item */}
      <TankstelleExhibition index={slides.length + 1} />
    </div>
  )
}

function ExhibitionItem({
  slides,
  index,
}: {
  slides: SlideWithImages
  index: number
}) {
  // Parse the label into components for better mobile formatting
  const parseLabel = (label: string) => {
    const parts = label.split(' • ')
    return {
      year: parts[0],
      title: parts[1],
      venue: parts[2],
      type: parts[3]
    }
  }

  const { year, title, venue, type } = parseLabel(slides.label)

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
      <div className="w-full py-6 px-4">
        {/* Desktop: Show full label on one line */}
        <span className="hidden md:block text-sm">{slides.label}</span>
        
        {/* Mobile: Show formatted multi-line layout */}
        <div className="md:hidden text-sm space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-neutral-300">{year}</span>
            <span className="text-neutral-500">•</span>
            <span className="font-medium">{title}</span>
          </div>
          <div className="text-neutral-400 text-xs leading-relaxed">
            {venue} • {type}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ExhibitionGalleryLink({ index }: { index: number }) {
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
        className="w-full py-6 px-4 flex items-center justify-between hover:bg-neutral-900/30 hover:translate-x-2 transition-all duration-300 ease-out group transform-gpu"
      >
        <span className="text-sm transition-transform duration-200 ease-out">
          Exhibition Gallery
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
              <div className="text-sm text-neutral-400 mb-4">
                Browse through all exhibition works in a curated gallery view.
              </div>

              {/* Visit Gallery Button */}
              <Link
                href="/gallery/exhibition"
                className="inline-block text-hot-pink hover:underline underline-offset-4 transition-all duration-200 hover:translate-y-[-2px]"
              >
                visit exhibition gallery ↗
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
        className="w-full py-6 px-4 flex items-center justify-between hover:bg-neutral-900/30 hover:translate-x-2 transition-all duration-300 ease-out group transform-gpu"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm transition-transform duration-200 ease-out">
            Tankstelle Projektraum
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
