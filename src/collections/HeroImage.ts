import type { CollectionConfig } from 'payload'

export const HeroImage: CollectionConfig = {
  slug: 'hero-image',
  labels: {
    singular: 'Hero Images',
    plural: 'Hero Images',
  },
  access: { read: () => true },
  admin: {},
  fields: [
    {
      name: 'desktopImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero Desktop Image',
      admin: {
        description: 'Main homepage hero image for desktop users',
      },
    },
    {
      name: 'mobileImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Hero Mobile Image',
      admin: {
        description: 'Main homepage hero image for mobile users',
      },
    },
    {
      name: 'altText',
      type: 'text',
      label: 'Alt Text',
      admin: {
        description: 'Alternative text for accessibility',
      },
    },
  ],
}