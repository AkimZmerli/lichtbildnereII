import React from 'react'
import ScrollHandlerWrapper from '@/features/shared/utils/ScrollHandlerWrapper'
import './styles.css'

export const metadata = {
  description: 'Valentin Mici - Portfolio',
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
