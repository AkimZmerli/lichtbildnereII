'use client'
import { useEffect, useRef, useState } from 'react'
import Header from '@/features/shared/components/Header'
import Footer from '@/features/shared/components/Footer'
import Link from 'next/link'

export default function DisplayScan() {
  const videoRef = useRef<HTMLElement>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [showUnmutePrompt, setShowUnmutePrompt] = useState(true)

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

  const handleUnmute = () => {
    if (videoRef.current) {
      // Remove muted attribute and unmute the player
      videoRef.current.removeAttribute('muted')
      videoRef.current.setAttribute('volume', '1')
      setIsMuted(false)
      setShowUnmutePrompt(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-grainy">
      <Header />

      <div className="flex-1 flex items-center justify-center bg-grainy text-white-rose px-4 md:px-8 relative pt-20 md:pt-24">
        {/* Back Link - positioned at top left on desktop */}
        <div className="absolute top-26 left-8 hidden md:block">
          <Link
            href="/about-exhibition#closing-words"
            className="inline-block text-hot-pink hover:underline underline-offset-4 transition-all duration-200 hover:translate-y-[-2px] bg-grainy/80 backdrop-blur-sm px-4 py-2 rounded-md border border-hot-pink/30"
          >
            ← go back
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
              autoplay={true}
              muted={isMuted}
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
            
            {/* Unmute Prompt Overlay */}
            {showUnmutePrompt && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px] rounded-sm">
                <button
                  onClick={handleUnmute}
                  className="group relative bg-black/70 hover:bg-black/80 border border-white/20 hover:border-hot-pink/50 rounded-lg px-6 py-4 transition-all duration-300 ease-out hover:scale-105 active:scale-95"
                >
                  <div className="flex items-center gap-3">
                    {/* Speaker Icon */}
                    <svg 
                      className="w-6 h-6 text-white-rose group-hover:text-hot-pink transition-colors duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z" 
                      />
                    </svg>
                    <div className="text-left">
                      <div className="text-white-rose group-hover:text-hot-pink font-light tracking-wider uppercase text-sm transition-colors duration-300">
                        <span className="hidden md:inline">Click to Unmute</span>
                        <span className="md:hidden">Tap to Unmute</span>
                      </div>
                      <div className="text-white-rose/70 text-xs font-light mt-1">
                        Experience the full audio
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Back Link for mobile - stays below media */}
          <div className="mt-8 md:hidden">
            <Link
              href="/about-exhibition#closing-words"
              className="inline-block text-hot-pink hover:underline underline-offset-4 transition-all duration-200 hover:translate-y-[-2px] bg-grainy/80 backdrop-blur-sm px-4 py-2 rounded-md border border-hot-pink/30"
            >
              ← go back
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
