import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 })
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/streetview?size=640x400&location=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}&return_error_code=true`

    const response = await fetch(url)
    const contentType = response.headers.get('Content-Type') || ''

    if (!contentType.startsWith('image/')) {
      return NextResponse.json({ error: 'Street view unavailable' }, { status: 404 })
    }

    const imageBuffer = await response.arrayBuffer()

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      },
    })
  } catch (error) {
    console.error('Street view API error:', error)
    return NextResponse.json({ error: 'Failed to fetch street view' }, { status: 500 })
  }
}
