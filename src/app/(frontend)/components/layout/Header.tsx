'use client'

import { useState } from 'react'
import HeaderActive from './HeaderActive'
import Link from 'next/link'
import Image from 'next/image'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <HeaderActive isOpen={isMenuOpen} toggleMenu={toggleMenu} />
      <header className="w-full px-5 py-6 bg-grainy">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-logo text-white-rose text-bold text-4xl">
            VALENTIN MICI
          </Link>
          <button onClick={toggleMenu}>
            <Image src="/images/BurgerPlaceholder.png" width={60} height={60} alt="burgermenu" />
          </button>
        </div>
      </header>
    </>
  )
}

export default Header
