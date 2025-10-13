import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

export async function GET() {
  try {
    const payload = await getPayload()
    
    // This will automatically run any pending migrations
    console.log('Running database migrations...')
    
    return NextResponse.json({ 
      message: 'Migrations completed successfully',
      note: 'Database tables should now be available'
    })
  } catch (error) {
    console.error('Failed to run migrations:', error)
    return NextResponse.json({ 
      error: 'Failed to run migrations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST() {
  return GET()
}