import Image from 'next/image'
import Link from 'next/link'

export default function Works() {
  return (
    <section
      id="works"
      className="bg-grainy text-white-rose py-16 md:py-24 space-y-24 h-full md:pb-96"
    >
      {/* WORKS */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-[1px] bg-white-rose flex-1" />
          <h2 className="tracking-widest text-2xl text-white-rose">W O R K S</h2>
          <div className="h-[1px] bg-white-rose flex-1" />
        </div>
        <div className="px-6">
          <div className="flex flex-col md:flex-row justify-center items-center md:gap-36 gap-12">
            {/* HUMAN */}
            <div className="text-center space-y-4 ">
              <h3 className="flex justify-start uppercase text-2xl  tracking-[0.5em]">HUMAN</h3>
              <Image
                src="/images/worksplaceholderII.jpg"
                alt="Human Gallery"
                width={430}
                height={350}
                className="object-cover rounded-sm"
              />
              <Link
                href="/gallery/human"
                className="text-hot-pink hover:underline underline-offset-4 flex justify-end"
              >
                view gallery →
              </Link>
            </div>
            {/* NON-HUMAN */}
            <div className="text-center space-y-4 md:translate-y-50">
              <h3 className="flex justify-start uppercase text-2xl  tracking-[0.5em]">NON HUMAN</h3>
              <Image
                src="/images/worksplaceholderI.jpg"
                alt="Non-Human Gallery"
                width={300}
                height={500}
                className="object-cover rounded-sm"
              />
              <Link
                href="/gallery/non-human"
                className="text-hot-pink hover:underline underline-offset-4 flex justify-end"
              >
                view gallery →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
