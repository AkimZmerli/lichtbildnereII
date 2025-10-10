import type { CollectionConfig } from 'payload'

export const Slides: CollectionConfig = {
  slug: 'slides',
  labels: {
    singular: 'Exhibition Slide',
    plural: 'Exhibition Slides',
  },
  admin: {
    useAsTitle: 'label',
    description: 'Manage exhibition slides shown in the exhibitions section',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Exhibition Images',
      minRows: 0,
      maxRows: 3,
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt Text',
          required: true,
        },
      ],
    },
  ],
}
