'use client'
import { useState, useEffect } from 'react'
import Header from '@/shared/layout/Header'
import Footer from '@/shared/layout/Footer'
import Link from 'next/link'
import { CSSFlipbook } from '@/open-source/flipbook/components/CSSFlipbook'
import '@/open-source/flipbook/components/flipbook.css'

export default function TestPage() {
  const [currentPage, setCurrentPage] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  
  // Use consistent project images for testing the flipbook
  const sampleImages = [
    '/media/flipbook-images/front.webp', // Front cover
    '/media/flipbook-images/1.webp',     // Page 1
    '/media/flipbook-images/2.webp',     // Page 2
    '/media/flipbook-images/3.webp',     // Page 3
    '/media/flipbook-images/4.webp',     // Page 4
    '/media/flipbook-images/5.webp',     // Page 5
    '/media/flipbook-images/6.webp',     // Page 6
    '/media/flipbook-images/7.webp',     // Page 7
    '/media/flipbook-images/8.webp',     // Page 8
    '/media/flipbook-images/back.webp',  // Back cover
  ]

  // Preload all images before showing the flipbook
  useEffect(() => {
    let loadedCount = 0
    const totalImages = sampleImages.length

    const preloadImages = () => {
      sampleImages.forEach((imageSrc) => {
        const img = new Image()
        img.onload = () => {
          loadedCount++
          if (loadedCount === totalImages) {
            setImagesLoaded(true)
          }
        }
        img.onerror = () => {
          // Still count as loaded to prevent hanging
          loadedCount++
          if (loadedCount === totalImages) {
            setImagesLoaded(true)
          }
        }
        img.src = imageSrc
      })
    }

    preloadImages()
  }, [])

  if (!imagesLoaded) {
    return (
      <div className="min-h-screen flex flex-col bg-grainy">
        <Header />
        <div className="flex-1 flex items-center justify-center bg-grainy text-white-rose">
          <div className="text-center">
            <div className="text-xl md:text-2xl tracking-[0.2em] font-normal font-lato mb-4">
              Loading Flipbook...
            </div>
            <div className="w-64 h-1 bg-white-rose/20 rounded">
              <div className="h-full bg-hot-pink rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-grainy">
      <Header />

      <div className="flex-1 flex items-center justify-center bg-grainy text-white-rose px-4 md:px-8 relative pt-20 md:pt-24">
        {/* Back Link - positioned at top left on desktop */}
        <div className="absolute top-26 left-8 hidden md:block">
          <Link
            href="/"
            className="inline-block text-hot-pink hover:underline underline-offset-4 transition-all duration-200 hover:translate-y-[-2px] bg-grainy/80 backdrop-blur-sm px-4 py-2 rounded-md border border-hot-pink/30"
          >
            ← go back
          </Link>
        </div>

        <div className="w-full max-w-6xl mt-[5%]">
          <h1 className="text-xl md:text-2xl text-center tracking-[0.2em] font-normal font-lato mb-12 md:mb-16">
            F L I P B O O K   T E S T
          </h1>

          {/* Flipbook Container */}
          <div className="relative w-full max-w-4xl mx-auto">
            <CSSFlipbook
              images={sampleImages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Back Link for mobile - stays below media */}
          <div className="mt-8 md:hidden">
            <Link
              href="/"
              className="inline-block text-hot-pink hover:underline underline-offset-4 transition-all duration-200 hover:translate-y-[-2px] bg-grainy/80 backdrop-blur-sm px-4 py-2 rounded-md border border-hot-pink/30"
            >
              ← go back
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}