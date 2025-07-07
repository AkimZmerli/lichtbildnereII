import { motion } from 'framer-motion'
import ImageWithLoader from '@/features/shared/ui/ImageWithLoader'
import { GalleryImageProps } from './types/gallery'

const GalleryImage = ({ image, priority, onLoad }: GalleryImageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full relative"
    >
      <ImageWithLoader image={image} priority={priority} onLoad={onLoad} />
    </motion.div>
  )
}

export default GalleryImage
