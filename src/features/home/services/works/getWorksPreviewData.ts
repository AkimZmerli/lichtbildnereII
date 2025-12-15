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
  // Use Cloudinary CDN URLs for optimized delivery
  return {
    human: {
      url: 'https://res.cloudinary.com/dnnnchnqv/image/upload/f_auto,q_auto/new-front-Human_mqg4xm',
      alt: 'Human Gallery Preview',
      width: 430,
      height: 333
    },
    nonHuman: {
      url: 'https://res.cloudinary.com/dnnnchnqv/image/upload/f_auto,q_auto/v1765803222/portfolio/works-preview/WorksPreviewNonHuman.webp',
      alt: 'Non-Human Gallery Preview',
      width: 430,
      height: 333
    }
  }
}