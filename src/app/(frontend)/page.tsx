import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import Hero from './components/sections/Hero'
import SocialBook from './components/sections/SocialBook'
import Works from './components/sections/Works'

export default function Home() {
  return (
    <div className="bg-grainy min-h-screen">
      <div>
        <main>
          <Header />
          <Hero />
          <Works />
          <SocialBook />
        </main>
        <Footer />
      </div>
    </div>
  )
}
