// API response types and interfaces

export interface WorksPreviewImage {
  url: string
  alt: string
  width: number
  height: number
}

export interface WorksPreviewData {
  human: WorksPreviewImage
  nonHuman: WorksPreviewImage
}

export interface Slide {
  url: string
  alt: string
  width?: number
  height?: number
}

export interface HeroImageData {
  url: string
  alt: string
  width?: number
  height?: number
}

// Social Book types
export interface SocialBookData {
  images: string[]
  title?: string
  description?: string
}

// Exhibition types  
export interface ExhibitionImage {
  url: string
  alt: string
  width?: number
  height?: number
  name?: string
  physicalWidth?: number
  physicalHeight?: number
  unit?: string
  material?: string
  fabrication?: string
}