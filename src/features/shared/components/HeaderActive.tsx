'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { BurgerMenu } from './BurgerMenu'
import { useEffect, useRef } from 'react'

interface HeaderActiveProps {
  isOpen: boolean
  toggleMenu: () => void
}

function HeaderActive({ isOpen, toggleMenu }: HeaderActiveProps) {
  const router = useRouter()
  const pathname = usePathname()
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node) && isOpen) {
        toggleMenu()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, toggleMenu])

  // Custom navigation handler for smooth scrolling
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    toggleMenu() // Close the menu

    // Parse the URL to get the path and hash
    const url = new URL(href, window.location.origin)
    const targetPath = url.pathname
    const targetHash = url.hash

    // Special handling for Works link
    if (targetHash === '#works') {
      // If we're on the home page already
      if (pathname === '/') {
        // Check if hero animation is active
        const cinematicHero = document.querySelector('[data-cinematic-hero]')
        const heroHeight = cinematicHero?.getBoundingClientRect().height || 0
        const currentScroll = window.scrollY
        
        // If we're at the top and hero animation might be active
        if (currentScroll < heroHeight * 0.5) {
          // First, force skip the hero animation if it exists
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
          
          // Small delay to let the animation complete
          setTimeout(() => {
            // Scroll to top first
            window.scrollTo({ top: 0, behavior: 'smooth' })
            
            // Then scroll to works
            setTimeout(() => {
              const worksElement = document.querySelector('#works')
              if (worksElement) {
                worksElement.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                })
              }
            }, 600)
          }, 100)
        } else {
          // Hero animation is already done, just scroll to works
          const worksElement = document.querySelector('#works')
          if (worksElement) {
            worksElement.scrollIntoView({ 
              behavior: 'smooth',
              block: 'start'
            })
          }
        }
      } else {
        // Navigating from another page to home#works
        // Set flag to skip hero animation
        sessionStorage.setItem('skipHeroAnimation', 'true')
        sessionStorage.setItem('scrollToWorks', 'true')
        
        // Navigate to home page with hash
        router.push('/#works')
      }
      return
    }

    // If we're already on the correct page, just scroll to the section
    if (pathname === targetPath || (pathname === '/' && targetPath === '/')) {
      // We're on the same page, just scroll to the section
      if (targetHash) {
        const targetElement = document.querySelector(targetHash)
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        // No hash, scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      // We need to navigate to a different page
      // Store the hash in sessionStorage to use after navigation
      if (targetHash) {
        // Store more information to help with debugging
        console.log('Storing scroll target:', targetHash)
        sessionStorage.setItem('scrollTarget', targetHash)

        // For navigation from home to about-exhibition, use a special flag
        if (pathname === '/' && targetPath === '/about-exhibition') {
          sessionStorage.setItem('fromHomePage', 'true')
        }
      }

      // Navigate to the new page
      router.push(href)
    }
  }

  return (
    <motion.header
      ref={headerRef}
      initial={{ y: '-100%' }}
      animate={{ y: isOpen ? 0 : '-100%' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed top-0 left-0 w-full px-5 py-5 bg-white-rose z-[70]"
    >
      <div className="bg-white-rose">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            onClick={(e) => handleNavigation(e, '/')}
            className="font-logo text-grainy text-bold text-4xl"
          >
            VALENTIN MICI
          </Link>
          <button onClick={toggleMenu} className="flex items-center justify-center">
            <BurgerMenu isOpen={isOpen} isDark />
          </button>
        </div>
        <nav className="flex flex-col items-end space-y-4 text-black-almost text-2xl mt-4">
          <Link
            href="/#works"
            onClick={(e) => handleNavigation(e, '/#works')}
            className="hover:underline hover:decoration-black-almost transition-opacity"
          >
            W O R K S
          </Link>
          <Link
            href="/about-exhibition#about"
            onClick={(e) => handleNavigation(e, '/about-exhibition#about')}
            className="hover:underline hover:decoration-black-almost transition-opacity"
          >
            A B O U T
          </Link>
          <Link
            href="/about-exhibition#exhibition"
            onClick={(e) => handleNavigation(e, '/about-exhibition#exhibition')}
            className="hover:underline hover:decoration-black-almost transition-opacity"
          >
            E X H I B I T I O N S
          </Link>
        </nav>
      </div>
    </motion.header>
  )
}

export default HeaderActive
