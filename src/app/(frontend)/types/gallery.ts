export interface GalleryImage {
  src: string
  alt: string
}

export interface GalleryProps {
  images: GalleryImage[]
  title: string
}

export interface PayloadImage {
  filename: string
  alt: string
  url: string
}

export interface PayloadGalleryItem {
  id: string
  image: PayloadImage
}

export interface NavigationProps {
  currentIndex: number
  totalImages: number
  onNext: () => void
  onPrev: () => void
}

export interface GalleryImageProps {
  image: GalleryImage
  priority?: boolean
  onLoad?: () => void
}

export interface MasonryGalleryProps {
  images: GalleryImage[]
  title: string
}
