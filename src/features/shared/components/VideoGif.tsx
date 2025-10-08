// Example component showing video as GIF replacement
export const VideoGif = () => {
  return (
    <video
      autoPlay
      loop
      muted // Required for autoplay to work
      playsInline // Important for mobile
      className="w-full h-auto"
    >
      <source src="/images/animation.mp4" type="video/mp4" />
      <source src="/images/animation.webm" type="video/webm" />
      {/* Fallback to GIF if video not supported */}
      Your browser does not support video.
    </video>
  )
}