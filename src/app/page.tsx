import Footer from '@/shared/layout/Footer'
import Header from '@/shared/layout/Header'
import Hero from '@/features/home/components/Hero'
import SocialBook from '@/features/social-book/components/SocialBook'
import Works from '@/features/home/components/Works'


export default function Home() {
  return (
    <div className="bg-grainy min-h-screen">
      <Header />
      <div>
        <main>
          <Hero />
          <Works />
          <SocialBook />
          <Footer />
        </main>
      </div>
    </div>
  )
}
