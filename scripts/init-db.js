#!/usr/bin/env node

import { getPayload } from 'payload'
import config from '../src/payload.config.js'

const initDatabase = async () => {
  console.log('Initializing database...')
  
  try {
    const payload = await getPayload({
      config,
      disableAdmin: true,
      disableAutoLogin: true,
    })

    console.log('Database initialized successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Failed to initialize database:', error)
    process.exit(1)
  }
}

initDatabase()