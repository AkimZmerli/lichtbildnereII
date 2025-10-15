'use server'

import ClientHero from './ClientHero'

export default async function Hero() {
  console.log('Hero component - static implementation pending')
  
  // Use placeholder images for now - will be replaced with static implementation
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
