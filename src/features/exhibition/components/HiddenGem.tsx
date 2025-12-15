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
              className="inline-block text-hot-pink hover:underline underline-offset-4 transition-all duration-200 hover:translate-y-[-2px] bg-grainy/80 backdrop-blur-sm px-4 py-2 rounded-md border border-hot-pink/30"
            >
              press play ↗
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
