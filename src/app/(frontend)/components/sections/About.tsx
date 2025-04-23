import Image from 'next/image'
import Link from 'next/link'

export default function About() {
  return (
    <section id="about" className="bg-grainy text-white-rose min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* ABOUT HEADING */}
        <h2 className="uppercase tracking-widest mb-12 text-lg text-center">About</h2>

        {/* PROFILE IMAGE */}
        <div className="mb-12">
          <Image
            src="/profile.jpg" // Make sure to add the correct image path
            alt="Profile"
            width={800}
            height={400}
            className="w-full object-cover"
          />
        </div>

        {/* BIO TEXT */}
        <div className="space-y-6 text-sm leading-relaxed">
          <p>
            My name is Valentin Mici. Born in Romania, raised in Gelenau, and since 2014, I have
            been living in Chemnitz, which has now become my home.
          </p>

          <p>
            For the past five years, I have been deeply dedicated to black-and-white photography and
            the development process in the photo lab.
          </p>

          <p>
            I consciously chose against commissioned photography because I prefer to shape my work
            freely and independently—in every sense.
          </p>

          <p>
            Discovering photography as a means of expression fills me with enthusiasm, as it gives
            me the opportunity to influence my work in two different ways.
          </p>

          <p>
            Not only at the moment I press the shutter button but also in the photo lab, where I
            have the freedom to further refine and realize my ideas until the result matches my
            vision.
          </p>

          <p>
            I am open towards cooperation
            <br />
            Some of my photos are for sale.
          </p>

          <Link
            href="/contact"
            className="inline-block text-hot-pink hover:text-white transition-colors mt-4"
          >
            contact me →
          </Link>
        </div>
      </div>
    </section>
  )
}
