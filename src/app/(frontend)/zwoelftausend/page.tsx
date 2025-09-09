'use client'
import { useEffect, useRef } from 'react'
import Header from '@/features/shared/components/Header'
import Footer from '@/features/shared/components/Footer'
import Link from 'next/link'

export default function DisplayScan() {
  const videoRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Dynamically import Mux Player only on client side
    const loadMuxPlayer = async () => {
      if (typeof window !== 'undefined') {
        try {
          const MuxPlayerElement = (await import('@mux/mux-player')).default

          // Register the custom element if not already registered
          if (!customElements.get('mux-player')) {
            customElements.define('mux-player', MuxPlayerElement)
          }
        } catch (error) {
          console.error('Failed to load Mux Player:', error)
        }
      }
    }

    loadMuxPlayer()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Spacer div to push content below fixed header */}
      <div className="h-15"></div>
      
      <div className="bg-grainy text-white-rose p-4 md:p-8 pb-8 flex-1">
        <h1 className="text-xl md:text-2xl text-center tracking-[0.2em] font-normal font-lato mb-8">
          Z W Ö L F T A U S E N D
        </h1>

        {/* Responsive Video Container */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative w-full h-[270px] md:h-[400px] lg:h-[600px]">
            {/* @ts-ignore - Custom element, TypeScript doesn't recognize it */}
            <mux-player
              ref={videoRef}
              playback-id="SvNv6eqQ602PZet4XCY17Jlpyak1GbwjsjQlogQCldF4"
              metadata-video-title="Zwölftausend"
              metadata-viewer-user-id="guest"
              stream-type="on-demand"
              controls
              autoplay="true"
              muted
              className="w-full h-full rounded-sm"
              style={
                {
                  '--media-object-fit': 'contain',
                  '--media-object-position': 'center',
                  '--controls-background': 'rgba(0, 0, 0, 0.7)',
                  '--media-primary-color': '#ec4899',
                } as React.CSSProperties
              }
            />
          </div>
        </div>

        {/* Back Link */}
        <div className="max-w-4xl mx-auto">
          <Link
            href="/about-exhibition"
            className="inline-block text-hot-pink hover:underline text-base md:text-lg transition-colors"
          >
            ← go back
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
