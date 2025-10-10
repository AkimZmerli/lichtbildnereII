import type { CollectionConfig } from 'payload'

export const GalleryItem: CollectionConfig = {
  slug: 'gallery-items',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: ['human', 'non-human', 'inverted'],
      required: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'physicalHeight',
      type: 'number',
    },
    {
      name: 'physicalWidth',
      type: 'number',
    },
    {
      name: 'material',
      type: 'text',
    },
  ],
}
