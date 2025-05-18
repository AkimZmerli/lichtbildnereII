'use client'

import CinematicHero from './CinematicHero'

interface ClientHeroProps {
  mobileUrl: string
  desktopUrl: string
  altText: string
  title?: string
  subtitle?: string
  videoUrl?: string
}

export default function ClientHero({
  mobileUrl,
  desktopUrl,
  altText,
  title,
  subtitle,
  videoUrl,
}: ClientHeroProps) {
  return (
    <CinematicHero
      mobileUrl={mobileUrl}
      desktopUrl={desktopUrl}
      altText={altText}
      title={title}
      subtitle={subtitle}
      videoUrl={videoUrl}
      initialViewportHeight="45vh"
      initialViewportWidth="80%"
      scrollFactor={1.2}
      // Start with allowSkip false - the component will automatically
      // toggle this to true after animation completes
      allowSkip={false}
      storageKey="hero-animation-viewed"
    />
  )
}
