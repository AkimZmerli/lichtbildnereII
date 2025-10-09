import type { CollectionConfig } from 'payload'

export const GalleryItem: CollectionConfig = {
  slug: 'gallery-items',
  fields: [
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
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'physicalWidth',
      type: 'number',
      label: 'Physical Width',
      admin: {
        description: 'Width of the physical print',
      },
    },
    {
      name: 'physicalHeight',
      type: 'number',
      label: 'Physical Height',
      admin: {
        description: 'Height of the physical print',
      },
    },
    {
      name: 'unit',
      type: 'select',
      options: ['cm', 'inch'],
      defaultValue: 'cm',
      label: 'Measurement Unit',
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
