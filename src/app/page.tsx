import { fetchProducts } from '@/lib/db'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Storefront } from '@/components/Storefront'
import { CartToast } from '@/components/CartToast'

export default async function HomePage() {
  const products = await fetchProducts()

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Storefront initialProducts={products} />
      <Footer />
      <CartToast />
    </div>
  )
}
