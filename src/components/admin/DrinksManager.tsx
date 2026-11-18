'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, X, Check, Upload, RefreshCw } from 'lucide-react'
import { ProductItem } from '@/types'

interface DrinksManagerProps {
  initialDrinks: ProductItem[]
}

export function DrinksManager({ initialDrinks }: DrinksManagerProps) {
  const [drinks, setDrinks] = useState<ProductItem[]>(initialDrinks)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [activeDrinkId, setActiveDrinkId] = useState<string | null>(null)

  // Form State
  const [name, setName] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [slug, setSlug] = useState('')
  const [price, setPrice] = useState('25.00')
  const [volume, setVolume] = useState('500ml')
  const [category, setCategory] = useState<'all' | 'fermented' | 'botanical' | 'creamy'>('botanical')
  const [availability, setAvailability] = useState<'available' | 'out_of_stock' | 'reserve'>('available')
  const [stockQuantity, setStockQuantity] = useState(50)
  const [shortDescription, setShortDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [badgeText, setBadgeText] = useState('')
  const [batchNumber, setBatchNumber] = useState('')

  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'depleted'>('all')

  const openDrawer = (drink?: ProductItem) => {
    if (drink) {
      setIsEditing(true)
      setActiveDrinkId(drink.id)
      setName(drink.name)
      setSubtitle(drink.subtitle || '')
      setSlug(drink.slug)
      setPrice(drink.price.toString())
      setVolume(drink.volume || '500ml')
      setCategory(drink.category)
      setAvailability(drink.availability)
      setStockQuantity(drink.stockQuantity)
      setShortDescription(drink.shortDescription)
      setImageUrl(drink.imageUrl)
      setBadgeText(drink.badgeText || '')
      setBatchNumber(drink.batchNumber || '')
    } else {
      setIsEditing(false)
      setActiveDrinkId(null)
      setName('')
      setSubtitle('')
      setSlug('')
      setPrice('25.00')
      setVolume('330ml')
      setCategory('botanical')
      setAvailability('available')
      setStockQuantity(50)
      setShortDescription('')
      setImageUrl(drinks[0]?.imageUrl || '')
      setBadgeText('Fresh Daily Press')
      setBatchNumber(`Batch #BD-${Math.floor(Math.random() * 900 + 100)}`)
    }
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
  }

  // Handle Cloudinary Image Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (data.success && data.url) {
        setImageUrl(data.url)
      } else {
        alert(data.message || 'Image upload failed')
      }
    } catch (err) {
      alert('Network error during image upload')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    const drinkData = {
      id: activeDrinkId || undefined,
      name,
      subtitle,
      slug: generatedSlug,
      price: parseFloat(price) || 25.0,
      volume,
      category,
      availability,
      stockQuantity: Number(stockQuantity),
      shortDescription,
      imageUrl,
      badgeText,
      batchNumber,
      isFeatured: false,
    }

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_drink',
          drink: drinkData,
        }),
      })

      const result = await res.json()
      if (result.success && result.data) {
        if (isEditing) {
          setDrinks((prev) => prev.map((d) => (d.id === result.data.id ? result.data : d)))
        } else {
          setDrinks((prev) => [result.data, ...prev])
        }
        closeDrawer()
      } else {
        alert('Failed to save drink: ' + (result.message || 'Validation error'))
      }
    } catch (err) {
      alert('Network error while saving drink')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string, drinkName: string) => {
    if (!confirm(`Are you sure you want to remove "${drinkName}" from the catalog?`)) return

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_drink', id }),
      })

      const result = await res.json()
      if (result.success) {
        setDrinks((prev) => prev.filter((d) => d.id !== id))
      }
    } catch (err) {
      alert('Error deleting drink')
    }
  }

  const toggleAvailability = async (drink: ProductItem) => {
    const newStatus = drink.availability === 'available' ? 'out_of_stock' : 'available'
    const updated = { ...drink, availability: newStatus as any }

    setDrinks((prev) => prev.map((d) => (d.id === drink.id ? updated : d)))

    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_drink',
        drink: updated,
      }),
    })
  }

  // Filter Drinks
  const filteredDrinks = drinks.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (statusFilter === 'available') return d.availability === 'available'
    if (statusFilter === 'depleted') return d.availability === 'out_of_stock'
    return true
  })

  return (
    <div className="max-w-[1360px] mx-auto w-full space-y-8">
      {/* Top Banner Notice */}
      <div className="bg-[#ebe8df] px-6 py-3 flex items-center justify-between border border-[#003422]/10">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 text-[#003422]" />
          <span className="text-xs uppercase tracking-wider text-[#1c1c17] font-semibold">
            Changes automatically reflect in real time on the customer store.
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs uppercase text-[#404943]">
          <span>Catalog Node:</span>
          <span className="font-bold text-[#003422]">ACCRA-CENTRAL-01</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#404943] block">
            Inventory Register
          </span>
          <h1 className="font-headline text-3xl sm:text-4xl text-[#003422] font-semibold">
            Drinks Management
          </h1>
          <p className="text-sm text-[#404943]">
            Manage formulations, regional allocations, volume specifications, and instant cellar
            availability.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openDrawer()}
            className="bg-[#003422] text-white px-5 py-3 text-xs uppercase tracking-wider font-semibold hover:bg-[#174c36] transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Drink</span>
          </button>
        </div>
      </div>

      {/* Metrics Overviews */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 border border-[#003422]/10 space-y-1">
          <span className="text-xs uppercase text-[#404943] tracking-wider font-semibold">
            Total Formulations
          </span>
          <div className="font-headline text-3xl text-[#003422] font-bold">
            0{drinks.length}
          </div>
          <div className="text-xs text-[#404943]">Authentic West African botanical blends</div>
        </div>

        <div className="bg-white p-6 border border-[#003422]/10 space-y-1">
          <span className="text-xs uppercase text-[#404943] tracking-wider font-semibold">
            Active In Cellar
          </span>
          <div className="font-headline text-3xl text-[#003422] font-bold">
            0{drinks.filter((d) => d.availability === 'available').length}
          </div>
          <div className="text-xs text-[#174c36] font-medium">Ready for immediate fulfillment</div>
        </div>

        <div className="bg-white p-6 border border-[#003422]/10 space-y-1">
          <span className="text-xs uppercase text-[#404943] tracking-wider font-semibold">
            Batch Depleted
          </span>
          <div className="font-headline text-3xl text-[#7c5800] font-bold">
            0{drinks.filter((d) => d.availability === 'out_of_stock').length}
          </div>
          <div className="text-xs text-[#7c5800] font-medium">Fermentation pending</div>
        </div>

        <div className="bg-white p-6 border border-[#003422]/10 space-y-1">
          <span className="text-xs uppercase text-[#404943] tracking-wider font-semibold">
            Gross Average Unit
          </span>
          <div className="font-headline text-3xl text-[#003422] font-bold">
            GH₵{' '}
            {(
              drinks.reduce((sum, d) => sum + d.price, 0) / (drinks.length || 1)
            ).toFixed(2)}
          </div>
          <div className="text-xs text-[#404943]">Standardized 330ml - 750ml range</div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-[#003422]/10 shadow-sm">
        {/* Filter bar */}
        <div className="p-4 bg-[#f1eee5] flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#003422]/10">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search drinks or botanicals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-72 bg-white px-3 py-2 text-xs border border-[#003422]/20 focus:outline-none"
            />

            <div className="flex items-center gap-1 text-xs uppercase tracking-wider">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 font-bold ${
                  statusFilter === 'all'
                    ? 'bg-[#003422] text-white'
                    : 'text-[#404943] hover:text-[#1c1c17]'
                }`}
              >
                All ({drinks.length})
              </button>
              <button
                onClick={() => setStatusFilter('available')}
                className={`px-3 py-1.5 ${
                  statusFilter === 'available'
                    ? 'bg-[#003422] text-white font-bold'
                    : 'text-[#404943] hover:text-[#1c1c17]'
                }`}
              >
                Available ({drinks.filter((d) => d.availability === 'available').length})
              </button>
              <button
                onClick={() => setStatusFilter('depleted')}
                className={`px-3 py-1.5 ${
                  statusFilter === 'depleted'
                    ? 'bg-[#003422] text-white font-bold'
                    : 'text-[#404943] hover:text-[#1c1c17]'
                }`}
              >
                Depleted ({drinks.filter((d) => d.availability === 'out_of_stock').length})
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#ebe8df] text-[#404943] text-xs uppercase tracking-widest border-b border-[#003422]/10">
                <th className="py-4 px-6 font-semibold">Bottle & Formulation</th>
                <th className="py-4 px-4 font-semibold">Volume & Type</th>
                <th className="py-4 px-4 font-semibold">Unit Price</th>
                <th className="py-4 px-4 font-semibold">Cellar Availability</th>
                <th className="py-4 px-6 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#003422]/5">
              {filteredDrinks.map((drink) => {
                const isAvail = drink.availability === 'available'

                return (
                  <tr key={drink.id} className="hover:bg-[#fcf9f0] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-16 bg-[#f1eee5] flex-shrink-0 p-1 flex items-center justify-center border border-[#003422]/10">
                          <img
                            src={drink.imageUrl}
                            alt={drink.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-headline text-base text-[#1c1c17] font-semibold">
                            {drink.name}
                          </div>
                          <div className="text-xs text-[#404943]">{drink.subtitle}</div>
                          <div className="text-[10px] uppercase tracking-widest text-[#003422] font-bold mt-1">
                            {drink.batchNumber || 'Batch Active'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-[#1c1c17]">{drink.volume}</span>
                      <span className="block text-[10px] uppercase text-[#404943]">
                        {drink.category}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-bold text-[#003422]">
                      GH₵ {drink.price.toFixed(2)}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleAvailability(drink)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                            isAvail ? 'bg-[#003422]' : 'bg-[#e5e2da]'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform ${
                              isAvail ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span
                          className={`text-xs uppercase px-2 py-0.5 font-bold ${
                            isAvail
                              ? 'bg-[#174c36] text-white'
                              : 'bg-[#ffcd70] text-[#785500]'
                          }`}
                        >
                          {isAvail ? 'Available' : 'Out of Stock'}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDrawer(drink)}
                          className="p-2 text-[#1c1c17] hover:text-[#003422] transition-colors"
                          title="Edit formulation"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(drink.id, drink.name)}
                          className="p-2 text-[#1c1c17] hover:text-red-700 transition-colors"
                          title="Delete formulation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#f1eee5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#404943]">
          <span>Showing {filteredDrinks.length} of {drinks.length} artisanal catalog entries</span>
          <span className="uppercase tracking-widest text-[10px]">Realtime Cloud Sync Active</span>
        </div>
      </div>

      {/* Slide-out Drawer / Live Form Modal */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="h-full w-full max-w-lg bg-white p-8 flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div className="space-y-6">
              {/* Drawer Top */}
              <div className="flex items-center justify-between border-b border-[#003422]/10 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#404943] block">
                    Catalog Formulation
                  </span>
                  <h2 className="font-headline text-2xl text-[#003422] font-semibold">
                    {isEditing ? 'Edit Drink Details' : 'Add New Formulation'}
                  </h2>
                </div>
                <button
                  onClick={closeDrawer}
                  className="p-2 text-[#404943] hover:text-[#1c1c17]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSave} className="space-y-4">
                {/* Image Upload / Presentation */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-[#404943] font-semibold block">
                    Bottle Presentation
                  </label>
                  <div className="flex items-center gap-4 bg-[#f6f3ea] p-3 border border-[#003422]/10">
                    <div className="w-16 h-20 bg-[#dddad1] flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {imageUrl ? (
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-[#404943]">No img</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-[#1c1c17] font-semibold block">
                        Cloudinary / Studio Image
                      </span>
                      <label className="inline-flex items-center gap-1.5 bg-[#ebe8df] px-3 py-1.5 text-xs uppercase tracking-wider text-[#1c1c17] hover:bg-[#e5e2da] cursor-pointer font-semibold">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Direct Image URL input if desired */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-[#404943] font-semibold block">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#f6f3ea] px-4 py-2 text-xs border border-[#003422]/20 focus:outline-none"
                  />
                </div>

                {/* Drink Name */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-[#404943] font-semibold block">
                    Drink Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sobolo"
                    className="w-full bg-[#f6f3ea] px-4 py-2.5 text-sm font-semibold border border-[#003422]/20 focus:outline-none"
                  />
                </div>

                {/* Subtitle */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-[#404943] font-semibold block">
                    Subtitle / Botanical Description
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="Hibiscus Bissap & Selim"
                    className="w-full bg-[#f6f3ea] px-4 py-2 text-xs border border-[#003422]/20 focus:outline-none"
                  />
                </div>

                {/* Price & Volume Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-[#404943] font-semibold block">
                      Price (GH₵)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-[#f6f3ea] px-4 py-2 text-sm font-semibold border border-[#003422]/20 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-[#404943] font-semibold block">
                      Bottle Volume
                    </label>
                    <input
                      type="text"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      placeholder="330ml / 500ml"
                      className="w-full bg-[#f6f3ea] px-4 py-2 text-sm border border-[#003422]/20 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Category & Status Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-[#404943] font-semibold block">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-[#f6f3ea] px-3 py-2 text-xs border border-[#003422]/20 focus:outline-none"
                    >
                      <option value="botanical">Botanical & Spiced</option>
                      <option value="fermented">Fermented & Brewed</option>
                      <option value="creamy">Sweet & Creamy</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-[#404943] font-semibold block">
                      Availability Status
                    </label>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value as any)}
                      className="w-full bg-[#f6f3ea] px-3 py-2 text-xs border border-[#003422]/20 focus:outline-none"
                    >
                      <option value="available">Available (Storefront)</option>
                      <option value="out_of_stock">Out of Stock</option>
                      <option value="reserve">Reserve Allocation</option>
                    </select>
                  </div>
                </div>

                {/* Short Description */}
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-[#404943] font-semibold block">
                    Short Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Handcrafted organic roselle calyx..."
                    className="w-full bg-[#f6f3ea] p-3 text-xs border border-[#003422]/20 focus:outline-none resize-none leading-relaxed"
                  />
                </div>

                {/* Badge Text & Batch Number */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-[#404943] font-semibold block">
                      Badge Text
                    </label>
                    <input
                      type="text"
                      value={badgeText}
                      onChange={(e) => setBadgeText(e.target.value)}
                      placeholder="Cold Steeped • 18 hrs"
                      className="w-full bg-[#f6f3ea] px-3 py-2 text-xs border border-[#003422]/20 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-wider text-[#404943] font-semibold block">
                      Batch Label
                    </label>
                    <input
                      type="text"
                      value={batchNumber}
                      onChange={(e) => setBatchNumber(e.target.value)}
                      placeholder="Batch #NS-091"
                      className="w-full bg-[#f6f3ea] px-3 py-2 text-xs border border-[#003422]/20 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-[#003422]/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="bg-[#ebe8df] text-[#1c1c17] px-5 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-[#e5e2da] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-[#003422] text-white px-5 py-2.5 text-xs uppercase tracking-wider font-semibold hover:bg-[#174c36] transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
