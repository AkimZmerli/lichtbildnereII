'use client'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-hot-pink text-hot-red py-7 text-center flex flex-col gap-6 items-center text-sm">
      <div className="w-full mb-4">
        <div className="flex items-center justify-center gap-4 w-full">
          <div className="h-[1px] bg-hot-red flex-1" />
          <h2 className="tracking-widest text-xl text-hot-red">MAIL@VALENTINMICI.COM</h2>
          <div className="h-[1px] bg-hot-red flex-1" />
        </div>
        <a href="mailto:mail@valentinmici.com" className="text-sm mt-1">
          <p>write me a loveletter</p>
        </a>
      </div>

      <div className="flex gap-6 justify-center flex-wrap">
        <span>© 2025 Valentin Mici</span>
        <Link href="/impressum" className="hover:opacity-80">
          Impressum
        </Link>
        <Link href="/datenschutz" className="hover:opacity-80">
          Datenschutz
        </Link>
      </div>

      <div className="w-full h-px bg-[#FA265C]" />

      <div className="flex gap-2 justify-center items-center flex-wrap text-sm">
        <span>Made with</span>
        <Image src="/images/heart.png" alt="heart icon" width={17} height={17} />
        <span>by</span>
        <a
          href="https://webdev4live.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-80"
        >
          WebDev4live
        </a>
        <span>&</span>
        <a
          href="https://faency.studio"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-80"
        >
          faency.studio
        </a>
      </div>
    </footer>
  )
}
