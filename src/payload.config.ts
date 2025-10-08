// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { HeroImage } from './collections/HeroImage'
import { GalleryItem } from './collections/GalleryItem'
import { Slides } from './collections/Slides'
import { SiteSettings } from './collections/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    HeroImage,
    GalleryItem,
    Slides,
    SiteSettings,

    {
      slug: 'Human',
      admin: {
        useAsTitle: 'title',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'featuredImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false,
      } : false,
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // Storage adapter - automatically switches between Vercel Blob and S3
    ...((() => {
      // Use S3 if configured (for when you exceed 1GB)
      if (process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID) {
        console.log('Using S3 storage')
        return [
          s3Storage({
            collections: {
              media: {
                prefix: 'media',
              },
            },
            bucket: process.env.S3_BUCKET,
            config: {
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
              },
              region: process.env.S3_REGION || 'auto',
              endpoint: process.env.S3_ENDPOINT,
            },
          }),
        ]
      }
      // Otherwise use Vercel Blob (default for now)
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        console.log('Using Vercel Blob storage')
        return [
          vercelBlobStorage({
            collections: {
              media: true,
            },
            token: process.env.BLOB_READ_WRITE_TOKEN,
          }),
        ]
      }
      // No storage configured (local development)
      console.log('No cloud storage configured - using local files')
      return []
    })()),
  ],
})
