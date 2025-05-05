import Image from 'next/image'
import Link from 'next/link'

export default function SocialBook() {
  {
    /* SOCIAL BOOK */
  }
  return (
    <section>
      <div className="text-center bg-white-rose text-hot-rose px-4 py-40">
        <h2 className="uppercase mb-15 text-base text-hot-pink text-[2rem] flex flex-col items-center">
          <span className="tracking-[0.5em]">THE SOCIAL</span>
          <span className="tracking-[0.5em] mt-2">BOOK</span>
        </h2>
        <div className="flex justify-center">
          <Image
            src="/images/placeholderSocial.png"
            alt="T Social Book"
            width={780}
            height={405}
            className="object-contain w-[230] h-[169]"
          />
        </div>
        <Link
          href="/book"
          className="mt-10 inline-block text-hot-pink hover:underline underline-offset-4"
        >
          take a look in the book ↗
        </Link>
      </div>
    </section>
  )
}
