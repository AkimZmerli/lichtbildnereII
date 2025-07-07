import { Suspense } from 'react'
import ScrollHandler from './scrollHandler'

export default function ScrollHandlerWrapper() {
  return (
    <Suspense fallback={null}>
      <ScrollHandler />
    </Suspense>
  )
}