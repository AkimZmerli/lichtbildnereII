'use client'
import { motion } from 'framer-motion'

interface BurgerMenuProps {
  isOpen: boolean
  isDark?: boolean
}

export function BurgerMenu({ isOpen, isDark = false }: BurgerMenuProps) {
  return (
    <div className="w-[50px] h-[50px] relative flex flex-col justify-center items-center">
      <motion.span
        animate={{
          rotate: isOpen ? 160 : 0,
          y: isOpen ? 0 : -6,
          backgroundColor: isOpen ? '#1A1A1A' : '#F5F5F5',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="w-[40px] h-[2px] absolute"
        style={{ transformOrigin: '20px', left: '5px' }}
      />
      <motion.span
        animate={{
          rotate: isOpen ? 20 : 0,
          y: isOpen ? 0 : 6,
          backgroundColor: isOpen ? '#1A1A1A' : '#F5F5F5',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="w-[40px] h-[2px] absolute"
        style={{ transformOrigin: '20px', left: '5px' }}
      />
    </div>
  )
}
