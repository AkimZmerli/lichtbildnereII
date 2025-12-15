/**
 * Helper function to get Cloudinary URLs for images
 * Maintains the same interface as the old blob helper
 */

const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/dnnnchnqv/image/upload'

// Map old paths to new Cloudinary paths
const pathMapping: Record<string, string> = {
  // Exhibition images
  'exhibition/6 - Lichtbildnerei.webp': 'f_auto,q_auto/v1765802772/portfolio/exhibition/6_-_Lichtbildnerei.jpg',
  'exhibition/4 - Lichtbildnerei.webp': 'f_auto,q_auto/v1765802754/portfolio/exhibition/4_-_Lichtbildnerei.jpg',
  'exhibition/5 - Lichtbildnerei.webp': 'f_auto,q_auto/v1765802763/portfolio/exhibition/5_-_Lichtbildnerei.jpg',
  'exhibition/Amore I.webp': 'f_auto,q_auto/v1765802713/portfolio/exhibition/Amore_I.jpg',
  'exhibition/2 - Amore.webp': 'f_auto,q_auto/v1765802721/portfolio/exhibition/2_-_Amore.jpg',
  'exhibition/3 - Amore.webp': 'f_auto,q_auto/v1765802744/portfolio/exhibition/3_-_Amore.jpg',
  'exhibition/25 - Momentum.webp': 'f_auto,q_auto/v1765802726/portfolio/exhibition/25_-_Momentum.jpg',
  'exhibition/28 - Best of II - Visitors Choise.webp': 'f_auto,q_auto/v1765802731/portfolio/exhibition/28_-_Best_of_II_-_Visitors_Choise.jpg',
  'exhibition/29 - Best of II - Visitors Choise.webp': 'f_auto,q_auto/v1765802736/portfolio/exhibition/29_-_Best_of_II_-_Visitors_Choise.jpg',
  
  // Flipbook images
  'flipbook-images/Social.webp': 'f_auto,q_auto:good/v1765803191/portfolio/flipbook/Social.jpg',
  'flipbook-images/1.webp': 'f_auto,q_auto:good/v1765803003/portfolio/flipbook/1.jpg',
}

export function getImageUrl(path: string): string {
  // Check if we have a mapping for this path
  const mappedPath = pathMapping[path]
  if (mappedPath) {
    return `${CLOUDINARY_BASE_URL}/${mappedPath}`
  }
  
  // Fallback - construct URL based on path pattern
  // This handles any unmapped paths by converting them to Cloudinary format
  const cleanPath = path
    .replace(/\.webp$/, '.jpg')
    .replace(/\s+/g, '_')
  
  return `${CLOUDINARY_BASE_URL}/f_auto,q_auto/portfolio/${cleanPath}`
}

// Export for backward compatibility
export { getImageUrl as getCloudinaryUrl }