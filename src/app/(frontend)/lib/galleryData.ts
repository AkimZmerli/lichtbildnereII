import { GalleryImage, PayloadGalleryItem } from '../components/galleries/types/gallery'

// Test data
const testHumanImages: GalleryImage[] = Array.from({ length: 4 }, (_, i) => ({
  src: `/images/human/${i + 1}.jpg`,
  alt: `Human Gallery Image ${i + 1}`,
}))

const testNonHumanImages: GalleryImage[] = Array.from({ length: 4 }, (_, i) => ({
  src: `/images/non-human/${i + 5}.jpg`,
  alt: `Non-Human Gallery Image ${i + 1}`,
}))

// Transform Payload data to our GalleryImage format
const transformPayloadToGalleryImages = (items: PayloadGalleryItem[]): GalleryImage[] => {
  return items.map((item) => ({
    src: item.image.url,
    alt: item.image.alt || item.image.filename,
  }))
}

// Fetch production data from Payload CMS
const fetchPayloadGalleryItems = async (
  collection: 'human' | 'non-human',
): Promise<GalleryImage[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_API_URL}/api/gallery-items?where[category][equals]=${collection}`,
    )
    if (!response.ok) throw new Error('Failed to fetch gallery items')

    const data = await response.json()
    return transformPayloadToGalleryImages(data.docs)
  } catch (error) {
    console.error('Error fetching gallery items:', error)
    return []
  }
}

// Main function to get gallery images based on environment
export const getGalleryImages = async (type: 'human' | 'non-human'): Promise<GalleryImage[]> => {
  // Use test data in development or when explicitly set
  if (process.env.NEXT_PUBLIC_USE_TEST_DATA === 'true' || process.env.NODE_ENV === 'development') {
    return type === 'human' ? testHumanImages : testNonHumanImages
  }

  // Use Payload CMS data in production
  return fetchPayloadGalleryItems(type)
}

// Helper function to check if we're using test data
export const isUsingTestData = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_TEST_DATA === 'true' || process.env.NODE_ENV === 'development'
}
