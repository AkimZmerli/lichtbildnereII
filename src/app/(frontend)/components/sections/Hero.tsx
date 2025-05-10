'use server'

import { getHeroImage } from '../services/hero/getHeroImage'
import CinematicHero from './CinematicHero'

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

  // Prepare URLs
  const mobileUrl = heroImage.mobileImage.url.startsWith('/')
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}${heroImage.mobileImage.url}`
    : heroImage.mobileImage.url

  const desktopUrl = heroImage.desktopImage.url.startsWith('/')
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}${heroImage.desktopImage.url}`
    : heroImage.desktopImage.url

  // Convert TIFF to JPG if needed
  const finalMobileUrl =
    mobileUrl.endsWith('.tif') || mobileUrl.endsWith('.tiff')
      ? mobileUrl.replace(/\.tiff?$/, '.jpg')
      : mobileUrl

  console.log('Final URLs:', {
    mobileUrl: finalMobileUrl,
    desktopUrl,
  })

  return (
    <CinematicHero
      mobileUrl={finalMobileUrl}
      desktopUrl={desktopUrl}
      altText={heroImage.altText || 'Hero image'}
      initialViewportHeight="45vh"
      initialViewportWidth="80%"
      scrollFactor={1.2}
      allowSkip={true} // Set to false to always show animation, even for returning visitors
      storageKey="hero-animation-viewed" // localStorage key to remember if animation was played
    />
  )
}
