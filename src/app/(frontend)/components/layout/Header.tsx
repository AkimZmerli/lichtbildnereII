'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import HeaderActive from './HeaderActive'
import Link from 'next/link'
import { BurgerMenu } from './BurgerMenu'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)
  const headerRef = useRef<HTMLDivElement>(null)
  const lastScrollYRef = useRef(0)
  const ticking = useRef(false)
  const pathname = usePathname()
  const isGalleryPage = pathname?.includes('gallery/')

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        setIsVisible(currentScrollY < lastScrollYRef.current || currentScrollY < 50)
        setIsScrolled(currentScrollY > 0)
        lastScrollYRef.current = currentScrollY
        ticking.current = false
      })
      ticking.current = true
    }
  }, [])

  useEffect(() => {
    if (isGalleryPage) {
      setIsVisible(true)
      setIsScrolled(false)
      return
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isGalleryPage, handleScroll])

  // Measure the header height when it mounts and when window resizes
  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight)
      }
    }

    // Initial measurement
    updateHeaderHeight()

    // Update on resize
    window.addEventListener('resize', updateHeaderHeight)

    return () => {
      window.removeEventListener('resize', updateHeaderHeight)
    }
  }, [])

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
        className={`w-full px-5 py-5 z-40 transition-colors duration-200 bg-grainy`}
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
