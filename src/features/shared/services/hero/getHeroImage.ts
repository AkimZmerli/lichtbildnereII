export async function getHeroImage() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/hero-image/2?depth=1&draft=false`,
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

    const data = await res.json()
    // console.log('API Response data:', JSON.stringify(data, null, 2))

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
