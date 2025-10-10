interface WorksPreviewImage {
  url: string
  alt: string
  width: number
  height: number
}

interface WorksPreviewData {
  human: WorksPreviewImage
  nonHuman: WorksPreviewImage
}

export const getWorksPreviewData = async (): Promise<WorksPreviewData> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_API_URL}/api/works-preview`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch works preview data')
    }

    const data = await response.json()
    
    let humanImage: WorksPreviewImage = {
      url: '/images/worksplaceholderII.jpg',
      alt: 'Human Gallery',
      width: 430,
      height: 350
    }
    
    let nonHumanImage: WorksPreviewImage = {
      url: '/images/Hanoi.jpg',
      alt: 'Non-Human Gallery',
      width: 300,
      height: 500
    }
    
    if (data.docs && data.docs.length > 0) {
      // Find human and non-human preview images
      data.docs.forEach((item: any) => {
        if (item.galleryType === 'human') {
          humanImage = {
            url: item.previewImage.url,
            alt: item.altText || 'Human Gallery',
            width: item.previewImage.width || 430,
            height: item.previewImage.height || 350
          }
        } else if (item.galleryType === 'non-human') {
          nonHumanImage = {
            url: item.previewImage.url,
            alt: item.altText || 'Non-Human Gallery',
            width: item.previewImage.width || 300,
            height: item.previewImage.height || 500
          }
        }
      })
    }
    
    return {
      human: humanImage,
      nonHuman: nonHumanImage
    }
  } catch (error) {
    console.error('Error fetching works preview data:', error)
    
    // Fallback to placeholder images on error
    return {
      human: {
        url: '/images/worksplaceholderII.jpg',
        alt: 'Human Gallery',
        width: 430,
        height: 350
      },
      nonHuman: {
        url: '/images/Hanoi.jpg',
        alt: 'Non-Human Gallery',
        width: 300,
        height: 500
      }
    }
  }
}