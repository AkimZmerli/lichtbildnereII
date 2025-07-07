import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/features/shared/components/Header'
import Footer from '@/features/shared/components/Footer'
import { MasonryGalleryProps } from './types/gallery'

interface ExtendedMasonryGalleryProps extends MasonryGalleryProps {
  alternateGalleryLink?: string
  onBack?: () => void
}

const MasonryGallery = ({
  images,
  title,
  alternateGalleryLink,
  onBack,
}: ExtendedMasonryGalleryProps) => {
  const alternateTitle = title.toLowerCase() === 'human' ? 'non-human' : 'human'

  return (
    <div className="min-h-screen bg-grainy flex flex-col">
      <Header />

      <div className="flex-1 p-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-white-rose text-2xl tracking-[0.5em] uppercase">{title}</h2>

          {onBack && (
            <button
              onClick={onBack}
              className="p-3 rounded-full bg-neutral-700 text-white-rose hover:bg-neutral-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Masonry Grid */}
        <motion.div
          className="columns-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {images.map((image, index) => (
            <motion.div
              key={`${image.url}-${index}`}
              className="mb-4 break-inside-avoid"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: index * 0.05,
                duration: 0.4,
                ease: 'easeOut',
              }}
            >
              <div className="relative overflow-hidden rounded-sm bg-neutral-800">
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={400}
                  height={400}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation to alternate gallery */}
        {alternateGalleryLink && (
          <motion.div
            className="mt-12 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <Link
              href={alternateGalleryLink}
              className="inline-flex items-center gap-2 text-hot-pink hover:text-white-rose transition-colors text-lg"
            >
              View {alternateTitle} gallery
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default MasonryGallery
