'use client'

import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface HeroClientProps {
  mobileUrl?: string
  desktopUrl?: string
  altText?: string
}

export default function HeroClient({ mobileUrl, desktopUrl, altText }: HeroClientProps) {
  const containerRef = useRef(null)
  const [canScroll, setCanScroll] = useState(false)

  const { scrollY } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Transform value for the mask width
  const maskWidth = useTransform(scrollY, [0, 300], ['20%', '100%'])

  // Handle scroll lock
  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      if (latest >= 300 && !canScroll) {
        setCanScroll(true)
      } else if (latest < 300 && canScroll) {
        setCanScroll(false)
      }
    })

    return () => unsubscribe()
  }, [scrollY, canScroll])

  // Prevent scroll until fully revealed
  useEffect(() => {
    if (!canScroll) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [canScroll])

  return (
    <div ref={containerRef} className="relative w-full h-[200vh]">
      <div className="fixed top-0 left-0 w-full h-screen">
        {/* Container for image and mask */}
        <div className="relative w-full h-full overflow-hidden">
          {/* Mobile Image */}
          {mobileUrl && (
            <Image
              src={mobileUrl}
              alt={altText || 'Hero image'}
              className="block md:hidden object-cover"
              fill
              sizes="100vw"
              priority
              quality={95}
            />
          )}

          {/* Desktop Image */}
          {desktopUrl && (
            <Image
              src={desktopUrl}
              alt={altText || 'Hero image'}
              className="hidden md:block object-cover"
              fill
              sizes="100vw"
              priority
              quality={95}
            />
          )}

          {/* Mask overlay */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-black"
            style={
              {
                width: '100%',
                clipPath: 'inset(0 0 0 var(--mask-width))',
                WebkitClipPath: 'inset(0 0 0 var(--mask-width))',
                '--mask-width': maskWidth,
              } as any
            }
          />
        </div>
      </div>
    </div>
  )
}
