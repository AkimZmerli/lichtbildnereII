import { getImageUrl } from '../../../../lib/blob'

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
  // Use blob URLs in production, local paths in development
  const isProduction = process.env.NODE_ENV === 'production'
  
  if (isProduction) {
    return {
      human: {
        url: getImageUrl('works-preview/WorksPreviewHuman.webp'),
        alt: 'Human Gallery Preview',
        width: 430,
        height: 333
      },
      nonHuman: {
        url: getImageUrl('works-preview/WorksPreviewNonHuman.webp'),
        alt: 'Non-Human Gallery Preview',
        width: 430,
        height: 333
      }
    }
  } else {
    // Local development - use local files
    return {
      human: {
        url: `/media/works-preview/WorksPreviewHuman.webp`,
        alt: 'Human Gallery Preview',
        width: 430,
        height: 333
      },
      nonHuman: {
        url: `/media/works-preview/WorksPreviewNonHuman.webp`,
        alt: 'Non-Human Gallery Preview',
        width: 430,
        height: 333
      }
    }
  }
}