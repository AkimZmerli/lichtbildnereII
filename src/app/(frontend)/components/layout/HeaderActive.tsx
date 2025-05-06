'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { BurgerMenu } from './BurgerMenu'

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
      <div className="bg-white-rose">
        <div className="flex justify-between items-center">
          <Link href="/" className="font-logo text-grainy text-bold text-4xl">
            VALENTIN MICI
          </Link>
          <button onClick={toggleMenu} className="flex items-center justify-center">
            <BurgerMenu isOpen={isOpen} isDark />
          </button>
        </div>
        <nav className="flex flex-col items-end space-y-4 text-black-almost text-2xl mt-4">
          <Link
            href="/#works"
            onClick={() => toggleMenu()}
            className="hover:underline hover:decoration-black-almost transition-opacity"
          >
            W O R K S
          </Link>
          <Link
            href="/about-exhibition#about"
            onClick={() => toggleMenu()}
            className="hover:underline hover:decoration-black-almost transition-opacity"
          >
            A B O U T
          </Link>
          <Link
            href="/about-exhibition#exhibition"
            onClick={() => toggleMenu()}
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
