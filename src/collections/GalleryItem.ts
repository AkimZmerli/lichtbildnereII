import type { CollectionConfig } from 'payload'

export const GalleryItem: CollectionConfig = {
  slug: 'gallery-items',
  labels: {
    singular: 'Gallery Photo',
    plural: 'Gallery Photos',
  },
  admin: {
    defaultSort: 'order',
    useAsTitle: 'name',
    description: 'Manage photos in Human, Non-Human, and Inverted galleries',
    listSearchableFields: ['name', 'type', 'material'],
    pagination: {
      defaultLimit: 50
    },
    defaultColumns: ['image', 'name', 'type', 'order', 'physicalWidth', 'physicalHeight', 'material']
  },
  fields: [
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      admin: {
        description: 'Order in which this image appears in the gallery (lower numbers appear first)',
      },
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
      label: 'Photo Name',
      admin: {
        description: 'The name/title of the photograph',
      },
    },
    {
      name: 'physicalWidth',
      type: 'number',
      label: 'Width (cm)',
      admin: {
        description: 'Width of the physical print in centimeters',
      },
    },
    {
      name: 'physicalHeight',
      type: 'number',
      label: 'Height (cm)',
      admin: {
        description: 'Height of the physical print in centimeters',
      },
    },
    {
      name: 'material',
      type: 'text',
      label: 'Material/Medium',
      admin: {
        description: 'e.g., "Silver Gelatin Print", "Digital C-Print", "Inverted Development"',
      },
    },
  ],
}
