import Header from '@/shared/layout/Header'
import Footer from '@/shared/layout/Footer'
import Works from '@/features/home/components/Works'
import SocialBook from '@/features/social-book/components/SocialBook'


export default function WorksPage() {
  return (
    <div className="min-h-screen bg-grainy">
      <Header />
      <main className="pt-[70px]">
        <Works />
        <SocialBook />
      </main>
      <Footer />
    </div>
  )
}