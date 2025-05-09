'use server'

import { getHeroImage } from '../services/hero/getHeroImage'
import HeroClient from './HeroClient'

interface HeroImage {
  mobileImage?: { url: string }
  desktopImage?: { url: string }
  altText: string
}

export default async function Hero() {
  const heroImage = (await getHeroImage()) as HeroImage
  console.log('Hero component received:', heroImage)

  if (!heroImage?.mobileImage?.url || !heroImage?.desktopImage?.url) {
    return (
      <div className="relative w-full h-[50vh] md:h-[70vh] bg-gray-200 flex items-center justify-center">
        <p>No hero image found</p>
      </div>
    )
  }

  // Ensure URLs are absolute and handle TIF format
  const mobileUrl = heroImage.mobileImage.url.startsWith('/')
    ? `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}${heroImage.mobileImage.url.replace('.tif', '.jpg')}`
    : heroImage.mobileImage.url

  const desktopUrl = heroImage.desktopImage.url.startsWith('/')
    ? `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}${heroImage.desktopImage.url}`
    : heroImage.desktopImage.url

  console.log('Final URLs:', { mobileUrl, desktopUrl })

  return (
    <HeroClient
      mobileUrl={mobileUrl}
      desktopUrl={desktopUrl}
      altText={heroImage.altText || 'Hero image'}
      scrollFactor={0.8}
    />
  )
}
