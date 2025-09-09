'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import Image from 'next/image'

interface CinematicHeroV2Props {
  imageUrl: string
  altText: string
  initialHeight?: number // percentage of viewport height
  expandedHeight?: number // percentage of viewport height  
  showScrollIndicator?: boolean
  className?: string
}

export default function CinematicHeroV2({
  imageUrl,
  altText,
  initialHeight = 40,
  expandedHeight = 70,
  showScrollIndicator = true,
  className = '',
}: CinematicHeroV2Props) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll-driven animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  // Smooth scroll progress with spring physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Letterbox height animation - starts small, expands quicker on scroll
  const letterboxHeight = useTransform(
    smoothProgress,
    [0, 0.4, 1],
    [`${initialHeight}vh`, `${expandedHeight}vh`, `${expandedHeight}vh`]
  )

  // Subtle parallax effect for depth
  const parallaxY = useTransform(
    smoothProgress,
    [0, 1],
    [0, -50]
  )

  // Loading sequence
  useEffect(() => {
    if (imageLoaded) {
      const timer = setTimeout(() => {
        setIsReady(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [imageLoaded])

  return (
    <>
      {/* Main container - defines scroll area */}
      <div 
        ref={containerRef}
        className={`relative w-full bg-grainy ${className}`}
        style={{ height: '200vh' }} // Double height for scroll-driven animation
        data-cinematic-hero-v2
      >
        {/* Grainy background */}
        <div className="fixed inset-0 bg-grainy z-30" />
        
        {/* Fixed letterbox container */}
        <div className="fixed inset-0 flex items-center justify-center z-40 px-4">
          <motion.div
            className="relative overflow-hidden bg-grainy rounded-sm"
            style={{
              width: '100%',
              maxWidth: 'min(1200px, 95vw)',
              height: letterboxHeight,
              opacity: isReady ? 1 : 0,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
              opacity: isReady ? 1 : 0,
              scale: isReady ? 1 : 0.95
            }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Image with parallax */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              style={{ y: parallaxY }}
            >
              <Image
                src={imageUrl}
                alt={altText}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 90vw, 1200px"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  console.error('Hero image failed to load')
                  setImageLoaded(true) // Show placeholder/fallback
                }}
              />
            </motion.div>

            {/* Cinematic border/shadow effect */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: '0 0 100px 20px rgba(0, 0, 0, 0.8)',
              }}
            />

            {/* Loading state */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center gap-4">
                <div className="w-8 h-8 border-2 border-white-rose border-t-transparent rounded-full animate-spin" />
                <div className="text-white-rose/60 text-sm tracking-wider">Loading...</div>
              </div>
            )}

            {/* Fallback for failed image loads */}
            {imageLoaded && !isReady && (
              <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                <div className="text-white-rose/60 text-center">
                  <div className="text-lg mb-2">Unable to load image</div>
                  <div className="text-sm">Please check your connection</div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        {showScrollIndicator && isReady && (
          <motion.div
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 text-white-rose/70"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs tracking-widest uppercase">Scroll Down</span>
              <motion.div
                className="w-px h-8 bg-white-rose/50"
                animate={{ scaleY: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Content spacer - only show when hero is ready */}
      {isReady && (
        <div className="relative z-10 bg-grainy">
          {/* This is where page content will go */}
        </div>
      )}
    </>
  )
}