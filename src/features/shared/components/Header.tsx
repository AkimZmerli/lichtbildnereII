'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import HeaderActive from './HeaderActive'
import Link from 'next/link'
import { BurgerMenu } from './BurgerMenu'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false) // Start hidden, will be set by useEffect
  const [isScrolled, setIsScrolled] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)
  const [hasScrolledDown, setHasScrolledDown] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const lastScrollYRef = useRef(0)
  const ticking = useRef(false)
  const pathname = usePathname()
  const isGalleryPage = pathname?.includes('gallery/')
  const hasCinematicHero = useRef(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        const scrollingDown = currentScrollY > lastScrollYRef.current
        const scrollingUp = currentScrollY < lastScrollYRef.current
        
        // Track if user has scrolled down past hero area
        if (currentScrollY > 100 && !hasScrolledDown) {
          setHasScrolledDown(true)
        }
        
        // Header visibility logic for pages with cinematic hero
        if (hasCinematicHero.current) {
          // Hide header initially and when scrolling down
          // Only show when scrolling up AND user has scrolled down before
          setIsVisible(scrollingUp && hasScrolledDown && currentScrollY > 50)
        } else {
          // Original behavior for other pages
          setIsVisible(currentScrollY < lastScrollYRef.current || currentScrollY < 50)
        }
        
        setIsScrolled(currentScrollY > 0)
        lastScrollYRef.current = currentScrollY
        ticking.current = false
      })
      ticking.current = true
    }
  }, [hasScrolledDown])

  useEffect(() => {
    // Short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (isGalleryPage) {
        hasCinematicHero.current = false
        setIsVisible(true)
        setIsScrolled(false)
        return
      }

      const cinematicHero = document.querySelector('[data-cinematic-hero]') || document.querySelector('[data-cinematic-hero-v2]')
      if (cinematicHero) {
        hasCinematicHero.current = true
        const currentScrollY = window.scrollY
        // If page is refreshed while scrolled down, show header
        // If at top of page, hide header for cinematic experience
        setIsVisible(currentScrollY > 50)
        setIsScrolled(currentScrollY > 0)
        setHasScrolledDown(currentScrollY > 100)
      } else {
        hasCinematicHero.current = false
        setIsVisible(true)
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
    }, 100)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isGalleryPage, handleScroll])

  return (
    <>
      <HeaderActive isOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <motion.header
        ref={headerRef}
        initial={{ y: 0 }}
        animate={{
          y: isScrolled ? (isVisible ? 0 : -100) : 0,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          willChange: 'transform',
        }}
        className={`w-full px-5 py-5 ${hasCinematicHero.current && isVisible ? 'z-50' : 'z-40'} transition-colors duration-200 bg-grainy`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="font-logo text-white-rose text-bold text-4xl">
            VALENTIN MICI
          </Link>
          <button onClick={toggleMenu} className="flex items-center justify-center">
            <BurgerMenu isOpen={isMenuOpen} />
          </button>
        </div>
      </motion.header>
    </>
  )
}

export default Header
