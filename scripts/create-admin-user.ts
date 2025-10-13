#!/usr/bin/env node

import { getPayload } from 'payload'
import config from '../src/payload.config.js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.production' })

const createAdminUser = async () => {
  console.log('Creating first admin user...')
  
  try {
    const payload = await getPayload({
      config,
    })

    // Check if any users exist
    const { totalDocs } = await payload.count({
      collection: 'users'
    })

    if (totalDocs > 0) {
      console.log('Admin user already exists. Exiting.')
      process.exit(0)
    }

    // Create the first admin user
    await payload.create({
      collection: 'users',
      data: {
        email: 'vmici@gmx.de',
        password: 'TempPassword123!', // Change this immediately after first login
      },
    })

    console.log('Admin user created successfully!')
    console.log('Email: vmici@gmx.de')
    console.log('Password: TempPassword123!')
    console.log('⚠️  IMPORTANT: Change the password after first login!')
    
    process.exit(0)
  } catch (error) {
    console.error('Failed to create admin user:', error)
    process.exit(1)
  }
}

createAdminUser()