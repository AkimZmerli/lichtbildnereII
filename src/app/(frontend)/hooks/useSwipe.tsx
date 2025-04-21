import { useState } from 'react'

interface UseSwipeProps {
  onSwipeLeft: () => void
  onSwipeRight: () => void
  threshold?: number
}

const useSwipe = ({ onSwipeLeft, onSwipeRight, threshold = 50 }: UseSwipeProps) => {
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > threshold
    const isRightSwipe = distance < -threshold

    if (isLeftSwipe) {
      onSwipeLeft()
    }
    if (isRightSwipe) {
      onSwipeRight()
    }
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}

export default useSwipe
