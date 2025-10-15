import { GalleryImage } from '../components/types/gallery'

// Placeholder data - will be replaced with static implementation later
const placeholderHumanImages: GalleryImage[] = []
const placeholderNonHumanImages: GalleryImage[] = []
const placeholderInvertedImages: GalleryImage[] = []

// Main function to get gallery images
export const getGalleryImages = async (type: 'human' | 'non-human' | 'inverted'): Promise<GalleryImage[]> => {
  console.log(`Getting ${type} images - static implementation pending`)
  
  switch (type) {
    case 'human':
      return placeholderHumanImages
    case 'non-human':
      return placeholderNonHumanImages
    case 'inverted':
      return placeholderInvertedImages
    default:
      return []
  }
}
