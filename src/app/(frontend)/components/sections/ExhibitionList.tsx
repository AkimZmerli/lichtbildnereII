'use client'
import { useState } from 'react'
import Image from 'next/image'
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
  // If content is null or undefined, return empty string
  if (!content) return ''

  // If content is already a string, return it
  if (typeof content === 'string') return content

  // If content is a rich text object from Payload (with root property)
  if (content.root && typeof content.root === 'object') {
    // For simple display, just extract text content
    // This is a simplified approach - for proper rich text rendering,
    // you would need a rich text renderer component
    return 'Rich text content - please add a rich text renderer'
  }

  // Fallback - convert to string
  return JSON.stringify(content)
}

export default function ExhibitionList({ slides }: { slides: Slide[] }) {
  return (
    <div className="space-y-0.5">
      {slides.map((slide) => (
        <ExhibitionItem key={slide.id} slides={slide as SlideWithImages} />
      ))}
    </div>
  )
}

function ExhibitionItem({ slides }: { slides: SlideWithImages }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border-t border-neutral-700 last:border-b">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-6 px-4 flex items-center justify-between hover:bg-neutral-900/50 transition-colors"
      >
        <span className="text-sm">{slides.label}</span>
        <svg
          className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-6">
          <div className="text-sm text-neutral-400 mb-4">{renderContent(slides.content)}</div>

          {/* Thumbnail gallery - displays images from Payload backend */}
          {slides.images && slides.images.length > 0 && (
            <div className="flex flex-row gap-4 mt-4 overflow-x-auto">
              {slides.images.map((imageItem, index) => {
                // Handle the case where the image might be in a nested structure
                // This is common with Payload's relationship fields
                // Use type assertion to tell TypeScript about the possible structure
                const imageData = imageItem as unknown as {
                  image?: { url: string; alt: string; id: string }
                }
                const image = imageData.image || imageItem
                const imageUrl = image?.url || ''
                const imageAlt = image?.alt || 'Exhibition image'

                return (
                  <div key={image?.id || index} className="flex-shrink-0">
                    <Image
                      src={
                        imageUrl.startsWith('/')
                          ? `${process.env.NEXT_PUBLIC_SERVER_URL}${imageUrl}`
                          : imageUrl
                      }
                      alt={imageAlt}
                      width={150}
                      height={100}
                      className="object-cover rounded-sm hover:opacity-90 transition-opacity"
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
