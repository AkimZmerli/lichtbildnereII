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
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'slides',
    depth: 2,
  })
  return docs as Slide[]
}
