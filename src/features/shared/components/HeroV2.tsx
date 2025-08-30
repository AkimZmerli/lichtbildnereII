'use client'

import { useState, useEffect } from 'react'
import CinematicHeroV2 from './CinematicHeroV2'
import Works from './Works'
import SocialBook from '@/features/social-book/components/SocialBook'

interface HeroV2Props {
  imageUrl?: string
  altText?: string
}

export default function HeroV2({ 
  imageUrl = '/images/worksplaceholderI.jpg',
  altText = 'Hero image'
}: HeroV2Props) {
  const [heroReady, setHeroReady] = useState(false)

  // Listen for hero ready state
  useEffect(() => {
    const checkHeroReady = () => {
      const heroContainer = document.querySelector('[data-cinematic-hero-v2]')
      if (heroContainer) {
        // Add a small delay to ensure smooth transition
        setTimeout(() => setHeroReady(true), 500)
      }
    }

    // Check immediately and also listen for changes
    checkHeroReady()
    const interval = setInterval(checkHeroReady, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <CinematicHeroV2
        imageUrl={imageUrl}
        altText={altText}
        initialHeight={40}
        expandedHeight={70}
        showScrollIndicator={true}
      />
      
      {/* Content sections - only load when hero is ready */}
      {heroReady && (
        <>
          <Works />
          <SocialBook />
        </>
      )}
    </>
  )
}