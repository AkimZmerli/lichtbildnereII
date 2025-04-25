'use client'

import { useState, useEffect } from 'react'
import HeaderActive from './HeaderActive'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll } from 'framer-motion'
import { usePathname } from 'next/navigation'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const pathname = usePathname()
  const isGalleryPage = pathname?.includes('gallery/')

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  useEffect(() => {
    if (isGalleryPage) {
      setIsVisible(true)
      setIsScrolled(false)
      return
    }
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50)
      setIsScrolled(currentScrollY > 0)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, isGalleryPage])

  return (
    <>
      <HeaderActive isOpen={isMenuOpen} toggleMenu={toggleMenu} />
      {/* Placeholder div to prevent layout shift */}
      <div className="h-[88px]" /> {/* Adjust height to match your header height */}
      <motion.header
        initial={{ opacity: 1 }}
        animate={{
          opacity: 1,
          y: isScrolled ? (isVisible ? 0 : -100) : 0,
          position: isScrolled ? 'fixed' : 'absolute',
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
          transform: isScrolled ? undefined : 'none',
        }}
        className={`w-full px-5 py-6 z-40 transition-colors duration-200 bg-grainy`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="font-logo text-white-rose text-bold text-4xl">
            VALENTIN MICI
          </Link>
          <button onClick={toggleMenu}>
            <Image src="/images/BurgerPlaceholder.png" width={60} height={60} alt="burgermenu" />
          </button>
        </div>
      </motion.header>
    </>
  )
}

export default Header
