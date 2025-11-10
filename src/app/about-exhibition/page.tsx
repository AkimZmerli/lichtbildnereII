import Footer from '@/shared/layout/Footer'
import Header from '@/shared/layout/Header'
import About from '@/features/exhibition/components/About'
import Exhibition from '@/features/exhibition/components/Exhibition'
import HiddenGem from '@/features/exhibition/components/HiddenGem'
import ScrollToSection from '@/shared/utils/scrollToSection'


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
