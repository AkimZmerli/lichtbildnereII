'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-grainy text-white-rose/60 py-7 text-center flex flex-col gap-2 items-center text-sm">
      <div className="w-full mb-4">
        <div className="flex items-center justify-center gap-4 w-full">
          <div className="h-[1px] bg-white-rose/60 flex-1" />
          <h2 className="tracking-widest text-xl text-white-rose/60">MAIL@VALENTINMICI.COM</h2>
          <div className="h-[1px] bg-white-rose/60 flex-1" />
        </div>
        <a href="mailto:mail@valentinmici.com" className="text-sm mt-1 hover:underline">
          <p>
            write me a <span className="text-hot-pink">love</span>letter
          </p>
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

      <div className="flex gap-2 justify-center items-center flex-wrap text-sm">
        <span>Made with</span>
        <Heart className="w-4 h-4 text-hot-pink" />
        <span>by</span>
        <a
          href="https://webdev4life.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-80"
        >
          WebDev4life
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
