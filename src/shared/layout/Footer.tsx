'use client'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { useCallback } from 'react'

export default function Footer() {
  const { executeRecaptcha } = useGoogleReCaptcha()

  const handleMailtoClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (!executeRecaptcha) {
      console.log('reCAPTCHA not yet available, opening mailto anyway')
      window.location.href = 'mailto:mail@valentinmici.com'
      return
    }

    try {
      await executeRecaptcha('mailto')
      console.log('reCAPTCHA passed, opening mailto')
      
      // If reCAPTCHA passes, open mailto
      window.location.href = 'mailto:mail@valentinmici.com'
    } catch (error) {
      console.error('reCAPTCHA failed, opening mailto anyway:', error)
      // Still open mailto even if reCAPTCHA fails
      window.location.href = 'mailto:mail@valentinmici.com'
    }
  }, [executeRecaptcha])
  return (
    <footer className="bg-grainy text-white-rose/60 py-8 text-center flex flex-col gap-2 items-center text-sm">
      <div className="w-full mb-8">
        <div className="flex items-center justify-center gap-4 w-full">
          <div className="h-[1px] bg-white-rose/60 flex-1" />
          <h2 className="tracking-widest text-xl text-white-rose/60">MAIL@VALENTINMICI.COM</h2>
          <div className="h-[1px] bg-white-rose/60 flex-1" />
        </div>
        <button onClick={handleMailtoClick} className="text-sm mt-1 hover:underline bg-transparent border-none cursor-pointer">
          <p>write me a love letter</p>
        </button>
      </div>

      <div className="flex gap-6 justify-center flex-wrap">
        <span>© {new Date().getFullYear()} Valentin Mici</span>
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
