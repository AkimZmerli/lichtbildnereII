export const navigateToSocialBook = () => {
  // If we're already on the home page, just scroll
  if (window.location.pathname === '/') {
    const element = document.getElementById('social-book')
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }
  } else {
    // Navigate to home page with hash
    window.location.href = '/#social-book'
  }
}

export const createSmoothLink = (href: string) => {
  return (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (href.includes('#social-book')) {
      navigateToSocialBook()
    } else {
      // Regular navigation
      window.location.href = href
    }
  }
}