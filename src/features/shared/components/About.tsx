import Image from 'next/image'

export default function About() {
  return (
    <section id="about" className="bg-grainy text-white-rose min-h-screen">
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-12 md:py-24">
        {/* ABOUT HEADING */}
        <h2 className="uppercase tracking-widest mb-6 text-2xl text-center">A B O U T</h2>

        {/* PROFILE VIDEO - autoplay loop like a GIF */}
        <div className="mb-8 md:mb-12">
          <video autoPlay loop muted playsInline className="w-full h-auto object-cover">
            <source src="/images/animation.mp4" type="video/mp4" />
            <source src="/images/animation.webm" type="video/webm" />
            {/* Fallback to GIF if video not supported */}
            <Image
              src="/images/gif.gif"
              alt="Profile"
              width={2000}
              height={1127}
              className="w-full object-cover"
              unoptimized
            />
          </video>
        </div>

        {/* TEXT BLOCKS - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 ">
          {/* Column 1 */}
          <div className="p-6 rounded-sm">
            <p className="text-base md:text-lg text-white-rose leading-relaxed">
              My name is Valentin Mici. Born in Romania, raised in Gelenau, and since 2014 living in
              Chemnitz. For the past five years, I have been deeply dedicated to black-and-white
              photography and the development process in the photo lab. I consciously chose against
              commissioned photography because I prefer to shape my work freely and independently—in
              every sense. Discovering photography as a means of expression fills me with
              enthusiasm, as it gives me the opportunity to influence my work.
            </p>
          </div>

          {/* Column 2 */}
          <div className="p-6 rounded-sm">
            <p className="text-base md:text-lg text-white-rose leading-relaxed">
              Not only at the moment I press the shutter button but also in the photo lab, where I
              have the freedom to further refine my ideas until the result matches my vision. My
              works show that I am in a constant tension between the lively, organic moments of
              people and the graphic elements like structure and contrast. These two worlds – the
              human and the graphic – come together in my work, creating a unique dynamic that
              reflects both naturalness and clear structure.{' '}
            </p>{' '}
            <p className="mt-4"> Some of my works are for sale.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
