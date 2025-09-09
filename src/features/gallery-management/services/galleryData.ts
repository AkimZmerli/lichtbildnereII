import { GalleryImage, PayloadGalleryItem } from '../components/types/gallery'

// Test data
const testHumanImages: GalleryImage[] = Array.from({ length: 4 }, (_, i) => ({
  url: `/images/human/${i + 1}.jpg`,
  alt: `Human Gallery Image ${i + 1}`,
  width: 800,
  height: 600,
  physicalWidth: [120, 80, 150, 90][i],
  physicalHeight: [80, 120, 100, 120][i],
  unit: 'cm',
  material: ['Oil on Canvas', 'Acrylic on Canvas', 'Mixed Media', 'Oil on Wood'][i],
}))

const testNonHumanImages: GalleryImage[] = Array.from({ length: 4 }, (_, i) => ({
  url: `/images/non-human/${i + 5}.jpg`,
  alt: `Non-Human Gallery Image ${i + 1}`,
  width: 800,
  height: 600,
  physicalWidth: [100, 70, 130, 110][i],
  physicalHeight: [70, 100, 90, 80][i],
  unit: 'cm',
  material: ['Photography', 'Digital Art', 'Mixed Media', 'Sculpture'][i],
}))

// Transform Payload data to our GalleryImage format
const transformPayloadToGalleryImages = (items: PayloadGalleryItem[]): GalleryImage[] => {
  return items.map((item) => ({
    url: item.image.url,
    alt: item.image.alt || item.image.filename,
    width: 800, // Default width, should be updated with actual image dimensions
    height: 600, // Default height, should be updated with actual image dimensions
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
