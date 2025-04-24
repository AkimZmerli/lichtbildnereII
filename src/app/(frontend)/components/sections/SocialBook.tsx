import Image from 'next/image'
import Link from 'next/link'

export default function SocialBook() {
  {
    /* SOCIAL BOOK */
  }
  return (
    <section>
      <div className="text-center bg-white-rose text-hot-rose px-4 py-20 md: py-60">
        <h2 className="uppercase mb-15 text-base text-hot-pink text-[2rem] flex flex-col items-center">
          <span className="tracking-[0.5em]">THE SOCIAL</span>
          <span className="tracking-[0.5em] mt-2">BOOK</span>
        </h2>
        <div className="flex justify-center">
          <Image
            src="/images/placeholderSocial.png"
            alt="T Social Book"
            width={500}
            height={300}
            className="object-contain"
          />
        </div>
        <Link
          href="/book"
          className="mt-6 inline-block text-sm text-hot-pink underline underline-offset-4"
        >
          take a look in the book →
        </Link>
      </div>
    </section>
  )
}
