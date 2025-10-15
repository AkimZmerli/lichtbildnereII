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
  return [
    {
      id: 'platz-da-2022',
      label: '2022 • Platz da! • Tankstellenprojektraum • Group Exhibition',
      content: {},
      images: [
        {
          url: '/media/exhibition/6 - Lichtbildnerei.jpg', // "do a kickflip"
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
          url: '/media/exhibition/4 - Lichtbildnerei.jpg', // "Covid-19"
          alt: 'Covid-19',
          id: 'lichtbildnerei-4'
        },
        {
          url: '/media/exhibition/5 - Lichtbildnerei.jpg', // "an expression of wealth"
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
          url: '/media/exhibition/Amore I.jpg', // "Amore I"
          alt: 'Amore I',
          id: 'amore-1'
        },
        {
          url: '/media/exhibition/2 - Amore.jpg', // "Amore II"
          alt: 'Amore II',
          id: 'amore-2'
        },
        {
          url: '/media/exhibition/3 - Amore.jpg', // "Amore III"
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
          url: '/media/exhibition/2 - Amore.jpg', // "Europa"
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
          url: '/media/exhibition/25 - Momentum.jpg', // "Industrie und Landschaft des bezierkes karlmarx-stadt"
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
          url: '/media/exhibition/28 - Best of II - Visitors Choise.jpg', // "sinteză"
          alt: 'sinteză',
          id: 'best-of-28'
        },
        {
          url: '/media/exhibition/29 - Best of II - Visitors Choise.jpg', // "self potrait"
          alt: 'self potrait',
          id: 'best-of-29'
        }
      ]
    }
  ]
}
