import { getImageUrl } from '../../../config/blob'

interface SocialBookData {
  coverImage: {
    url: string
    alt?: string
  }
  title?: string
  buttonText?: string
}

export const getSocialBookData = async (): Promise<SocialBookData> => {
  console.log('Getting social book data - static implementation')
  
  // Use blob URLs in production, local paths in development
  const isProduction = process.env.NODE_ENV === 'production'
  const cacheBuster = `?v=${Date.now()}`
  
  const imageUrl = isProduction 
    ? getImageUrl('social-book/placeholderSocial.png')
    : `/images/placeholderSocial.png${cacheBuster}`
  
  return {
    coverImage: {
      url: imageUrl,
      alt: 'The Social Book'
    },
    title: 'THE SOCIAL BOOK',
    buttonText: 'take a look in the book ↗'
  }
}