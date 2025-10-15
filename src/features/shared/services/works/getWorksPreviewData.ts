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
  // Return static works preview data
  return {
    human: {
      url: '/media/works-preview/WorksPreviewHuman.png',
      alt: 'Human Gallery Preview',
      width: 430,
      height: 333
    },
    nonHuman: {
      url: '/media/works-preview/WorksPreviewNonHuman.png',
      alt: 'Non-Human Gallery Preview',
      width: 430,
      height: 333
    }
  }
}