import { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'businessName',
      type: 'text',
      required: true,
      defaultValue: 'Blessed Drinks',
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Artisanal Ghanaian Drinks',
    },
    {
      name: 'whatsappNumber',
      type: 'text',
      required: true,
      defaultValue: '233240001234',
      admin: {
        description: 'WhatsApp number in international format without + (e.g. 233240001234)',
      },
    },
    {
      name: 'businessPhone',
      type: 'text',
      defaultValue: '+233 24 000 1234',
    },
    {
      name: 'businessEmail',
      type: 'text',
      defaultValue: 'contact@blesseddrinks.com',
    },
    {
      name: 'deliveryFee',
      type: 'number',
      required: true,
      defaultValue: 20.0,
      admin: {
        description: 'Standard delivery fee in GH₵',
      },
    },
    {
      name: 'operatingHours',
      type: 'text',
      defaultValue: 'Mon - Sat: 8:00 AM - 6:00 PM GMT',
    },
    {
      name: 'deliveryCoverage',
      type: 'text',
      defaultValue: 'Accra Metro & Tema Region',
    },
    {
      name: 'storeStatus',
      type: 'select',
      defaultValue: 'open',
      options: [
        { label: 'Store Open for Orders', value: 'open' },
        { label: 'Temporarily Closed', value: 'closed' },
      ],
    },
  ],
}
