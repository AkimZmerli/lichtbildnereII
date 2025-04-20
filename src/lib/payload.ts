import payloadConfig from '../payload.config'
import payload, { InitOptions } from 'payload'

// This utility helps initialize Payload CMS client
let cached = (global as any).payload

if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  }
}

interface Args {
  initOptions?: InitOptions & {
    local?: boolean
    secret?: string
    config?: any
  }
}

export const getPayload = async ({ initOptions }: Args = {}) => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET environment variable is required')
  }

  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = payload.init({
      config: payloadConfig,
      secret: process.env.PAYLOAD_SECRET,
      local: initOptions?.local || false,
    })
  }

  try {
    cached.client = await cached.promise
  } catch (e: unknown) {
    cached.promise = null
    throw e
  }

  return cached.client
}
