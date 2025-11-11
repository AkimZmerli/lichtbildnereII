'use client'

import { useState } from 'react'
import HeaderActive from './HeaderActive'
import Link from 'next/link'
import Image from 'next/image'

function HeaderDesktop() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <HeaderActive isOpen={isMenuOpen} toggleMenu={toggleMenu} />
      {/* Placeholder div to prevent layout shift */}
      <div className="h-[88px]" /> {/* Adjust height to match your header height */}
      <div className="flex items-center justify-between">
        <Link href="/" className="font-logo text-white-rose text-bold text-4xl">
          VALENTIN MICI
        </Link>
        <button onClick={toggleMenu}>
          <Image src="/images/BurgerPlaceholder.png" width={60} height={60} alt="burgermenu" />
        </button>
      </div>
    </>
  )
}

export default HeaderDesktop
