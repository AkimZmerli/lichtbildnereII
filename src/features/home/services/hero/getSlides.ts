import { getImageUrl } from '../../../../lib/blob'

export interface Slide {
  id: string
  label: string
  content: Record<string, unknown>
  images?: {
    url: string
    alt: string
    id: string
  }[]
}

export async function getSlides(): Promise<Slide[]> {
  return [
    {
      id: 'platz-da-2022',
      label: '2022 • Platz da! • Tankstellenprojektraum • Group Exhibition',
      content: {},
      images: [
        {
          url: getImageUrl('exhibition/6 - Lichtbildnerei.webp'), // "do a kickflip"
          alt: 'do a kickflip',
          id: 'platz-da-6'
        }
      ]
    },
    {
      id: 'lichtbildnerei-2023',
      label: '2023 • Lichtbildnerei • Tankstellenprojektraum • Solo Exhibition', 
      content: {},
      images: [
        {
          url: getImageUrl('exhibition/4 - Lichtbildnerei.webp'), // "Covid-19"
          alt: 'Covid-19',
          id: 'lichtbildnerei-4'
        },
        {
          url: getImageUrl('exhibition/5 - Lichtbildnerei.webp'), // "an expression of wealth"
          alt: 'an expression of wealth', 
          id: 'lichtbildnerei-5'
        }
      ]
    },
    {
      id: 'amore-2024',
      label: '2024 • Amore • Galerie Borssenanger • Group Exhibition',
      content: {},
      images: [
        {
          url: getImageUrl('exhibition/Amore I.webp'), // "Amore I"
          alt: 'Amore I',
          id: 'amore-1'
        },
        {
          url: getImageUrl('exhibition/2 - Amore.webp'), // "Amore II"
          alt: 'Amore II',
          id: 'amore-2'
        },
        {
          url: getImageUrl('exhibition/3 - Amore.webp'), // "Amore III"
          alt: 'Amore III',
          id: 'amore-3'
        }
      ]
    },
    {
      id: 'amore-europa-2025',
      label: '2025 • Amore Europa • Galerie Borssenanger • Group Exhibition',
      content: {},
      images: [
        {
          url: getImageUrl('exhibition/2 - Amore.webp'), // "Europa"
          alt: 'Europa',
          id: 'amore-europa-16'
        }
      ]
    },
    {
      id: 'momentum-2025',
      label: '2025 • Momentum x Betrieb.kollektiv • Momentum • Group Exhibition',
      content: {},
      images: [
        {
          url: getImageUrl('exhibition/25 - Momentum.webp'), // "Industrie und Landschaft des bezierkes karlmarx-stadt"
          alt: 'Industrie und Landschaft des bezierkes karlmarx-stadt',
          id: 'momentum-25'
        }
      ]
    },
    {
      id: 'best-of-visitors-choice-2025',
      label: '2025 • Best of II - Visitors Choice • Museum Gunzenhauser • Group Exhibition',
      content: {},
      images: [
        {
          url: getImageUrl('exhibition/28 - Best of II - Visitors Choise.webp'), // "sinteză"
          alt: 'sinteză',
          id: 'best-of-28'
        },
        {
          url: getImageUrl('exhibition/29 - Best of II - Visitors Choise.webp'), // "self potrait"
          alt: 'self potrait',
          id: 'best-of-29'
        }
      ]
    }
  ]
}
