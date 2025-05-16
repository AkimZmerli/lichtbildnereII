'use client'

import CinematicHero from './CinematicHero'

interface ClientHeroProps {
  mobileUrl: string
  desktopUrl: string
  altText: string
}

export default function ClientHero({ mobileUrl, desktopUrl, altText }: ClientHeroProps) {
  return (
    <CinematicHero
      mobileUrl={mobileUrl}
      desktopUrl={desktopUrl}
      altText={altText}
      initialViewportHeight="45vh"
      initialViewportWidth="80%"
      scrollFactor={1.2}
      allowSkip={true} // implement toggle switch after full screen
      storageKey="hero-animation-viewed" // localStorage key to remember if animation was played
    />
  )
}
