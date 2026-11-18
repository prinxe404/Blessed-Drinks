import { fetchProducts } from '@/lib/db'
import { DrinksManager } from '@/components/admin/DrinksManager'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDrinksPage() {
  const drinks = await fetchProducts()

  return <DrinksManager initialDrinks={drinks} />
}
