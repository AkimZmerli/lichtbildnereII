import { getPayload } from '@/lib/payload'

export interface Slide {
  id: string
  label: string
  content: any
  images?: {
    url: string
    alt: string
    id: string
  }[]
}

export async function getSlides() {
  try {
    const payload = await getPayload()
    const { docs } = await payload.find({
      collection: 'slides',
      depth: 2,
    })
    return docs as Slide[]
  } catch (error) {
    console.warn('Failed to fetch slides:', error)
    // Return empty array if database tables don't exist yet
    return [] as Slide[]
  }
}
