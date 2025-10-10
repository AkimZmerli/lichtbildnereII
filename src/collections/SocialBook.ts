import type { CollectionConfig } from 'payload'

export const SocialBook: CollectionConfig = {
  slug: 'social-book',
  labels: {
    singular: 'Social Book',
    plural: 'Social Book',
  },
  access: {
    read: () => true,
  },
  admin: {
    description: 'Manage the Social Book cover image and text',
  },
  fields: [
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Social Book Cover Image',
      admin: {
        description: 'The cover image displayed in the Social Book section',
      },
    },
    {
      name: 'altText',
      type: 'text',
      label: 'Alt Text',
      admin: {
        description: 'Alternative text for the cover image',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Book Title',
      defaultValue: 'THE SOCIAL BOOK',
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Button Text',
      defaultValue: 'take a look in the book ↗',
    },
  ],
}