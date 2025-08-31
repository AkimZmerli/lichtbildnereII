'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function ScrollHandler() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Function to handle the scrolling
    const handleScroll = () => {
      // Check if there's a cinematic hero on the page that should be respected
      const cinematicHero = document.querySelector('[data-cinematic-hero]')
      if (cinematicHero) {
        // Don't interfere with cinematic hero animations on initial load
        console.log('CinematicHero detected, skipping automatic scroll handling')
        return
      }

      // Check if there's a hash in the URL
      const hash = window.location.hash

      // Check if there's a stored scroll target in sessionStorage
      const storedTarget = sessionStorage.getItem('scrollTarget')

      // Check if we're coming from the home page
      const fromHomePage = sessionStorage.getItem('fromHomePage')

      // Determine which target to use (URL hash takes precedence)
      const scrollTarget = hash || storedTarget

      if (scrollTarget) {
        // Clear the stored targets
        sessionStorage.removeItem('scrollTarget')
        sessionStorage.removeItem('fromHomePage')

        // Add a longer delay for cross-page navigation to ensure the page has fully loaded
        // Use an even longer delay if coming from the home page
        const delay = fromHomePage ? 1000 : 700

        console.log(`Scrolling to ${scrollTarget} with delay ${delay}ms`)

        const timer = setTimeout(() => {
          // Try to find the element by ID
          let targetElement = document.querySelector(scrollTarget)

          // Special handling for about and exhibition sections
          if (!targetElement && scrollTarget === '#about') {
            targetElement =
              document.getElementById('about') || document.querySelector('section#about')
            console.log('Using special selector for about section:', targetElement)
          }

          if (!targetElement && scrollTarget === '#exhibition') {
            targetElement =
              document.getElementById('exhibition') || document.querySelector('section#exhibition')
            console.log('Using special selector for exhibition section:', targetElement)
          }

          if (targetElement) {
            console.log('Found element, scrolling to:', scrollTarget)
            targetElement.scrollIntoView({ behavior: 'smooth' })
          } else {
            console.log('Target element not found:', scrollTarget)

            // If element not found, try again after a short delay
            // This helps with elements that might be rendered dynamically
            setTimeout(() => {
              // Try with multiple selector approaches
              const retryElement =
                document.querySelector(scrollTarget) ||
                document.getElementById(scrollTarget.replace('#', '')) ||
                document.querySelector(`section${scrollTarget}`)

              if (retryElement) {
                console.log('Found element on retry, scrolling to:', scrollTarget)
                retryElement.scrollIntoView({ behavior: 'smooth' })
              } else {
                console.log('Final attempt: trying to find section with id')
                // Last resort - try to find any section with the ID
                const sections = document.querySelectorAll('section')
                for (const section of sections) {
                  if (section.id === scrollTarget.replace('#', '')) {
                    console.log('Found section by iterating:', section.id)
                    section.scrollIntoView({ behavior: 'smooth' })
                    break
                  }
                }
              }
            }, 500)
          }
        }, delay)

        return () => clearTimeout(timer)
      }
    }

    // Call the function when component mounts or pathname changes
    handleScroll()

    // Also add an event listener for the load event to handle cases where
    // the DOM might not be fully ready when the component mounts
    window.addEventListener('load', handleScroll)

    return () => {
      window.removeEventListener('load', handleScroll)
    }
  }, [pathname, searchParams]) // Re-run when the pathname or search params change

  return null // This component doesn't render anything
}
