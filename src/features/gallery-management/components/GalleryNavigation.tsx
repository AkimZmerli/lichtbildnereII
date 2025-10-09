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
        router.push('/socialbook#social-book')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [type, hasViewedAllGalleries, router])

  // Determine title based on gallery type
  let title = 'H U M A N'
  if (type === 'non human') title = 'N O N   H U M A N'
  if (type === 'inverted') title = 'I N V E R T E D'

  // Determine next link based on current gallery and viewing history
  let nextLink = '/gallery/human'
  let nextText = 'human'
  
  if (type === 'human') {
    nextLink = '/gallery/non-human'
    nextText = 'non-human'
  } else if (type === 'non human') {
    // If both main galleries have been viewed, show inverted
    if (hasViewedBothMainGalleries()) {
      nextLink = '/gallery/inverted'
      nextText = 'inverted'
    } else {
      nextLink = '/gallery/human'
      nextText = 'human'
    }
  } else if (type === 'inverted') {
    nextLink = '/socialbook#social-book'
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
            className="text-hot-pink hover:text-white-rose transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            View {nextText}
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GalleryNavigation
