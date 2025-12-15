import React from 'react'
import ScrollHandlerWrapper from '@/shared/utils/ScrollHandlerWrapper'
import RecaptchaProvider from '@/shared/providers/RecaptchaProvider'
import './styles.css'

export const metadata = {
  description: 'Analog photographer and visual artist Valentin Mici. Exploring human and non-human subjects through intimate portraits and conceptual photography.',
  title: 'Valentin Mici',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {/* Preconnect to Cloudinary for faster image loading */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body>
        <RecaptchaProvider>
          <ScrollHandlerWrapper />
          <main>{children}</main>
        </RecaptchaProvider>
      </body>
    </html>
  )
}
