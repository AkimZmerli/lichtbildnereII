import Footer from '@/features/shared/components/Footer'
import Header from '@/features/shared/components/Header'
import About from '@/features/shared/components/About'
import Exhibition from '@/features/shared/components/Exhibition'
import HiddenGem from '@/features/shared/components/HiddenGem'
import ScrollToSection from '@/features/shared/utils/scrollToSection'


export default function AboutExhibition() {
  return (
    <div>
      <Header />
      <ScrollToSection />
      <About />
      <ScrollToSection />
      <Exhibition />
      <HiddenGem />
      <Footer />
    </div>
  )
}
