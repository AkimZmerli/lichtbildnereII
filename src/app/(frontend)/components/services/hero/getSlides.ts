import { getPayload } from '@/lib/payload'

export interface Slide {
  id: string
  label: string
  content: any
}

export async function getSlides() {
  const payload = await getPayload()
  const { docs } = await payload.find({
    collection: 'slides',
  })
  return docs as Slide[]
}
