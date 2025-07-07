import React from 'react'
import ScrollHandlerWrapper from '@/features/shared/utils/ScrollHandlerWrapper'
import './styles.css'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <ScrollHandlerWrapper />
        <main className="pt-[70px]">{children}</main>
      </body>
    </html>
  )
}
