import { Suspense } from 'react'
import { getSlides } from '../services/hero/getSlides'
import ExhibitionList from './ExhibitionList'

export default async function Exhibition() {
  const slides = await getSlides()
  
  // Sort slides by first number in label (smallest years to highest)
  const sortedSlides = slides.sort((a, b) => {
    const yearA = parseInt(a.label.match(/\d+/)?.[0] || '0', 10)
    const yearB = parseInt(b.label.match(/\d+/)?.[0] || '0', 10)
    return yearA - yearB
  })

  return (
    <section id="exhibition" className="text-white-rose" style={{
      backgroundColor: '#2A2323',
      backgroundImage: 'url("/images/Grainy_texture.png")',
      backgroundRepeat: 'repeat',
      backgroundPosition: 'center',
      backgroundSize: '200px 200px',
      backgroundAttachment: 'fixed'
    }}>
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h2 className="uppercase tracking-widest mb-12 text-center text-2xl">
          E X H I B I T I O N S
        </h2>

        <Suspense fallback={<div>Loading...</div>}>
          <ExhibitionList slides={sortedSlides} />
        </Suspense>
      </div>
    </section>
  )
}
