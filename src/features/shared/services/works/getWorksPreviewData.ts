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
    const apiUrl = process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:3000'
    const url = `${apiUrl}/api/works-preview`
    
    console.log('Fetching works preview data from:', url)
    
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error(`Works Preview API response not ok: ${response.status} ${response.statusText}`)
      throw new Error('Failed to fetch works preview data')
    }

    const data = await response.json()
    console.log('Works Preview API response:', data)
    console.log('Number of docs found:', data.docs?.length || 0)
    
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