import { ProductItem, BusinessSettings } from '@/types'

export const DEFAULT_SETTINGS: BusinessSettings = {
  businessName: 'Blessed Drinks',
  tagline: 'Artisanal Ghanaian Drinks',
  whatsappNumber: '233240001234',
  businessPhone: '+233 24 000 1234',
  businessEmail: 'contact@blesseddrinks.com',
  deliveryFee: 20.0,
  operatingHours: 'Mon - Sat: 8:00 AM - 6:00 PM GMT',
  deliveryCoverage: 'Accra Metro & Tema Region',
  storeStatus: 'open',
}

export const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-001',
    name: 'Sobolo',
    slug: 'sobolo',
    subtitle: 'Hibiscus Bissap',
    price: 25.0,
    volume: '330ml',
    category: 'botanical',
    shortDescription:
      'Sun-dried roselle hibiscus petals steeped with ginger, cloves, grains of selim and a touch of organic pineapple.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDW-1VnsYfPd1NUl7V3AMwjSuJs4nYFLY8l73d52EYl9RcWI6rDMSZSIAhLJ0G3kZXI9ho3fvdPwWfTPBYNaaqfVwKz5rizjzzXiSMjNufr7jfgWWEYorUNoJxBnujsR0MpzqpfluvGTSu5u56UvoZkUufRtQ_xPEhCNPGM0oA2Xa10y1sup-_R2TcHSK23eK4Lm34rkznONrtB9_8TvjevduEJlULkro_ZDt8rcuN2',
    badgeText: 'Cold Steeped • 18 hrs',
    availability: 'available',
    stockQuantity: 45,
    isFeatured: true,
    batchNumber: 'Batch № 48 Fresh',
  },
  {
    id: 'prod-002',
    name: 'Brukina',
    slug: 'brukina',
    subtitle: 'Millet & Dairy',
    price: 30.0,
    volume: '350ml',
    category: 'creamy',
    shortDescription:
      'Slow-cooked roasted pearl millet grains blended into creamy cultured whole milk. Wholesome and nourishing.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCzjH8Sm6JfCtmzHcAfIVUV5jeiq8n5sNfOKkrFkm3nUit30U738EEN1-xS_8NdlGCUOPpqQpybrSAQN7gpZ0OmWHNIJlIkyNsMT_Jvra1sCAyNTaH_3jz1yMSEJgy5snVAmYHlUr6UVumXOW0_zhnLlfmqAMkAV4SPFf2_1bSU9gmXOeRThKF5R0Yvj-xvW6DxeOlUoUG4iufMIyO4Nou_0DNcGgV23WW4PhbhzpW3',
    badgeText: 'Cultured Whole Milk',
    availability: 'available',
    stockQuantity: 30,
    isFeatured: false,
    batchNumber: 'Batch #NS-092',
  },
  {
    id: 'prod-003',
    name: 'Lamugin',
    slug: 'lamugin',
    subtitle: 'Spicy Ginger & Tamarind',
    price: 25.0,
    volume: '330ml',
    category: 'botanical',
    shortDescription:
      'Zesty ginger infusion with organic tamarind puree, cloves, and African black pepper for a sharp refreshment.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBS7oITZYH0ZAhNXSAbdMskY2oYWcer2DMhivBdoSonyCVOtrTlgjXyz461jcQqbGVzTyLJoUAE9NHdcrniObtXCldHJV5Pdv8gYILyBsA6VH4rL6OBl9VY-xtSkGwIBGfxvHNA03TcN7jOc4N6c_kpRTB01ZWG_UujPSEYk1sfRQl-LLqXsuDxXadSNrC4ed6BbGNMEI8QGDoMEETEBl1IlNwd5nXfe_Bogtt8x3Hp',
    badgeText: 'High Ginger Heat',
    availability: 'available',
    stockQuantity: 28,
    isFeatured: false,
    batchNumber: 'Batch #NS-095',
  },
  {
    id: 'prod-004',
    name: 'Asaana',
    slug: 'asaana',
    subtitle: 'Caramelized Corn Brew',
    price: 28.0,
    volume: '330ml',
    category: 'fermented',
    shortDescription:
      'Traditional fermented crushed corn nectar sweetened with roasted caramelized cane sugar. Rich, deep, and smoky.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBohn7nXUiNMi-17-Nu4sCONBZ4Cl3XHjDUViV70sGtBXVca3xYJ7yMnBhggbV2qaw6qIA1-EEC3W37mWjI9QhWRYPbfTpaQdpl9KeN-5W_Kfx672oZ0pmky_0--jX-EYyrANBkYtYLIrlcNjPct3dLBSyAz46uWB-vXVOUHmIVfxBsBMMIOqoHtgMOzjnhtvyFYVtAri9O9xgkruWE_R8nmFh-FkuPBS-J__BzjQyp',
    badgeText: 'Caramel Ferment',
    availability: 'available',
    stockQuantity: 20,
    isFeatured: false,
    batchNumber: 'Batch #NS-096',
  },
  {
    id: 'prod-005',
    name: 'Pito',
    slug: 'pito',
    subtitle: 'Fermented Sorghum',
    price: 35.0,
    volume: '750ml',
    category: 'fermented',
    shortDescription:
      'Northern Ghana artisanal brew from naturally malted sorghum grain with a gentle earthy tang. Next vat finishes Friday.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAqd6j1Mb8bf6mzZNRONsNDOdfeLI-BXRjO3SUNOfzuMtCF3D_HcZQf6EfJpDnV8vF8WmSE98eV3ZX-EgyjJ7MK30U2mtI9uZb8k15w4jCjcFF3b4qF0JcjoBB6Bvuq7i259GKPjf48HoRKwujt3LdMbDMQlwZ5Ia6xlIIum5josC4MKagl6QzlZrN146vcwN5yEjObJkpahgnQSUgasLxXigdC0K7UxZlh3BGUfz7m',
    badgeText: 'Northern Ferment',
    availability: 'out_of_stock',
    stockQuantity: 0,
    isFeatured: false,
    batchNumber: 'Batch #NS-088 [Cellar Depleted]',
  },
  {
    id: 'prod-006',
    name: 'Fresh Palm Wine',
    slug: 'palm-wine',
    subtitle: 'Nsafufuo Pure Sap',
    price: 40.0,
    volume: '500ml',
    category: 'fermented',
    shortDescription:
      'Pure oil palm sap harvested daily at dawn in the Eastern Region. Naturally effervescent, delicate, and unpasteurized.',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCf4ImjAuSPFf_KZVeq6jpVITdoyMURmKbELqZhG8fcJkvKwJuX5i1WJYYyfbZmWnRY1TxJWACclayi6bCrivanpl14VPm73W5Q0yDPr4ObRIomy1FfBqRbStUSKNf5scY7jVT05f2ZACsP1pS_dmXno1aBORoLyOcdRoOZCvbehYI1A4CG4JKaBvsGxH3hjjv2vdymxpNvMNDnNJQjS1u4efbHbHGkOVBgbByvAV1u',
    badgeText: 'Live Wild Yeast',
    availability: 'available',
    stockQuantity: 15,
    isFeatured: false,
    batchNumber: 'Batch #NS-098',
  },
]
