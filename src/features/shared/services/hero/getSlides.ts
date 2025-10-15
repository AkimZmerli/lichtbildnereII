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

export async function getSlides(): Promise<Slide[]> {
  console.log('Getting slides - static implementation pending')
  // Return empty array for now - will be replaced with static implementation
  return []
}
