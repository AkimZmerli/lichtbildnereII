import { Suspense } from 'react'
import { getSlides } from '../services/hero/getSlides'
import ExhibitionList from './ExhibitionList'
import Link from 'next/link'

export default async function Exhibition() {
  const slides = await getSlides()

  return (
    <section id="exhibition" className="bg-grainy text-white-rose">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h2 className="uppercase tracking-widest mb-12 text-center text-2xl">
          E X H I B I T I O N S
        </h2>

        <Suspense fallback={<div>Loading...</div>}>
          <ExhibitionList slides={slides} />
        </Suspense>

        <div className="mt-16 md:mt-20">
          You can visit my first exhibition{' '}
          <Link
            href="/tankstelle"
            className="font-lato underline-offset-4 text-hot-pink hover:underline transition-all duration-200 hover:translate-y-[-2px]"
          >
            here
          </Link>
        </div>
      </div>
    </section>
  )
}
