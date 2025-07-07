import Footer from '@/features/shared/components/Footer'
import Header from '@/features/shared/components/Header'
import Hero from '@/features/shared/components/Hero'
import SocialBook from '@/features/social-book/components/SocialBook'
import Works from '@/features/shared/components/Works'

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
