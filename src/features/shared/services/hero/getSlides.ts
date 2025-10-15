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
          url: '/media/exhibitions/6-platz-da.jpg', // "do a kickflip"
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
          url: '/media/exhibitions/4-covid19.jpg', // "Covid-19"
          alt: 'Covid-19',
          id: 'lichtbildnerei-4'
        },
        {
          url: '/media/exhibitions/5-wealth.jpg', // "an expression of wealth"
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
          url: '/media/exhibitions/1-amore-i.jpg', // "Amore I"
          alt: 'Amore I',
          id: 'amore-1'
        },
        {
          url: '/media/exhibitions/2-amore-ii.jpg', // "Amore II"
          alt: 'Amore II',
          id: 'amore-2'
        },
        {
          url: '/media/exhibitions/3-amore-iii.jpg', // "Amore III"
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
          url: '/media/exhibitions/16-europa.jpg', // "Europa"
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
          url: '/media/exhibitions/25-industrie-landschaft.jpg', // "Industrie und Landschaft des bezierkes karlmarx-stadt"
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
          url: '/media/exhibitions/28-sinteza.jpg', // "sinteză"
          alt: 'sinteză',
          id: 'best-of-28'
        },
        {
          url: '/media/exhibitions/29-self-portrait.jpg', // "self potrait"
          alt: 'self potrait',
          id: 'best-of-29'
        }
      ]
    }
  ]
}
