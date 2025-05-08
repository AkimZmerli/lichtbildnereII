'use server'

import { getHeroImage } from '../services/hero/getHeroImage'
import HeroClient from './HeroClient'

export default async function Hero() {
  const heroImage = await getHeroImage()
  console.log('Hero component received:', heroImage)

  if (!heroImage) {
    return (
      <div className="relative w-full h-[50vh] md:h-[70vh] bg-gray-200 flex items-center justify-center">
        <p>No hero image found</p>
      </div>
    )
  }

  // Add full URL if needed
  const mobileUrl = heroImage.mobileImage?.url?.startsWith('/')
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}${heroImage.mobileImage.url}`
    : heroImage.mobileImage?.url

  const desktopUrl = heroImage.desktopImage?.url?.startsWith('/')
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}${heroImage.desktopImage.url}`
    : heroImage.desktopImage?.url

  return <HeroClient mobileUrl={mobileUrl} desktopUrl={desktopUrl} altText={heroImage.altText} />
}
