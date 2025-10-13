import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

async function createAdminUser() {
  try {
    const payload = await getPayload()

    // Check if any users exist
    const { totalDocs } = await payload.count({
      collection: 'users'
    })

    if (totalDocs > 0) {
      return NextResponse.json({ 
        error: 'Admin user already exists' 
      }, { status: 400 })
    }

    // Create the first admin user
    await payload.create({
      collection: 'users',
      data: {
        email: 'vmici@gmx.de',
        password: 'TempPassword123!',
      },
    })

    return NextResponse.json({ 
      message: 'Admin user created successfully',
      email: 'vmici@gmx.de',
      note: 'Please change the password after first login'
    })
  } catch (error) {
    console.error('Failed to create admin user:', error)
    return NextResponse.json({ 
      error: 'Failed to create admin user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST() {
  return createAdminUser()
}

export async function GET() {
  return createAdminUser()
}