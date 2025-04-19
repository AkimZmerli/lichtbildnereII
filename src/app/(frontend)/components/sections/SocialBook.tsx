import Image from 'next/image'
import Link from 'next/link'

export default function SocialBook() {
  {
    /* SOCIAL BOOK */
  }
  return (
    <section>
      <div className="text-center bg-white-rose text-hot-red px-4 py-20">
        <h2 className="uppercase tracking-widest mb-12 text-base">The Social Book</h2>
        <div className="flex justify-center">
          <Image
            src="/placeholderSocial.png"
            alt="The Social Book"
            width={500}
            height={300}
            className="object-contain"
          />
        </div>
        <Link href="/book" className="mt-6 inline-block text-sm underline underline-offset-4">
          take a look in the book →
        </Link>
      </div>
    </section>
  )
}
