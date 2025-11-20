import Link from 'next/link'

export default function HiddenGem() {
  return (
    <section id="closing-words" className="bg-grainy text-white-rose">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
        <h2 className="uppercase mb-12 text-2xl tracking-[0.5em]">CLOSING WORDS</h2>

        <div className="space-y-8 max-w-2xl mx-auto">
          <div className="text-lg leading-relaxed space-y-4">
            <p>
              Thank you for taking the time to explore my work.
            </p>
            <p>
              Here&apos;s a short film from my first exhibition at Tankstelle Projektraum:
            </p>
          </div>

          <div className="pt-4">
            <Link
              href="/zwoelftausend"
              className="inline-flex items-center gap-2 px-6 py-3 border border-hot-pink/30 text-hot-pink hover:bg-hot-pink hover:text-grainy hover:border-hot-pink transition-all duration-300 ease-out hover:scale-105 active:scale-95 bg-grainy/80 backdrop-blur-sm rounded-md"
            >
              press play ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
