import Image from 'next/image'
import Link from 'next/link'

export default function Works() {
  return (
    <section className="bg-black text-white px-6 py-16 md:py-24 space-y-24">
      {/* WORKS */}
      <div className="text-center">
        <h2 className="uppercase tracking-widest mb-12 text-lg text-white border-t border-white pt-6 inline-block">
          Works
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-12">
          {/* HUMAN */}
          <div className="text-center space-y-4">
            <Image
              src="/placeholder-human.jpg"
              alt="Human Gallery"
              width={250}
              height={350}
              className="object-cover rounded-sm"
            />
            <h3 className="uppercase text-sm tracking-wider">Human</h3>
            <Link
              href="/gallery/human"
              className="text-hot-pink text-xs underline underline-offset-4"
            >
              view gallery →
            </Link>
          </div>

          {/* NON-HUMAN */}
          <div className="text-center space-y-4">
            <Image
              src="/placeholder-nonhuman.jpg"
              alt="Non-Human Gallery"
              width={250}
              height={350}
              className="object-cover rounded-sm"
            />
            <h3 className="uppercase text-sm tracking-wider">Non Human</h3>
            <Link
              href="/gallery/non-human"
              className="text-hot-pink text-xs underline underline-offset-4"
            >
              view gallery →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
