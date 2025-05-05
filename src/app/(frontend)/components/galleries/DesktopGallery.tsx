import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { GalleryProps } from './types/gallery'
import GalleryImage from './GalleryImage'

const DesktopGallery = ({ images }: Pick<GalleryProps, 'images'>) => {
  const galleryRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ['start start', 'end start'],
  })

  // Transform vertical scroll to horizontal movement only within gallery section
  const x = useTransform(
    scrollYProgress,
    [0, 1], // Full scroll range for smoother movement
    ['0%', `-${(images.length - 1) * 100}%`],
  )

  return (
    <div className="relative">
      {/* Gallery Section with fixed position */}
      <div ref={galleryRef} className="h-[200vh]">
        {' '}
        {/* Increased height for smoother scrolling */}
        <motion.div
          style={{ x }}
          className="fixed top-[50%] -translate-y-1/2 left-0 w-fit flex items-center"
        >
          <div className="flex gap-8">
            {images.map((image, index) => (
              <div key={index} className="w-screen flex items-center justify-center px-12">
                <div className="relative w-full h-[70vh] max-w-6xl">
                  <GalleryImage image={image} priority={index === 0} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer spacer */}
      <div className="h-screen bg-grainy relative z-10" />
    </div>
  )
}

export default DesktopGallery
