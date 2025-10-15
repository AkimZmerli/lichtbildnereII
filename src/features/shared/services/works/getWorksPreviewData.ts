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
  console.log('Getting works preview data - static implementation pending')
  
  // Return placeholder data for now - will be replaced with static implementation
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