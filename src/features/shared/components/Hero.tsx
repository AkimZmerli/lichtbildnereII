'use server'

import { getHeroImage } from '../services/hero/getHeroImage'
import ClientHero from './ClientHero'

interface HeroImage {
  mobileImage?: { url: string }
  desktopImage?: { url: string }
  altText: string
}

export default async function Hero() {
  const heroImage = (await getHeroImage()) as HeroImage
  // console.log('Hero component received:', heroImage)

  // Check if we have hero images from Payload
  if (!heroImage?.mobileImage?.url || !heroImage?.desktopImage?.url) {
    // Use placeholder if no images in database
    const mobileUrl = '/images/placeholderSocial.png'
    const desktopUrl = '/images/placeholderSocial.png'
    return (
      <ClientHero
        mobileUrl={mobileUrl}
        desktopUrl={desktopUrl}
        altText="Hero image"
      />
    )
  }
  
  // Use Payload images - they should be served from /api/media/[id]
  const mobileUrl = heroImage.mobileImage.url.startsWith('/')
    ? `${process.env.NEXT_PUBLIC_SERVER_URL}${heroImage.mobileImage.url}`
    : heroImage.mobileImage.url
  
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
