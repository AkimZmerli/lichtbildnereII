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
      <body>
        <RecaptchaProvider>
          <ScrollHandlerWrapper />
          <main>{children}</main>
        </RecaptchaProvider>
      </body>
    </html>
  )
}
