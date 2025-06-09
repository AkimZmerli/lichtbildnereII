'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function SocialBook() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.8, // Changed back to 80% - more reliable
    threshold: 0.8, // Additional threshold for better triggering
  })

  // Debug: Let's see what's happening
  console.log('Section in view:', isInView)
  const linkVariants = {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

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

        {/* Debug: Show link without animation first */}
        <div className="mt-10">
          <Link
            href="/book"
            className="inline-block text-hot-pink hover:underline underline-offset-4 transition-all duration-200 hover:translate-y-[-2px]"
          >
            take a look in the book ↗
          </Link>
        </div>
      </div>
    </section>
  )
}
