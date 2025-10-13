import React from 'react'
import ScrollHandlerWrapper from '@/features/shared/utils/ScrollHandlerWrapper'
import './styles.css'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
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
