'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-hot-pink text-hot-red px-4 py-8 text-center flex flex-col gap-6 items-center text-sm">
      <div>
        <a
          href="mailto:VALENTINMICI@MAIL.DE"
          className="text-lg tracking-widest font-medium underline underline-offset-4 hover:opacity-80"
        >
          VALENTINMICI@MAIL.DE
        </a>
        <p className="text-sm mt-1">write me a loveletter</p>
      </div>

      <div className="flex gap-6 justify-center flex-wrap">
        <span>© 2025 Valentin Mici</span>
        <Link href="/impressum" className="underline underline-offset-2 hover:opacity-80">
          Impressum
        </Link>
        <Link href="/datenschutz" className="underline underline-offset-2 hover:opacity-80">
          Datenschutz
        </Link>
      </div>

      <div className="w-full h-px bg-[#FA265C]" />

      <div className="flex gap-2 justify-center items-center flex-wrap text-sm">
        <span>Made with</span>
        <span>❤️</span>
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
