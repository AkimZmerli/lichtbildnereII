import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

export async function GET() {
  try {
    const payload = await getPayload()
    
    // Use PayloadCMS built-in migration system
    console.log('Running PayloadCMS migrations...')
    
    // This will create all tables based on the collections defined in payload.config.ts
    await payload.migrator.up()
    
    console.log('Migrations completed successfully')
    
    return NextResponse.json({ 
      message: 'Database migrations completed successfully',
      note: 'All tables have been created based on Payload collections'
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