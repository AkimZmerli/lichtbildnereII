import React from 'react'
import ScrollHandlerWrapper from '@/features/shared/utils/ScrollHandlerWrapper'
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
        <ScrollHandlerWrapper />
        <main>{children}</main>
      </body>
    </html>
  )
}
