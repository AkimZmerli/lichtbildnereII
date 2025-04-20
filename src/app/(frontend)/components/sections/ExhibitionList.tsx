'use client'
import { useState } from 'react'
import type { Slide } from '../services/hero/getSlides'

export default function ExhibitionList({ slides }: { slides: Slide[] }) {
  return (
    <div className="space-y-0.5">
      {slides.map((slide) => (
        <ExhibitionItem key={slide.id} slides={slide} />
      ))}
    </div>
  )
}

function ExhibitionItem({ slides }: { slides: Slide }) {
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
          <div className="text-sm text-neutral-400">{slides.content}</div>
        </div>
      )}
    </div>
  )
}
