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
import { WorksPreview } from './collections/WorksPreview'
// import { SocialBook } from './collections/SocialBook'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  upload: {
    useTempFiles: true,
  },
  collections: [
    Users,
    Media,
    HeroImage,
    GalleryItem,
    Slides,
    WorksPreview,
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
    // Storage adapter - only enable in production when configured
    ...(process.env.NODE_ENV === 'production' && process.env.BLOB_READ_WRITE_TOKEN ? [
      vercelBlobStorage({
        collections: {
          media: {
            prefix: 'media', // Keep prefix to match existing schema
          },
        },
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }),
    ] : []),
  ],
})
