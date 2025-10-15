'use server'

import ClientHero from './ClientHero'

export default async function Hero() {
  // Use static hero images from public/media/hero directory
  const mobileUrl = '/media/hero/HeroMobile.jpg'
  const desktopUrl = '/media/hero/HeroDesktop.jpg'
  
  return (
    <ClientHero
      mobileUrl={mobileUrl}
      desktopUrl={desktopUrl}
      altText="Valentin Mici - Portfolio Hero"
    />
  )
}
