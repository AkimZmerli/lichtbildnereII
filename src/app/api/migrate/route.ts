import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

export async function GET() {
  try {
    const payload = await getPayload()
    
    // Run migrations using Payload's migration system
    console.log('Running database migrations...')
    
    if (payload.db.migrator) {
      const migrationResult = await payload.db.migrator.migrator.migrate()
      console.log('Migration result:', migrationResult)
    }
    
    return NextResponse.json({ 
      message: 'Migrations completed successfully',
      note: 'Database tables should now exist'
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