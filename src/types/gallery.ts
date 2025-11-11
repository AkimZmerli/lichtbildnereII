export interface GalleryProps {
  images: GalleryImage[]
  title: string
  galleryType: GalleryType
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
  alternateGalleryLink?: string
  onBack?: () => void
}

export interface GalleryImage {
  url: string
  alt?: string
  width?: number
  height?: number
  name?: string
  physicalWidth?: number
  physicalHeight?: number
  unit?: string
  material?: string
  fabrication?: string
  exhibition?: string
}

export interface GalleryHeaderProps {
  title: string
  alternateGalleryLink: string
}

export interface GalleryLayoutProps {
  children: React.ReactNode
  header: React.ReactNode
}

export type GalleryType = 'human' | 'non-human' | 'exhibition'