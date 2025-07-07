'use client'

import { useEffect } from 'react'

export default function ScrollToSection() {
  useEffect(() => {
    // Function to handle scrolling to the correct section
    const handleScrollToSection = () => {
      // Check if there's a stored target from navigation
      const scrollTarget = sessionStorage.getItem('scrollTarget')
      const fromHomePage = sessionStorage.getItem('fromHomePage')

      console.log('About-Exhibition ScrollToSection:', { scrollTarget, fromHomePage })

      if (scrollTarget) {
        // Clear the stored values
        sessionStorage.removeItem('scrollTarget')
        sessionStorage.removeItem('fromHomePage')

        // Use a longer delay for the about-exhibition page
        const delay = fromHomePage ? 1500 : 800

        setTimeout(() => {
          // Try different ways to find the target element
          const targetId = scrollTarget.replace('#', '')
          const targetElement =
            document.getElementById(targetId) ||
            document.querySelector(`#${targetId}`) ||
            document.querySelector(`section#${targetId}`)

          console.log(`Looking for element with ID: ${targetId}`, targetElement)

          if (targetElement) {
            console.log('Found element, scrolling to:', targetId)
            targetElement.scrollIntoView({ behavior: 'smooth' })
          } else if (targetId === 'about' || targetId === 'exhibition') {
            // Special handling for about and exhibition sections
            console.log(`Special handling for ${targetId} section`)

            // Find all sections and look for the one with the matching ID
            const sections = document.querySelectorAll('section')
            for (const section of sections) {
              console.log('Section ID:', section.id)
              if (section.id === targetId) {
                console.log('Found section by ID:', targetId)
                section.scrollIntoView({ behavior: 'smooth' })
                break
              }
            }

            // If still not found, try to get the first section with the right tag
            if (targetId === 'about') {
              const aboutSection =
                document.querySelector('section#about') || document.querySelector('div > section')
              if (aboutSection) {
                console.log('Found about section by selector')
                aboutSection.scrollIntoView({ behavior: 'smooth' })
              }
            } else if (targetId === 'exhibition') {
              const exhibitionSection =
                document.querySelector('section#exhibition') ||
                document.querySelectorAll('div > section')[1]
              if (exhibitionSection) {
                console.log('Found exhibition section by selector')
                exhibitionSection.scrollIntoView({ behavior: 'smooth' })
              }
            }
          }
        }, delay)
      }
    }

    // Run the scroll handler when the component mounts
    handleScrollToSection()

    // Also run it when the page is fully loaded
    window.addEventListener('load', handleScrollToSection)

    return () => {
      window.removeEventListener('load', handleScrollToSection)
    }
  }, [])

  return null // This component doesn't render anything
}
