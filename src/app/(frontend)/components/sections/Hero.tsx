'use server'

import { getHeroImage } from '../services/hero/getHeroImage'
import ClientHero from '../sections/ClientHero'
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
  const mobileUrl = '/images/worksplaceholderI.jpg'

  const desktopUrl = heroImage.desktopImage.url.startsWith('/')
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}${heroImage.desktopImage.url}`
    : heroImage.desktopImage.url

  return (
    <ClientHero
      mobileUrl={mobileUrl}
      desktopUrl={desktopUrl}
      altText={heroImage.altText || 'Hero image'}
    />
  )
}
