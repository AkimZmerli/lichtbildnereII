import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Link from 'next/link'

export default function DisplayScan() {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-grainy text-white-rose p-8">
        <h1 className="text-2xl text-center tracking-[0.5em] font-normal font-lato mb-8">
          T A N K S T E L L E
        </h1>
        <div className="w-full max-w-[1200px] mx-auto aspect-video relative">
          <iframe
            title="projektraum tankstelle"
            allowFullScreen
            allow="autoplay; fullscreen; xr-spatial-tracking"
            src="https://sketchfab.com/models/7064a9e443aa4493a995a7a39320c6f6/embed"
            className="w-full h-[600px]"
          ></iframe>
        </div>

        <Link href="/" className="inline-block mt-8 text-hot-pink hover:underline text-lg">
          ← go back
        </Link>
      </div>
      <Footer />
    </div>
  )
}
