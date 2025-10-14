import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
  },
  output: 'standalone',
  trailingSlash: false,
  // Force dynamic rendering for all pages during build
  experimental: {
    forceDynamic: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'valli-portfolio-cms.onrender.com',
        pathname: '/api/media/**',
      },
    ],
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
