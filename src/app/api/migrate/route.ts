import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'
import { up } from '../../../migrations/20251013_184049_initial'

export async function GET() {
  try {
    const payload = await getPayload()
    
    // Run migrations directly by executing the up function
    console.log('Running database migrations directly...')
    
    await up({ 
      db: payload.db, 
      payload,
      req: {} as any
    })
    
    console.log('Migration SQL executed successfully')
    
    return NextResponse.json({ 
      message: 'Database migrations executed successfully',
      note: 'All tables have been created'
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