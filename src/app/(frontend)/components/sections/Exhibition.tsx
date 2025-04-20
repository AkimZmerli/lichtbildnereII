import { Suspense } from 'react'
import { Slide, getSlides } from '../services/hero/getSlides'
import ExhibitionList from '../sections/ExhibitionList'

export default async function Exhibition() {
  const slides = await getSlides()

  return (
    <section className="bg-grainy text-white-rose min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h2 className="uppercase tracking-widest mb-12 text-center text-2xl">Exhibitions</h2>

        <Suspense fallback={<div>Loading...</div>}>
          <ExhibitionList slides={slides} />
        </Suspense>
      </div>
    </section>
  )
}
