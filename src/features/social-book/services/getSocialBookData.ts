interface SocialBookData {
  coverImage: {
    url: string
    alt?: string
  }
  title?: string
  buttonText?: string
}

export const getSocialBookData = async (): Promise<SocialBookData> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_API_URL}/api/social-book`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch social book data')
    }

    const data = await response.json()
    
    if (data.docs && data.docs.length > 0) {
      const socialBook = data.docs[0]
      return {
        coverImage: {
          url: socialBook.coverImage.url,
          alt: socialBook.altText || 'The Social Book'
        },
        title: socialBook.title || 'THE SOCIAL BOOK',
        buttonText: socialBook.buttonText || 'take a look in the book ↗'
      }
    }
    
    // Fallback to placeholder if no data in CMS
    return {
      coverImage: {
        url: '/images/placeholderSocial.png',
        alt: 'The Social Book'
      },
      title: 'THE SOCIAL BOOK',
      buttonText: 'take a look in the book ↗'
    }
  } catch (error) {
    console.error('Error fetching social book data:', error)
    
    // Fallback to placeholder on error
    return {
      coverImage: {
        url: '/images/placeholderSocial.png',
        alt: 'The Social Book'
      },
      title: 'THE SOCIAL BOOK',
      buttonText: 'take a look in the book ↗'
    }
  }
}