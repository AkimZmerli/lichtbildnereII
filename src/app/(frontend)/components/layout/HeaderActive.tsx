'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface HeaderActiveProps {
  isOpen: boolean
  toggleMenu: () => void
}

function HeaderActive({ isOpen, toggleMenu }: HeaderActiveProps) {
  const router = useRouter()

  return (
    <motion.header
      initial={{ y: '-100%' }}
      animate={{ y: isOpen ? 0 : '-100%' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed top-0 left-0 w-full px-5 py-6 bg-white-rose z-50"
    >
      <div className="flex items-center justify-between">
        <Link href="/" className="font-logo text-grainy text-bold text-4xl">
          VALENTIN MICI
        </Link>
        <div className="flex flex-col items-end space-y-4">
          <button onClick={toggleMenu}>
            <Image src="/images/BurgerPlaceholder.png" width={60} height={60} alt="burgermenu" />
          </button>
          <nav className="flex flex-col items-end space-y-2 text-black-almost text-xl">
            <Link
              href="/#works"
              onClick={() => toggleMenu()}
              className="hover:opacity-70 transition-opacity"
            >
              Works
            </Link>
            <Link
              href="/about-exhibition#about"
              onClick={() => toggleMenu()}
              className="hover:opacity-70 transition-opacity"
            >
              About
            </Link>
            <Link
              href="/about-exhibition#exhibition"
              onClick={() => toggleMenu()}
              className="hover:opacity-70 transition-opacity"
            >
              Exhibition
            </Link>
          </nav>
        </div>
      </div>
    </motion.header>
  )
}

export default HeaderActive
