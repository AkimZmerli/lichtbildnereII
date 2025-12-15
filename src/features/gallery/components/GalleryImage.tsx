import { motion } from 'framer-motion'
import LazyImage from '@/shared/ui/LazyImage'
import { GalleryImageProps } from '@/types/gallery'

const GalleryImage = ({ image, priority, onLoad, sizes }: GalleryImageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full relative"
    >
      <LazyImage 
        image={image} 
        priority={priority} 
        onLoad={onLoad} 
        sizes={sizes}
        threshold={200} // Start loading 200px before viewport
      />
    </motion.div>
  )
}

export default GalleryImage
