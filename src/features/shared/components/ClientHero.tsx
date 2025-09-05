'use client'

import { useEffect, useState } from 'react'
import CinematicHero from './CinematicHero'

interface ClientHeroProps {
  mobileUrl: string
  desktopUrl: string
  altText: string
  title?: string
  subtitle?: string
  videoUrl?: string
}

export default function ClientHero({
  mobileUrl,
  desktopUrl,
  altText,
  title,
  subtitle,
  videoUrl,
}: ClientHeroProps) {
  const [shouldSkipAnimation, setShouldSkipAnimation] = useState(false)

  useEffect(() => {
    // Check if the user has already seen the animation
    const hasSeenAnimation = localStorage.getItem('hero-animation-viewed') === 'true'
    
    // Check if we're coming from an internal navigation (like from Works link)
    const isInternalNavigation = sessionStorage.getItem('skipHeroAnimation') === 'true'
    const shouldScrollToWorks = sessionStorage.getItem('scrollToWorks') === 'true'
    
    // Only skip if coming from internal navigation, not for returning visitors
    if (isInternalNavigation) {
      setShouldSkipAnimation(true)
      // Clear the session flag after using it
      sessionStorage.removeItem('skipHeroAnimation')
    }
    
    // Handle scroll to works after page load
    if (shouldScrollToWorks) {
      sessionStorage.removeItem('scrollToWorks')
      
      // Wait for the page to fully render
      setTimeout(() => {
        // First ensure we're at the top to see the hero
        window.scrollTo({ top: 0, behavior: 'instant' })
        
        // Then smoothly scroll to the works section
        setTimeout(() => {
          const worksElement = document.querySelector('#works')
          if (worksElement) {
            worksElement.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            })
          }
        }, 500) // Brief pause to show hero before scrolling
      }, 100)
    }
    
    // Also check for hash in URL on initial load
    if (window.location.hash === '#works' && !shouldScrollToWorks) {
      // Delay to ensure DOM is ready
      setTimeout(() => {
        const worksElement = document.querySelector('#works')
        if (worksElement) {
          worksElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          })
        }
      }, 1000)
    }
  }, [])

  return (
    <CinematicHero
      mobileUrl={mobileUrl}
      desktopUrl={desktopUrl}
      altText={altText}
      title={title}
      subtitle={subtitle}
      videoUrl={videoUrl}
      initialViewportHeight="45vh"
      initialViewportWidth="80%"
      scrollFactor={1.2}
      // Start with allowSkip false - the component will automatically
      // toggle this to true after animation completes
      allowSkip={false}
      storageKey="hero-animation-viewed"
    />
  )
}
