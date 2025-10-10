import type { CollectionConfig } from 'payload'

export const WorksPreview: CollectionConfig = {
  slug: 'works-preview',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'galleryType',
      type: 'select',
      options: ['human', 'non-human'],
      required: true,
      label: 'Gallery Type',
      admin: {
        description: 'Which gallery this preview image represents',
      },
    },
    {
      name: 'previewImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Preview Image',
      admin: {
        description: 'The preview image shown in the Works section',
      },
    },
    {
      name: 'altText',
      type: 'text',
      label: 'Alt Text',
      admin: {
        description: 'Alternative text for the preview image',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Gallery Title',
      admin: {
        description: 'Optional: Override the default gallery title',
      },
    },
  ],
}