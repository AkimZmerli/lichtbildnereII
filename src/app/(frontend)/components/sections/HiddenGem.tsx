import Link from 'next/link'

export default function HiddenGem() {
  return (
    <section className="bg-grainy text-white-rose">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
        <h2 className="uppercase mb-12 text-2xl tracking-[0.5em]">HIDDEN CONTENT </h2>

        <div className="space-y-6 max-w-2xl mx-auto">
          <p className="">Thank you so much for taking your time to view my whole page.</p>
          <p className=" mb-12">Here's a little present for you:</p>

          <Link
            href="/zwoelftausend"
            className="inline-block text-hot-pink hover:underline transition-colors underline-offset-4"
          >
            press play
          </Link>
        </div>
      </div>
    </section>
  )
}
