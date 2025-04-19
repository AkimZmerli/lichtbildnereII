import type { CollectionConfig } from 'payload'

export const HeroImage: CollectionConfig = {
  slug: 'hero-image',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'mobileImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'desktopImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'altText',
      type: 'text',
    },
  ],
}
