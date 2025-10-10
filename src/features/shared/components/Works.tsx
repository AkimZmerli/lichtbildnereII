'use client'
import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getWorksPreviewData } from '../services/works/getWorksPreviewData'

interface WorksPreviewImage {
  url: string
  alt: string
  width: number
  height: number
}

interface WorksPreviewData {
  human: WorksPreviewImage
  nonHuman: WorksPreviewImage
}

export default function Works() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 })
  const [previewData, setPreviewData] = useState<WorksPreviewData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWorksPreviewData()
      setPreviewData(data)
    }
    fetchData()
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 1.2, // Added 2 more seconds (was 0.2, now 2.2)
      },
    },
  }

  const mobileItemVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  const desktopLeftVariants = {
    hidden: {
      opacity: 0,
      x: -100,
      y: 30,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 1.0,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 1.0, // Added 2 more seconds delay for desktop left
      },
    },
  }

  const desktopRightVariants = {
    hidden: {
      opacity: 0,
      x: 100,
      y: -30,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 1.0,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: 1.2, // Added 2 more seconds (was 0.2, now 2.2)
      },
    },
  }

  const headerVariants = {
    hidden: {
      opacity: 0,
      y: -20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <section
      ref={sectionRef}
      id="works"
      className="bg-grainy text-white-rose py-16 md:py-24 space-y-24 h-full md:pb-96"
    >
      {/* WORKS */}
      <div className="text-center">
        <motion.div
          className="flex items-center justify-center gap-4 mb-20"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div
            className="h-[1px] bg-white-rose flex-1"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <h2 className="tracking-widest text-2xl text-white-rose">W O R K S</h2>
          <motion.div
            className="h-[1px] bg-white-rose flex-1"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        <div className="px-6">
          {/* Mobile layout (visible only on small screens) */}
          <motion.div
            className="md:hidden"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <div className="flex flex-col gap-12">
              {/* HUMAN - Mobile */}
              <motion.div className="w-full max-w-[430px] mx-auto" variants={mobileItemVariants}>
                <div>
                  <div className="flex justify-center">
                    <Image
                      src={previewData?.human.url || "/images/worksplaceholderII.jpg"}
                      alt={previewData?.human.alt || "Human Gallery"}
                      width={300}
                      height={420}
                      className="object-cover rounded-sm"
                    />
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <h3 className="uppercase text-2xl tracking-[0.3em]">HUMAN</h3>
                    <Link
                      href="/gallery/human"
                      className="text-hot-pink hover:underline underline-offset-4 transition-all duration-200 hover:translate-y-[-2px]"
                    >
                      view gallery →
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* NON-HUMAN - Mobile */}
              <motion.div className="w-full max-w-[430px] mx-auto" variants={mobileItemVariants}>
                <div>
                  <div className="flex justify-center">
                    <Image
                      src={previewData?.nonHuman.url || "/images/Hanoi.jpg"}
                      alt={previewData?.nonHuman.alt || "Non-Human Gallery"}
                      width={280}
                      height={440}
                      className="object-cover rounded-sm"
                    />
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <h3 className="uppercase text-2xl tracking-[0.3em] whitespace-nowrap">
                      NON HUMAN
                    </h3>
                    <Link
                      href="/gallery/non-human"
                      className="text-hot-pink hover:underline underline-offset-4 transition-all duration-200 hover:translate-y-[-2px]"
                    >
                      view gallery →
                    </Link>
                  </div>
                </div>
              </motion.div>

            </div>
          </motion.div>

          {/* Desktop layout (hidden on small screens) */}
          <div className="hidden md:flex md:flex-row justify-center items-center md:gap-48">
            {/* HUMAN - Desktop */}
            <motion.div
              className="text-center space-y-4"
              variants={desktopLeftVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <h3 className="flex justify-start uppercase text-2xl tracking-[0.5em]">HUMAN</h3>
              <Image
                src={previewData?.human.url || "/images/worksplaceholderII.jpg"}
                alt={previewData?.human.alt || "Human Gallery"}
                width={300}
                height={420}
                className="object-cover rounded-sm"
              />
              <Link
                href="/gallery/human"
                className="text-hot-pink hover:underline underline-offset-4 flex justify-end"
              >
                view gallery →
              </Link>
            </motion.div>

            {/* NON-HUMAN - Desktop */}
            <motion.div
              className="text-center space-y-4 md:translate-y-50"
              variants={desktopRightVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <h3 className="flex justify-start uppercase text-2xl tracking-[0.5em]">NON HUMAN</h3>
              <Image
                src={previewData?.nonHuman.url || "/images/Hanoi.jpg"}
                alt={previewData?.nonHuman.alt || "Non-Human Gallery"}
                width={280}
                height={440}
                className="object-cover rounded-sm"
              />
              <Link
                href="/gallery/non-human"
                className="text-hot-pink hover:underline underline-offset-4 flex justify-end"
              >
                view gallery →
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
