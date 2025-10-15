interface SocialBookData {
  coverImage: {
    url: string
    alt?: string
  }
  title?: string
  buttonText?: string
}

export const getSocialBookData = async (): Promise<SocialBookData> => {
  console.log('Getting social book data - static implementation pending')
  
  // Return placeholder data for now - will be replaced with static implementation
  return {
    coverImage: {
      url: '/images/placeholderSocial.png',
      alt: 'The Social Book'
    },
    title: 'THE SOCIAL BOOK',
    buttonText: 'take a look in the book ↗'
  }
}