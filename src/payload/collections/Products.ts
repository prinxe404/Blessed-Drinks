import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'category', 'volume', 'availability', 'isFeatured'],
  },
  access: {
    read: () => true, // Publicly readable for storefront
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly unique identifier (e.g. sobolo, brukina)',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'E.g. "Hibiscus Bissap", "Millet & Dairy", "Spicy Ginger & Tamarind"',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Price in Ghana Cedis (GH₵)',
      },
    },
    {
      name: 'volume',
      type: 'text',
      defaultValue: '330ml',
      admin: {
        description: 'E.g. 330ml, 500ml, 750ml',
      },
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'botanical',
      required: true,
      options: [
        { label: 'All Drinks', value: 'all' },
        { label: 'Fermented & Brewed', value: 'fermented' },
        { label: 'Botanical & Spiced', value: 'botanical' },
        { label: 'Sweet & Creamy', value: 'creamy' },
      ],
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'imageUrl',
      type: 'text',
      admin: {
        description: 'Alternative direct image URL (e.g. Cloudinary or CDN link)',
      },
    },
    {
      name: 'badgeText',
      type: 'text',
      admin: {
        description: 'E.g. "Cold Steeped • 18 hrs", "Live Wild Yeast", "Cultured Whole Milk"',
      },
    },
    {
      name: 'availability',
      type: 'select',
      defaultValue: 'available',
      required: true,
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Out of Stock', value: 'out_of_stock' },
        { label: 'Reserve Batch', value: 'reserve' },
      ],
    },
    {
      name: 'stockQuantity',
      type: 'number',
      defaultValue: 50,
      min: 0,
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'batchNumber',
      type: 'text',
      admin: {
        description: 'E.g. Batch #NS-091 or Batch № 48 Fresh',
      },
    },
  ],
}
