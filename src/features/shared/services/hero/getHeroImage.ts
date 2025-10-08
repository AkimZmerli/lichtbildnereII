export async function getHeroImage() {
  try {
    // Fetch all hero images sorted by creation date (latest first)
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/hero-image?depth=1&draft=false&sort=-createdAt&limit=1`,
      {
        next: { revalidate: 10 },
        cache: 'no-store',
      },
    )

    // console.log('API Response status:', res.status)

    if (!res.ok) {
      // console.log('API Error:', await res.text())
      return null
    }

    const response = await res.json()
    // console.log('API Response data:', JSON.stringify(response, null, 2))
    
    // Extract the first (latest) hero image from the docs array
    const data = response?.docs?.[0] || null

    // Log the specific image URLs we're trying to use (disabled)
    // if (data) {
    //   console.log('Mobile Image URL:', data.mobileImage?.url)
    //   console.log('Desktop Image URL:', data.desktopImage?.url)
    // }

    return data || null
  } catch (error) {
    console.error('Error fetching hero image:', error)
    return null
  }
}
