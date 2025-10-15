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
          url: 'https://ckr77j2dv5dhtnev.public.blob.vercel-storage.com/exhibition/6%20-%20Lichtbildnerei.jpg', // "do a kickflip"
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
          url: 'https://ckr77j2dv5dhtnev.public.blob.vercel-storage.com/exhibition/4%20-%20Lichtbildnerei.jpg', // "Covid-19"
          alt: 'Covid-19',
          id: 'lichtbildnerei-4'
        },
        {
          url: 'https://ckr77j2dv5dhtnev.public.blob.vercel-storage.com/exhibition/5%20-%20Lichtbildnerei.jpg', // "an expression of wealth"
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
          url: 'https://ckr77j2dv5dhtnev.public.blob.vercel-storage.com/exhibition/Amore%20I.jpg', // "Amore I"
          alt: 'Amore I',
          id: 'amore-1'
        },
        {
          url: 'https://ckr77j2dv5dhtnev.public.blob.vercel-storage.com/exhibition/2%20-%20Amore.jpg', // "Amore II"
          alt: 'Amore II',
          id: 'amore-2'
        },
        {
          url: 'https://ckr77j2dv5dhtnev.public.blob.vercel-storage.com/exhibition/3%20-%20Amore.jpg', // "Amore III"
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
          url: 'https://ckr77j2dv5dhtnev.public.blob.vercel-storage.com/exhibition/2%20-%20Amore.jpg', // "Europa"
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
          url: 'https://ckr77j2dv5dhtnev.public.blob.vercel-storage.com/exhibition/25%20-%20Momentum.jpg', // "Industrie und Landschaft des bezierkes karlmarx-stadt"
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
          url: 'https://ckr77j2dv5dhtnev.public.blob.vercel-storage.com/exhibition/28%20-%20Best%20of%20II%20-%20Visitors%20Choise.jpg', // "sinteză"
          alt: 'sinteză',
          id: 'best-of-28'
        },
        {
          url: 'https://ckr77j2dv5dhtnev.public.blob.vercel-storage.com/exhibition/29%20-%20Best%20of%20II%20-%20Visitors%20Choise.jpg', // "self potrait"
          alt: 'self potrait',
          id: 'best-of-29'
        }
      ]
    }
  ]
}
