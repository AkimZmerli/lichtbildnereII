interface GalleryImage {
  url: string
  alt: string
  width: number
  height: number
}

interface GallerySettings {
  humanGallery: GalleryImage | null
  nonHumanGallery: GalleryImage | null
  invertedGallery: GalleryImage | null
}

export const getGallerySettings = async (): Promise<GallerySettings> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_API_URL}/api/site-settings`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch gallery settings')
    }

    const data = await response.json()
    
    const gallerySettings: GallerySettings = {
      humanGallery: null,
      nonHumanGallery: null,
      invertedGallery: null
    }
    
    if (data.docs && data.docs.length > 0) {
      const settings = data.docs[0] // Assuming single settings document
      
      if (settings.humanGallery) {
        gallerySettings.humanGallery = {
          url: settings.humanGallery.url,
          alt: settings.humanGallery.alt || 'Human Gallery',
          width: settings.humanGallery.width || 800,
          height: settings.humanGallery.height || 600
        }
      }
      
      if (settings.nonHumanGallery) {
        gallerySettings.nonHumanGallery = {
          url: settings.nonHumanGallery.url,
          alt: settings.nonHumanGallery.alt || 'Non-Human Gallery',
          width: settings.nonHumanGallery.width || 800,
          height: settings.nonHumanGallery.height || 600
        }
      }
      
      if (settings.invertedGallery) {
        gallerySettings.invertedGallery = {
          url: settings.invertedGallery.url,
          alt: settings.invertedGallery.alt || 'Inverted Gallery',
          width: settings.invertedGallery.width || 800,
          height: settings.invertedGallery.height || 600
        }
      }
    }
    
    return gallerySettings
  } catch (error) {
    console.error('Error fetching gallery settings:', error)
    
    // Return null values on error
    return {
      humanGallery: null,
      nonHumanGallery: null,
      invertedGallery: null
    }
  }
}