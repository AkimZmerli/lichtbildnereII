// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
// import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
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
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false,
      } : false,
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // Storage adapter disabled for now - uncomment when you have valid Vercel Blob token
    // ...(process.env.NODE_ENV === 'production' && 
    //     process.env.BLOB_READ_WRITE_TOKEN && 
    //     process.env.BLOB_READ_WRITE_TOKEN.startsWith('vercel_blob_rw_') ? [
    //   vercelBlobStorage({
    //     collections: {
    //       media: {
    //         prefix: 'media', // Keep prefix to match existing schema
    //       },
    //     },
    //     token: process.env.BLOB_READ_WRITE_TOKEN,
    //   }),
    // ] : []),
  ],
})
