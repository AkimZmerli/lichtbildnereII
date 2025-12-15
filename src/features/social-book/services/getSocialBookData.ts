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
  
  // Use Cloudinary CDN URL for optimized delivery
  const imageUrl = 'https://res.cloudinary.com/dnnnchnqv/image/upload/f_auto,q_auto:good/v1765803191/portfolio/flipbook/Social.webp'
  
  return {
    coverImage: {
      url: imageUrl,
      alt: 'The Social Book'
    },
    title: 'THE SOCIAL BOOK',
    buttonText: 'take a look in the book ↗'
  }
}