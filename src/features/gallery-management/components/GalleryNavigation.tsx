'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { GalleryType } from './types/gallery'
import HeaderDesktop from '@/features/shared/components/HeaderDesktop'
import { useGalleryTracking } from '../hooks/useGalleryTracking'

interface GalleryNavigationProps {
  type: GalleryType
}

const GalleryNavigation = ({ type }: GalleryNavigationProps) => {
  const router = useRouter()
  const { hasViewedBothMainGalleries, hasViewedAllGalleries } = useGalleryTracking(type)
  
  // Redirect to socialbook if viewing inverted and all galleries have been seen
  useEffect(() => {
    if (type === 'inverted' && hasViewedAllGalleries()) {
      // Small delay to let the page render before redirecting
      const timer = setTimeout(() => {
        router.push('/socialbook')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [type, hasViewedAllGalleries, router])

  // Helper function to get viewed galleries
  const getViewedGalleries = (): string[] => {
    if (typeof window === 'undefined') return []
    return JSON.parse(sessionStorage.getItem('viewedGalleries') || '[]')
  }

  // Determine title based on gallery type
  let title = 'H U M A N'
  if (type === 'non-human') title = 'N O N   H U M A N'
  if (type === 'inverted') title = 'I N V E R T E D'

  // Determine next link based on current gallery and viewing history
  let nextLink = '/gallery/human'
  let nextText = 'human'
  
  if (type === 'human') {
    // Check if user has seen non-human already
    const viewed = getViewedGalleries()
    if (viewed.includes('non-human')) {
      // Both seen, go to inverted
      nextLink = '/gallery/inverted'
      nextText = 'inverted'
    } else {
      // Haven't seen non-human yet
      nextLink = '/gallery/non-human'
      nextText = 'non-human'
    }
  } else if (type === 'non-human') {
    // Check if user has seen human already
    const viewed = getViewedGalleries()
    if (viewed.includes('human')) {
      // Both seen, go to inverted
      nextLink = '/gallery/inverted'
      nextText = 'inverted'
    } else {
      // Haven't seen human yet
      nextLink = '/gallery/human'
      nextText = 'human'
    }
  } else if (type === 'inverted') {
    nextLink = '/socialbook'
    nextText = 'social book'
  }

  return (
    <div className="fixed top-0 w-full z-20 bg-grainy backdrop-blur-sm">
      <HeaderDesktop />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-white-rose text-4xl tracking-[0.5em] mb-6">{title}</h1>
            <p className="text-white-rose text-lg font-light">Scroll down to explore the gallery</p>
          </div>
          <Link
            href={nextLink}
            className="group inline-flex items-center gap-3 bg-black-almost/60 backdrop-blur-md px-5 py-2.5 rounded-full text-hot-pink hover:text-white-rose hover:bg-hot-pink/20 hover:scale-105 hover:shadow-hot-pink/20 active:scale-95 transition-all duration-300 ease-out border border-hot-pink/40 hover:border-hot-pink shadow-lg shadow-hot-pink/10 focus:outline-none focus:ring-2 focus:ring-hot-pink/50 focus:ring-offset-2 focus:ring-offset-black-almost whitespace-nowrap"
          >
            <span className="font-light tracking-wider uppercase text-sm">View {nextText}</span>
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" 
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
      </div>
    </div>
  )
}

export default GalleryNavigation
