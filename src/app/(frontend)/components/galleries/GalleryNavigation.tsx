import { NavigationProps } from '../../types/gallery'

const GalleryNavigation = ({ currentIndex, totalImages, onNext, onPrev }: NavigationProps) => {
  return (
    <div className="absolute bottom-8 left-0 w-full px-8">
      <div className="flex justify-between items-center text-white-rose">
        <span className="text-lg font-light tracking-wider">
          {currentIndex + 1} / {totalImages}
        </span>
        <div className="flex gap-4">
          <button
            onClick={onPrev}
            className="p-2 transition-opacity duration-200"
            disabled={currentIndex === 0}
            aria-label="Previous image"
          >
            <span className={`text-2xl ${currentIndex === 0 ? 'opacity-50' : 'opacity-100'}`}>
              ←
            </span>
          </button>
          <button onClick={onNext} className="p-2" aria-label="Next image">
            <span className="text-2xl">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default GalleryNavigation
