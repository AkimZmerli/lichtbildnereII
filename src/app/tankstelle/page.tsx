'use client'
import { useEffect, useState } from 'react'
import Header from '@/shared/layout/Header'
import Footer from '@/shared/layout/Footer'
import Link from 'next/link'

export default function DisplayScan() {
  const [showHelp, setShowHelp] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHelp(false)
    }, 4000) // Hide after 4 secon

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-grainy">
      <Header />

      <div className="flex-1 flex items-center justify-center bg-grainy text-white-rose px-4 md:px-8 relative pt-24 md:pt-24">
        {/* Back Link - positioned at top left on desktop */}
        <div className="absolute top-26 left-8 hidden md:block">
          <Link
            href="/about-exhibition#exhibition"
            className="inline-block text-hot-pink hover:underline underline-offset-4 transition-all duration-200 hover:translate-y-[-2px] bg-grainy/80 backdrop-blur-sm px-4 py-2 rounded-md border border-hot-pink/30"
          >
            ← go back
          </Link>
        </div>

        <div className="w-full max-w-4xl mt-[0%]">
          <h1 className="text-xl md:text-2xl text-center tracking-[0.3em] md:tracking-[0.5em] font-normal font-lato mb-12 md:mb-16">
            T A N K S T E L L E
          </h1>

          {/* Responsive 3D Container */}
          <div className="w-full bg-neutral-900 rounded-sm overflow-hidden">
            {/* Aspect ratio container */}
            <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px]">
              <iframe
                title="Projektraum Tankstelle - 3D Scan"
                allowFullScreen
                allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; gyroscope"
                src="https://sketchfab.com/models/7064a9e443aa4493a995a7a39320c6f6/embed?ui_theme=dark&ui_color=8B5CF6&annotations=0&ui_stop=0&ui_watermark=0&ui_hint=0&ui_controls=1&ui_infos=0&ui_inspector=0"
                className="absolute inset-0 w-full h-full border-0"
              />

              {/* Navigation Help Overlay */}
              {showHelp && (
                <div className="absolute top-4 left-4 right-4 md:right-auto pointer-events-none">
                  <div className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-lg p-3 md:p-4 max-w-xs md:max-w-sm transition-opacity duration-500">
                    <div className="flex items-start gap-2 md:gap-3">
                      <div className="flex-shrink-0">
                        <svg
                          className="w-4 h-4 md:w-5 md:h-5 text-hot-pink mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="text-white-rose text-xs md:text-sm space-y-1">
                        <p className="font-light">Navigate:</p>
                        <ul className="text-xs text-white-rose/80 space-y-0.5 hidden md:block">
                          <li>• Click & drag to rotate</li>
                          <li>• Scroll or pinch to zoom</li>
                          <li>• Right-click & drag to pan</li>
                        </ul>
                        <ul className="text-xs text-white-rose/80 space-y-0.5 md:hidden">
                          <li>• Tap & drag</li>
                          <li>• Pinch to zoom</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Back Link for mobile - stays below media */}
          <div className="mt-8 md:hidden">
            <Link
              href="/about-exhibition#exhibition"
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
