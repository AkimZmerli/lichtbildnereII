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
    <div className="min-h-screen flex flex-col bg-grainy">
      <Header />

      <div className="flex-1 flex items-center justify-center bg-grainy text-white-rose px-4 md:px-8 relative pt-20 md:pt-24">
        {/* Back Link - positioned at top left on desktop */}
        <div className="absolute top-26 left-8 hidden md:block">
          <Link
            href="/about-exhibition#closing-words"
            className="group inline-flex items-center gap-2 text-hot-pink hover:text-white-rose hover:scale-105 active:scale-95 transition-all duration-300 ease-out"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
            <span className="font-light tracking-wider uppercase text-sm">Go Back</span>
          </Link>
        </div>

        <div className="w-full max-w-4xl mt-[5%]">
          <h1 className="text-xl md:text-2xl text-center tracking-[0.2em] font-normal font-lato mb-12 md:mb-16">
            Z W Ö L F T A U S E N D
          </h1>

          {/* Responsive Video Container */}
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
                  '--controls-background': '#2A2323',
                  '--media-primary-color': '#8B5CF6',
                  '--media-accent-color': '#D97706',
                  '--media-control-hover-background': 'rgba(217, 119, 6, 0.2)',
                  '--media-range-thumb-hover-background': '#D97706',
                } as React.CSSProperties
              }
            />
          </div>

          {/* Back Link for mobile - stays below media */}
          <div className="mt-8 md:hidden">
            <Link
              href="/about-exhibition#closing-words"
              className="group inline-flex items-center gap-2 text-hot-pink hover:text-white-rose hover:scale-105 active:scale-95 transition-all duration-300 ease-out"
            >
              <svg
                className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 17l-5-5m0 0l5-5m-5 5h12"
                />
              </svg>
              <span className="font-light tracking-wider uppercase text-sm">Go Back</span>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
