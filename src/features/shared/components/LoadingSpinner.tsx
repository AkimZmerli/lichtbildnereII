'use client'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  showText = true,
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className={`${sizeClasses[size]} border-2 border-hot-pink/30 border-t-hot-pink rounded-full animate-spin motion-reduce:animate-none`} />
      {showText && (
        <div className="text-white-rose/60 text-sm tracking-wider">Loading...</div>
      )}
    </div>
  )
}