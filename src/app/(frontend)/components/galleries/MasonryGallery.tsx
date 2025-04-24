import { motion } from 'framer-motion'
import Image from 'next/image'
import { MasonryGalleryProps } from '../../types/gallery'

const MasonryGallery = ({ images, title }: MasonryGalleryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-grainy min-h-screen p-4"
    >
      <h2 className="text-white-rose text-2xl mb-6 tracking-wider">{title} Gallery</h2>
      <div className="columns-2 gap-4">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={500}
              height={500}
              className="w-full h-auto"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default MasonryGallery
