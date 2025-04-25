import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { GalleryProps } from '../../types/gallery'
import GalleryImage from './GalleryImage'
import Header from '../layout/Header'

const DesktopGallery = ({ images, title }: GalleryProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  // Transform vertical scroll to horizontal movement
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${(images.length - 1) * 100}%`])

  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])

  return (
    <div ref={containerRef} className="min-h-[200vh] bg-grainy">
      <h1 className="text-white-rose text-4xl tracking-widest p-8 mt-7 fixed top-0 w-full z-10 bg-grainy backdrop-blur-sm">
        {title}
      </h1>

      <motion.div
        style={{ x }}
        className="fixed top-0 left-0 h-screen w-fit flex items-center pt-24"
      >
        <div className="flex gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="w-screen h-[calc(100vh-6rem)] flex items-center justify-center px-12"
            >
              <div className="relative w-full h-full max-w-7xl">
                <GalleryImage image={image} priority={index === 0} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default DesktopGallery
