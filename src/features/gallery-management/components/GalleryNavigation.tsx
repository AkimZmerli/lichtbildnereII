import Link from 'next/link'
import { GalleryType } from './types/gallery'
import HeaderDesktop from '@/features/shared/components/HeaderDesktop'

interface GalleryNavigationProps {
  type: GalleryType
}

const GalleryNavigation = ({ type }: GalleryNavigationProps) => {
  const isHuman = type === 'human'
  const title = isHuman ? 'H U M A N' : 'N O N   H U M A N'
  const alternateLink = isHuman ? '/gallery/non-human' : '/gallery/human'
  const alternateText = isHuman ? 'non-human' : 'human'

  return (
    <div className="fixed top-0 w-full z-20 bg-grainy backdrop-blur-sm">
      <HeaderDesktop />
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-white-rose text-4xl tracking-[0.5em] mb-6">{title}</h1>
            <p className="text-white-rose text-lg font-light">Scroll down to explore the gallery</p>
          </div>
          <Link
            href={alternateLink}
            className="text-hot-pink hover:text-white-rose transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            View {alternateText} gallery
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GalleryNavigation
