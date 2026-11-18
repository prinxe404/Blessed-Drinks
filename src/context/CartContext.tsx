'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { CartItem, ProductItem } from '@/types'

interface CartContextType {
  items: CartItem[]
  addItem: (product: ProductItem, qty?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
  toastMessage: string | null
  toastVisible: boolean
  hideToast: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'blessed_drinks_cart_v1'

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [toastVisible, setToastVisible] = useState(false)

  // Load cart from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch (e) {
      console.warn('Failed reading cart from localStorage', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Persist cart to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      } catch (e) {
        console.warn('Failed saving cart to localStorage', e)
      }
    }
  }, [items, isLoaded])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setToastVisible(true)
    setTimeout(() => {
      setToastVisible(false)
    }, 3200)
  }

  const hideToast = () => {
    setToastVisible(false)
  }

  const addItem = (product: ProductItem, qty = 1) => {
    if (product.availability === 'out_of_stock' || product.stockQuantity < 1) {
      showToast(`${product.name} is currently out of stock`)
      return
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) {
        const newQty = Math.min(existing.quantity + qty, product.stockQuantity)
        return prev.map((i) => (i.product.id === product.id ? { ...i, quantity: newQty } : i))
      } else {
        return [...prev, { product, quantity: Math.min(qty, product.stockQuantity) }]
      }
    })

    showToast(`${product.name} (${product.volume || 'Bottle'}) added to bag`)
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.product.id === productId) {
          const max = i.product.stockQuantity || 99
          return { ...i, quantity: Math.min(quantity, max) }
        }
        return i
      })
    )
  }

  const clearCart = () => {
    setItems([])
    try {
      localStorage.removeItem(CART_STORAGE_KEY)
    } catch (e) {}
  }

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0)
  const subtotal = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        toastMessage,
        toastVisible,
        hideToast,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}
