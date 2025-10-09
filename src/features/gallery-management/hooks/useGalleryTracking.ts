'use client'

import { useEffect } from 'react'

export const useGalleryTracking = (galleryType: 'human' | 'non-human' | 'inverted') => {
  useEffect(() => {
    // Mark gallery as viewed
    if (typeof window !== 'undefined') {
      const viewedGalleries = JSON.parse(sessionStorage.getItem('viewedGalleries') || '[]')
      if (!viewedGalleries.includes(galleryType)) {
        viewedGalleries.push(galleryType)
        sessionStorage.setItem('viewedGalleries', JSON.stringify(viewedGalleries))
      }
    }
  }, [galleryType])

  const getViewedGalleries = (): string[] => {
    if (typeof window === 'undefined') return []
    return JSON.parse(sessionStorage.getItem('viewedGalleries') || '[]')
  }

  const hasViewedBothMainGalleries = (): boolean => {
    const viewed = getViewedGalleries()
    return viewed.includes('human') && viewed.includes('non-human')
  }

  const hasViewedAllGalleries = (): boolean => {
    const viewed = getViewedGalleries()
    return viewed.includes('human') && viewed.includes('non-human') && viewed.includes('inverted')
  }

  const resetGalleryTracking = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('viewedGalleries')
    }
  }

  return {
    getViewedGalleries,
    hasViewedBothMainGalleries,
    hasViewedAllGalleries,
    resetGalleryTracking
  }
}