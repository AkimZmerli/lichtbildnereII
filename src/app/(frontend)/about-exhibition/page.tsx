import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import About from '../components/sections/About'
import Exhibition from '../components/sections/Exhibition'
import HiddenGem from '../components/sections/HiddenGem'
import ScrollToSection from '../components/utils/scrollToSection'
export default function AboutExhibition() {
  return (
    <div>
      <Header />
      <ScrollToSection />
      <About />
      <Exhibition />
      <Footer />
      <HiddenGem />
    </div>
  )
}
