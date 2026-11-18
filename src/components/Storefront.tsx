'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowRight, CheckCircle2, ChevronRight, Lock } from 'lucide-react'
import { ProductItem } from '@/types'
import { useCart } from '@/context/CartContext'

interface StorefrontProps {
  initialProducts: ProductItem[]
}

export function Storefront({ initialProducts }: StorefrontProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'fermented' | 'botanical' | 'creamy'>('all')
  const { addItem } = useCart()

  const filteredProducts = initialProducts.filter((product) => {
    if (activeFilter === 'all') return true
    return product.category === activeFilter
  })

  // Find featured product for the Hero display
  const featuredProduct = initialProducts.find((p) => p.isFeatured) || initialProducts[0]

  return (
    <main className="w-full pt-5 bg-[#fcf9f0] min-h-screen">
      {/* Hero Section */}
      <section className="w-full px-5 md:px-12 pt-10 pb-16 bg-[#fcf9f0] border-b border-[#003422]/10">
        <div className="max-w-[1360px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Editorial Content (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col items-start pr-0 lg:pr-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-[1px] bg-[#7c5800]"></span>
              <span className="text-xs uppercase tracking-[0.2em] text-[#7c5800] font-semibold">
                BLESSED DRINKS
              </span>
            </div>

            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl text-[#003422] font-normal leading-tight tracking-tight mb-4">
              Your Favourite Local Drinks,{' '}
              <span className="italic font-normal">Delivered.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#404943] max-w-xl mb-8 leading-relaxed">
              Purely natural, freshly brewed heritage beverages prepared in small batches across Accra.
              Sourced from indigenous flora, bottled daily at dawn.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-8">
              <a
                href="#drinks-catalog"
                className="inline-flex items-center justify-center gap-2 bg-[#003422] text-[#fcf9f0] px-6 py-4 text-xs font-semibold uppercase tracking-widest hover:bg-[#174c36] transition-colors group shadow-sm"
              >
                <span>Explore Drinks</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <div className="flex items-center gap-2 px-4 py-3 bg-[#f1eee5] border border-[#003422]/10">
                <CheckCircle2 className="w-5 h-5 text-[#7c5800]" />
                <span className="text-[11px] uppercase tracking-wider text-[#1c1c17] font-medium">
                  100% Raw Ingredients • Chilled on Delivery
                </span>
              </div>
            </div>
          </div>

          {/* Split Feature Visual (5 Columns) */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="relative bg-[#f1eee5] p-4 border border-[#003422]/15 shadow-sm">
              <div className="relative overflow-hidden aspect-square bg-[#dddad1]">
                <img
                  src={featuredProduct.imageUrl}
                  alt={featuredProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#003422] text-[#fcf9f0] text-[10px] uppercase font-semibold px-3 py-1 tracking-wider">
                  {featuredProduct.batchNumber || 'Fresh Batch'}
                </div>
                <div className="absolute bottom-4 right-4 bg-[#fcf9f0]/95 px-3 py-1 border border-[#003422]/15">
                  <span className="text-[10px] text-[#7c5800] uppercase font-bold tracking-wider">
                    Featured Extraction
                  </span>
                </div>
              </div>

              <div className="pt-4 pb-1 flex items-center justify-between">
                <div>
                  <h2 className="font-headline text-xl text-[#003422] font-semibold">
                    {featuredProduct.name}
                  </h2>
                  <p className="text-xs text-[#404943]">{featuredProduct.subtitle}</p>
                </div>
                <span className="text-lg font-bold text-[#003422]">
                  GH₵ {featuredProduct.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Architectural accent */}
            <div className="absolute -bottom-4 -right-4 w-20 h-20 border-r-2 border-b-2 border-[#7c5800] pointer-events-none hidden sm:block"></div>
          </div>
        </div>
      </section>

      {/* Main Drinks Catalog */}
      <section className="w-full px-5 md:px-12 py-16 bg-[#fcf9f0]" id="drinks-catalog">
        <div className="max-w-[1360px] mx-auto">
          {/* Catalog Header & Filter Control */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-[#003422]/10">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-[#7c5800] font-semibold block mb-1">
                Botanical Formulary
              </span>
              <h2 className="font-headline text-3xl sm:text-4xl text-[#003422] font-normal">
                The Heritage Collection
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all border ${
                  activeFilter === 'all'
                    ? 'bg-[#003422] text-[#fcf9f0] border-[#003422]'
                    : 'bg-[#fcf9f0] text-[#2d2d2d] border-[#2d2d2d]/20 hover:border-[#003422]'
                }`}
              >
                All Drinks
              </button>
              <button
                onClick={() => setActiveFilter('fermented')}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all border ${
                  activeFilter === 'fermented'
                    ? 'bg-[#003422] text-[#fcf9f0] border-[#003422]'
                    : 'bg-[#fcf9f0] text-[#2d2d2d] border-[#2d2d2d]/20 hover:border-[#003422]'
                }`}
              >
                Fermented & Brewed
              </button>
              <button
                onClick={() => setActiveFilter('botanical')}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all border ${
                  activeFilter === 'botanical'
                    ? 'bg-[#003422] text-[#fcf9f0] border-[#003422]'
                    : 'bg-[#fcf9f0] text-[#2d2d2d] border-[#2d2d2d]/20 hover:border-[#003422]'
                }`}
              >
                Botanical & Spiced
              </button>
              <button
                onClick={() => setActiveFilter('creamy')}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all border ${
                  activeFilter === 'creamy'
                    ? 'bg-[#003422] text-[#fcf9f0] border-[#003422]'
                    : 'bg-[#fcf9f0] text-[#2d2d2d] border-[#2d2d2d]/20 hover:border-[#003422]'
                }`}
              >
                Sweet & Creamy
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const isAvailable = product.availability === 'available' && product.stockQuantity > 0

              return (
                <div
                  key={product.id}
                  className="group flex flex-col bg-[#f6f3ea] border border-[#003422]/15 shadow-sm transition-all duration-200"
                >
                  {/* Image Viewport */}
                  <div className="relative aspect-square overflow-hidden bg-[#dddad1] border-b border-[#003422]/10">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
                        isAvailable
                          ? 'group-hover:scale-105'
                          : 'filter grayscale-[40%] cursor-not-allowed'
                      }`}
                    />

                    {/* Status Badge */}
                    <div
                      className={`absolute top-3 left-3 text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 ${
                        isAvailable
                          ? 'bg-[#003422] text-[#fcf9f0]'
                          : 'bg-[#2d2d2d]/80 text-[#fcf9f0]'
                      }`}
                    >
                      {isAvailable ? 'Available' : 'Out of Stock'}
                    </div>

                    {/* Volume Badge */}
                    <div className="absolute top-3 right-3 bg-[#fcf9f0]/90 text-[#1c1c17] px-2 py-0.5 text-[10px] tracking-wider uppercase border border-[#003422]/10 font-medium">
                      {product.volume}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex items-baseline justify-between mb-1">
                        <h3 className="font-headline text-xl text-[#003422] font-semibold">
                          {product.name}
                        </h3>
                        <span
                          className={`text-base font-bold ${
                            isAvailable ? 'text-[#003422]' : 'text-[#404943]'
                          }`}
                        >
                          GH₵ {product.price.toFixed(2)}
                        </span>
                      </div>

                      <span className="text-[11px] uppercase tracking-wider text-[#7c5800] block mb-3 font-semibold">
                        {product.subtitle}
                      </span>

                      <p className="text-xs text-[#404943] leading-relaxed mb-4">
                        {product.shortDescription}
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-[#003422]/10 flex items-center justify-between gap-3">
                      <span className="text-[10px] uppercase text-[#404943] tracking-wider">
                        {product.badgeText || 'Chilled Harvest'}
                      </span>

                      {isAvailable ? (
                        <button
                          onClick={() => addItem(product)}
                          className="bg-[#003422] text-[#fcf9f0] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-[#174c36] transition-colors flex items-center gap-1.5 active:translate-y-0.5"
                        >
                          <ChevronRight className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-[#e5e2da] text-[#404943] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider cursor-not-allowed border border-[#003422]/15 flex items-center gap-1.5 opacity-80"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Sold Out</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
