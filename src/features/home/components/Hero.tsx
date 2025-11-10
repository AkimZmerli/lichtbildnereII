'use server'

import ClientHero from './ClientHero'
import { getImageUrl } from '../../../lib/blob'

export default async function Hero() {
  // Use hero images from blob storage
  const mobileUrl = getImageUrl('hero/HeroMobile.webp')
  const desktopUrl = getImageUrl('hero/HeroDesktop.webp')
  
  return (
    <ClientHero
      mobileUrl={mobileUrl}
      desktopUrl={desktopUrl}
      altText="Valentin Mici - Portfolio Hero"
    />
  )
}
