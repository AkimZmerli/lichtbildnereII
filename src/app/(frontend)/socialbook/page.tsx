import Header from '@/features/shared/components/Header'
import Footer from '@/features/shared/components/Footer'
import SocialBook from '@/features/social-book/components/SocialBook'

export default function SocialBookPage() {
  return (
    <div className="min-h-screen bg-grainy">
      <Header />
      <main className="pt-[70px]">
        <SocialBook />
      </main>
      <Footer />
    </div>
  )
}