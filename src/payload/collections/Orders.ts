import { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderId',
    defaultColumns: ['orderId', 'customerName', 'totalAmount', 'status', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true, // Allow anonymous customer checkout submission
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'orderId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Formatted order reference (e.g. #BD-1042)',
      },
    },
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'phoneNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'deliveryLocation',
      type: 'text',
      required: true,
    },
    {
      name: 'deliveryAddress',
      type: 'textarea',
      required: true,
    },
    {
      name: 'additionalInstructions',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'productId',
          type: 'text',
          required: true,
        },
        {
          name: 'productName',
          type: 'text',
          required: true,
        },
        {
          name: 'volume',
          type: 'text',
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'subtotal',
          type: 'number',
          required: true,
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
    },
    {
      name: 'deliveryFee',
      type: 'number',
      required: true,
      defaultValue: 20.0,
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      required: true,
      index: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Processing', value: 'processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'whatsappUrl',
      type: 'text',
    },
  ],
}
