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

export interface GalleryImage {
  url: string
  alt: string
  width: number
  height: number
}

export interface GalleryHeaderProps {
  title: string
  alternateGalleryLink: string
}

export interface GalleryProps extends GalleryHeaderProps {
  images: GalleryImage[]
}

export interface GalleryLayoutProps {
  children: React.ReactNode
  header: React.ReactNode
}

export type GalleryType = 'human' | 'non-human'
