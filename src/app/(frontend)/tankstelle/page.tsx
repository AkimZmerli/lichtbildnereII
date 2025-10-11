import Header from '@/features/shared/components/Header'
import Footer from '@/features/shared/components/Footer'
import Link from 'next/link'

export default function DisplayScan() {
  return (
    <div className="min-h-screen flex flex-col bg-grainy">
      <Header />

      <div className="flex-1 flex items-center justify-center bg-grainy text-white-rose px-4 md:px-8 relative pt-20 md:pt-24">
        {/* Back Link - positioned at top left on desktop */}
        <div className="absolute top-26 left-8 hidden md:block">
          <Link
            href="/about-exhibition#exhibition"
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
                src="https://sketchfab.com/models/7064a9e443aa4493a995a7a39320c6f6/embed"
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </div>
          
          {/* Back Link for mobile - stays below media */}
          <div className="mt-8 md:hidden">
            <Link
              href="/about-exhibition#exhibition"
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
