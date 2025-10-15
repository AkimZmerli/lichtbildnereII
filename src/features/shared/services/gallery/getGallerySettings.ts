interface GalleryImage {
  url: string
  alt: string
  width: number
  height: number
}

interface GallerySettings {
  humanGallery: GalleryImage | null
  nonHumanGallery: GalleryImage | null
  invertedGallery: GalleryImage | null
}

export const getGallerySettings = async (): Promise<GallerySettings> => {
  console.log('Getting gallery settings - static implementation pending')
  
  // Return null values for now - will be replaced with static implementation
  return {
    humanGallery: null,
    nonHumanGallery: null,
    invertedGallery: null
  }
}