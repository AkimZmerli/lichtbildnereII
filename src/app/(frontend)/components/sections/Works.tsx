import Image from 'next/image'
import Link from 'next/link'

export default function Works() {
  return (
    <section className="bg-black text-white px-6 py-16 md:py-24 space-y-24 h-full md:pb-96">
      {/* WORKS */}
      <div className="text-center">
        <h2 className="uppercase tracking-widest mb-12 text-2xl text-white border-t border-white pt-6 inline-block">
          Works
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center md:gap-70 gap-12">
          {/* HUMAN */}
          <div className="text-center space-y-4 ">
            <h3 className="flex justify-start uppercase text-lg tracking-wider">Human</h3>
            <Image
              src="/images/worksplaceholderII.jpg"
              alt="Human Gallery"
              width={400}
              height={350}
              className="object-cover rounded-sm"
            />

            <Link
              href="/gallery/human"
              className="text-hot-pink underline underline-offset-4 flex justify-end"
            >
              view gallery →
            </Link>
          </div>

          {/* NON-HUMAN */}
          <div className="text-center space-y-4 md:translate-y-50">
            <h3 className="flex justify-start uppercase text-lg tracking-wider">Non Human</h3>
            <Image
              src="/images/worksplaceholderI.jpg"
              alt="Non-Human Gallery"
              width={300}
              height={500}
              className="object-cover rounded-sm"
            />

            <Link
              href="/gallery/non-human"
              className="text-hot-pink underline underline-offset-4 flex justify-end"
            >
              view gallery →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
