import Header from '@/features/shared/components/Header'
import Footer from '@/features/shared/components/Footer'
import Link from 'next/link'

export default function DisplayScan() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Spacer div to push content below fixed header */}
      <div className="h-15"></div>

      <div className="flex-1 bg-grainy text-white-rose p-4 md:p-8 pb-8">
        <h1 className="text-xl md:text-2xl text-center tracking-[0.3em] md:tracking-[0.5em] font-normal font-lato mb-6 md:mb-8">
          T A N K S T E L L E
        </h1>

        {/* Responsive 3D Container */}
        <div className="w-full max-w-4xl mx-auto mb-6 md:mb-8">
          <div className="relative w-full bg-neutral-900 rounded-sm overflow-hidden">
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
        </div>

        {/* Back Link */}
        <div className="w-full max-w-4xl mx-auto">
          <Link
            href="/about-exhibition"
            className="inline-block text-hot-pink hover:underline text-base md:text-lg transition-colors duration-200"
          >
            ← go back
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
