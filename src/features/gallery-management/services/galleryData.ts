import { GalleryImage } from '../components/types/gallery'

// Static gallery data extracted from PDF
const humanImages: GalleryImage[] = [
  {
    url: '/media/gallery/human/7 - Human.jpg',
    alt: 'hiking',
    width: 800,
    height: 1000,
    name: 'hiking',
    physicalWidth: 40,
    physicalHeight: 50,
    unit: 'cm',
    material: 'silver gelatin print on baryta paper'
  },
  {
    url: '/media/gallery/human/8 - Human.jpg',
    alt: 'summer',
    width: 800,
    height: 1000,
    name: 'summer',
    physicalWidth: 40,
    physicalHeight: 50,
    unit: 'cm',
    material: 'silver gelatin print on baryta paper'
  },
  {
    url: '/media/gallery/human/13 - Human.jpg',
    alt: 'hungry',
    width: 800,
    height: 1000,
    name: 'hungry',
    physicalWidth: 40,
    physicalHeight: 50,
    unit: 'cm',
    material: 'silver gelatin print on baryta paper'
  },
  {
    url: '/media/gallery/human/15 - Human.jpg',
    alt: 'bogey',
    width: 800,
    height: 1000,
    name: 'bogey',
    physicalWidth: 40,
    physicalHeight: 50,
    unit: 'cm',
    material: 'silver gelatin print on baryta paper'
  },
  {
    url: '/media/gallery/human/23 - Human.jpg',
    alt: 'dieter',
    width: 800,
    height: 1200,
    name: 'dieter',
    physicalWidth: 18,
    physicalHeight: 24,
    unit: 'cm',
    material: 'silver gelatin print on baryta paper'
  },
  {
    url: '/media/gallery/human/24 - Human.jpg',
    alt: 'another day',
    width: 800,
    height: 1200,
    name: 'another day',
    physicalWidth: 18,
    physicalHeight: 24,
    unit: 'cm',
    material: 'silver gelatin print on baryta paper'
  },
  {
    url: '/media/gallery/human/26 - Human.jpg',
    alt: 'thomas',
    width: 800,
    height: 1200,
    name: 'thomas',
    physicalWidth: 18,
    physicalHeight: 24,
    unit: 'cm',
    material: 'silver gelatin print on baryta paper'
  }
]

const nonHumanImages: GalleryImage[] = [
  {
    url: '/media/gallery/non-human/9 - No Human.jpg',
    alt: 'flowers',
    width: 800,
    height: 1000,
    name: 'flowers',
    physicalWidth: 40,
    physicalHeight: 50,
    unit: 'cm',
    material: 'silver gelatin print on baryta paper'
  },
  {
    url: '/media/gallery/non-human/10 - No Human.jpg',
    alt: 'mood II',
    width: 800,
    height: 1000,
    name: 'mood II',
    physicalWidth: 40,
    physicalHeight: 50,
    unit: 'cm',
    material: 'silver gelatin print on baryta paper'
  },
  {
    url: '/media/gallery/non-human/11 - No Human.jpg',
    alt: 'curtains II',
    width: 800,
    height: 1000,
    name: 'curtains II',
    physicalWidth: 40,
    physicalHeight: 50,
    unit: 'cm',
    material: 'silver gelatin print on baryta paper'
  },
  {
    url: '/media/gallery/non-human/12 - No Human.jpg',
    alt: 'bubbles',
    width: 800,
    height: 1000,
    name: 'bubbles',
    physicalWidth: 40,
    physicalHeight: 50,
    unit: 'cm',
    material: 'silver gelatin print on baryta paper'
  },
  {
    url: '/media/gallery/non-human/14 - No Human.jpg',
    alt: 'be careful',
    width: 800,
    height: 1000,
    name: 'be careful',
    physicalWidth: 40,
    physicalHeight: 50,
    unit: 'cm',
    material: 'silver gelatin print on baryta paper'
  },
  {
    url: '/media/gallery/non-human/17 - No Human.jpg',
    alt: 'humans',
    width: 800,
    height: 1200,
    name: 'humans',
    physicalWidth: 18,
    physicalHeight: 24,
    unit: 'cm',
    material: 'silver gelatin print on baryta paper'
  },
  {
    url: '/media/gallery/non-human/22 - No Human.jpg',
    alt: 'arrangement',
    width: 800,
    height: 1080,
    name: 'arrangement',
    physicalWidth: 80,
    physicalHeight: 108,
    unit: 'cm',
    material: 'silver gelatin print on baryta paper'
  },
  {
    url: '/media/gallery/non-human/27 - No Human.jpg',
    alt: 'alex',
    width: 800,
    height: 1000,
    name: 'alex',
    physicalWidth: 40,
    physicalHeight: 50,
    unit: 'cm',
    material: 'silver gelatin print on baryta paper'
  }
]

const invertedImages: GalleryImage[] = [
  {
    url: '/media/gallery/inverted/18 - No Human.jpg',
    alt: 'mood',
    width: 800,
    height: 1000,
    name: 'mood',
    physicalWidth: 40,
    physicalHeight: 50,
    unit: 'cm',
    material: 'silver gelatin print on baryta paper'
  },
  {
    url: '/media/gallery/inverted/19 - No Human.jpg',
    alt: 'curtains',
    width: 800,
    height: 1000,
    name: 'curtains',
    physicalWidth: 40,
    physicalHeight: 50,
    unit: 'cm',
    material: 'silver gelatin print on baryta paper'
  },
  {
    url: '/media/gallery/inverted/20 - Human.jpg',
    alt: 'waiting',
    width: 800,
    height: 1000,
    name: 'waiting',
    physicalWidth: 40,
    physicalHeight: 50,
    unit: 'cm',
    material: 'silver gelatin print on baryta paper'
  },
  {
    url: '/media/gallery/inverted/21 - No Human.jpg',
    alt: 'Dark flowers',
    width: 800,
    height: 1080,
    name: 'Dark flowers',
    physicalWidth: 31,
    physicalHeight: 42,
    unit: 'cm',
    material: 'silver gelatin print on baryta paper'
  }
]

// Main function to get gallery images
export const getGalleryImages = async (type: 'human' | 'non-human' | 'inverted'): Promise<GalleryImage[]> => {
  switch (type) {
    case 'human':
      return humanImages
    case 'non-human':
      return nonHumanImages
    case 'inverted':
      return invertedImages
    default:
      return []
  }
}
