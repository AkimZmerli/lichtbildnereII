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
    alt: item.name || item.image.alt || item.image.filename,
    width: 800, // Default width, should be updated with actual image dimensions
    height: 600, // Default height, should be updated with actual image dimensions
    name: item.name,
    physicalWidth: item.physicalWidth,
    physicalHeight: item.physicalHeight,
    unit: item.unit || 'cm',
    material: item.material,
  }))
}

// Fetch production data from Payload CMS
const fetchPayloadGalleryItems = async (
  collection: 'human' | 'non-human' | 'inverted',
): Promise<GalleryImage[]> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000'
    const url = `${apiUrl}/api/gallery-items?where[type][equals]=${collection}&sort=order`
    
    console.log(`Fetching ${collection} gallery items from:`, url)
    
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error(`API response not ok: ${response.status} ${response.statusText}`)
      throw new Error('Failed to fetch gallery items')
    }

    const data = await response.json()
    console.log(`Found ${data.docs?.length || 0} ${collection} images in CMS`)
    
    return transformPayloadToGalleryImages(data.docs)
  } catch (error) {
    console.error('Error fetching gallery items:', error)
    return []
  }
}

// Test data for inverted images
const testInvertedImages: GalleryImage[] = Array.from({ length: 4 }, (_, i) => ({
  url: `/images/inverted/${i + 1}.jpg`,
  alt: `Inverted Gallery Image ${i + 1}`,
  width: 800,
  height: 600,
  physicalWidth: [100, 110, 90, 120][i],
  physicalHeight: [100, 80, 120, 90][i],
  unit: 'cm',
  material: 'Inverted Development Technique',
}))

// Main function to get gallery images based on environment
export const getGalleryImages = async (type: 'human' | 'non-human' | 'inverted'): Promise<GalleryImage[]> => {
  // Always try to fetch from Payload CMS first
  const images = await fetchPayloadGalleryItems(type)
  
  // Fallback to test data if no images in CMS yet
  if (images.length === 0) {
    console.log(`No ${type} images in CMS yet, using test data as fallback`)
    if (type === 'inverted') return testInvertedImages
    return type === 'human' ? testHumanImages : testNonHumanImages
  }
  
  return images
}

// Helper function to check if we're using test data
export const isUsingTestData = (): boolean => {
  return process.env.NEXT_PUBLIC_USE_TEST_DATA === 'true' || process.env.NODE_ENV === 'development'
}
