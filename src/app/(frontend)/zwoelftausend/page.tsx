import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Link from 'next/link'

export default function DisplayScan() {
  return (
    <div>
      <Header />
      <div className="min-h-screen bg-grainy text-white-rose p-8">
        <h1 className="text-2xl text-center tracking-[0.2em] font-normal font-lato mb-8">
          Z W Ö L F T A U S E N D
        </h1>
        <div className="w-[896px] h-[632px] mx-auto aspect-video relative">
          <iframe
            title="zwoelftausend short movie"
            allowFullScreen
            allow="autoplay; fullscreen; xr-spatial-tracking; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            src="https://www.youtube.com/embed/UxW4BC9YngI"
            className="w-full h-full"
          ></iframe>
        </div>
        <div className="w-[896px] mx-auto mb-11">
          <Link
            href="/about-exhibition"
            className="inline-block mt-8 text-hot-pink hover:underline text-lg"
          >
            ← go back
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
}
