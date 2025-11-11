'use client'

import { useEffect } from 'react'
import CinematicHeroScroll from './CinematicHeroScroll'

interface ClientHeroProps {
  mobileUrl: string
  desktopUrl: string
  altText: string
  title?: string
  subtitle?: string
}

export default function ClientHero({
  mobileUrl,
  desktopUrl,
  altText,
  title,
  subtitle,
}: ClientHeroProps) {
  // Remove JavaScript-based image switching - let CSS handle it
  // const [imageUrl, setImageUrl] = useState(desktopUrl)

  useEffect(() => {
    // Remove image switching logic - handled by CSS now
    // const checkViewport = () => {
    //   if (window.innerWidth < 768) {
    //     setImageUrl(mobileUrl)
    //   } else {
    //     setImageUrl(desktopUrl)
    //   }
    // }
    //
    // checkViewport()
    // window.addEventListener('resize', checkViewport)

    // Check if we're coming from an internal navigation (like from Works link)
    const shouldScrollToWorks = sessionStorage.getItem('scrollToWorks') === 'true'
    
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

    // Remove resize listener cleanup - no longer needed
    // return () => window.removeEventListener('resize', checkViewport)
  }, [])

  return (
    <CinematicHeroScroll
      mobileUrl={mobileUrl}
      desktopUrl={desktopUrl}
      altText={altText}
      title={title}
      subtitle={subtitle}
      showScrollIndicator={true}
    />
  )
}
