'use server'

import ClientHero from './ClientHero'

export default async function Hero() {
  // Use hero images from Cloudinary CDN
  const mobileUrl = 'https://res.cloudinary.com/dnnnchnqv/image/upload/f_auto,q_auto/v1765803216/portfolio/hero/HeroMobile.webp'
  const desktopUrl = 'https://res.cloudinary.com/dnnnchnqv/image/upload/f_auto,q_auto/v1765803208/portfolio/hero/HeroDesktop.webp'
  
  return (
    <ClientHero
      mobileUrl={mobileUrl}
      desktopUrl={desktopUrl}
      altText="Valentin Mici - Portfolio Hero"
    />
  )
}
