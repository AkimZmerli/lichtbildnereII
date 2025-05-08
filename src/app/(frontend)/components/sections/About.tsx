import Image from 'next/image'
import Link from 'next/link'

export default function About() {
  return (
    <section id="about" className="bg-grainy text-white-rose min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-5 md:py-24">
        {/* ABOUT HEADING */}
        <h2 className="uppercase tracking-widest mb-12 text-2xl text-center">A B O U T</h2>

        {/* PROFILE IMAGE */}
        <div className="mb-12">
          <Image
            src="/images/gif.gif" // Make sure to add the correct image path
            alt="Profile"
            width={800}
            height={400}
            className="w-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Column 1 */}
          <div className="space-y-8">
            <div className="text-lg text-white-rose leading-relaxed h-[200px] flex items-center p-4">
              My name is Valentin Mici. Born in Romania, raised in Gelenau, and since 2014, I have
              been living in Chemnitz, which has now become my home. For the past five years, I have
              been deeply dedicated to black-and-white photography and the development process in
              the photo lab.
            </div>

            <div className="text-lg text-white-rose leading-relaxed h-[200px] flex items-center p-4">
              I consciously chose against commissioned photography because I prefer to shape my work
              freely and independently—in every sense.
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-8">
            <div className="text-lg text-white-rose leading-relaxed h-[200px] flex items-center p-4">
              Discovering photography as a means of expression fills me with enthusiasm, as it gives
              me the opportunity to influence my work. Not only at the moment I press the shutter
              button but also in the photo lab, where I have the freedom to further refine my ideas
              until the result matches my vision.
            </div>

            <div className="text-lg text-white-rose leading-relaxed h-[200px] flex items-center p-4">
              Lorem iPsum dolor hjhafsdkjfh ksjdhf I am open towards cooperation. Some of my photos
              are for sale.
            </div>
          </div>
        </div>
        <a
          href="mailto:mail@valentinmici.com"
          className="inline-block text-hot-pink hover:text-white transition-colors mt-4"
        >
          contact me →
        </a>
      </div>
    </section>
  )
}
