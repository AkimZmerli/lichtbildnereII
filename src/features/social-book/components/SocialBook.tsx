'use client'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FlipbookModal } from '../../3d-flipbook/components/FlipbookModal'

export default function SocialBook() {
  const sectionRef = useRef(null)
  const [showFlipbook, setShowFlipbook] = useState(false)
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.8, // Changed back to 80% - more reliable
  })

  // Debug: Let's see what's happening
  console.log('Section in view:', isInView)

  return (
    <section ref={sectionRef}>
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

        {/* Flipbook trigger button */}
        <div className="mt-10">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowFlipbook(true);
            }}
            className="inline-block text-hot-pink hover:underline underline-offset-4 transition-all duration-200 hover:translate-y-[-2px] cursor-pointer"
          >
            take a look in the book ↗
          </button>
        </div>
      </div>

      {/* Flipbook Modal */}
      <FlipbookModal
        isOpen={showFlipbook}
        onClose={() => setShowFlipbook(false)}
        title="Mici Lichtbildnerei Portfolio"
      />
    </section>
  )
}
