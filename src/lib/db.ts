import { Pool } from 'pg'
import { INITIAL_PRODUCTS, DEFAULT_SETTINGS } from './initial-data'
import { ProductItem, OrderRecord, BusinessSettings } from '@/types'

let poolInstance: Pool | null = null

function getPool(): Pool | null {
  if (poolInstance) return poolInstance

  const connectionString = process.env.DATABASE_URI
  if (!connectionString) {
    return null
  }

  poolInstance = new Pool({
    connectionString,
    ssl: connectionString.includes('neon') ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
  })

  return poolInstance
}

// In-memory fallback in case of transient DB disconnection
let memoryProducts: ProductItem[] = [...INITIAL_PRODUCTS]
let memoryOrders: OrderRecord[] = []
let memorySettings: BusinessSettings = { ...DEFAULT_SETTINGS }

export async function fetchProducts(): Promise<ProductItem[]> {
  const pool = getPool()
  if (pool) {
    try {
      const res = await pool.query(
        `SELECT id, name, slug, subtitle, price, volume, category, short_description AS "shortDescription", 
                image_url AS "imageUrl", badge_text AS "badgeText", availability, stock_quantity AS "stockQuantity", 
                is_featured AS "isFeatured", batch_number AS "batchNumber"
         FROM products 
         ORDER BY id ASC`
      )
      if (res.rows && res.rows.length > 0) {
        return res.rows.map((row) => ({
          ...row,
          price: parseFloat(row.price),
          stockQuantity: parseInt(row.stockQuantity, 10),
        }))
      }
    } catch (err) {
      console.warn('Neon DB query error on fetchProducts, using memory fallback:', err)
    }
  }
  return memoryProducts
}

export async function fetchProductById(id: string): Promise<ProductItem | null> {
  const products = await fetchProducts()
  return products.find((p) => p.id === id || p.slug === id) || null
}

export async function saveProduct(item: Partial<ProductItem>): Promise<ProductItem> {
  const pool = getPool()
  const productId = item.id || `prod-${Date.now()}`

  const newOrUpdated: ProductItem = {
    id: productId,
    name: item.name || 'New Drink',
    slug: item.slug || `drink-${Date.now()}`,
    subtitle: item.subtitle || '',
    price: item.price || 25.0,
    volume: item.volume || '330ml',
    category: item.category || 'botanical',
    shortDescription: item.shortDescription || '',
    imageUrl: item.imageUrl || INITIAL_PRODUCTS[0].imageUrl,
    badgeText: item.badgeText || '',
    availability: item.availability || 'available',
    stockQuantity: item.stockQuantity ?? 50,
    isFeatured: Boolean(item.isFeatured),
    batchNumber: item.batchNumber || `Batch #NS-${Math.floor(Math.random() * 900 + 100)}`,
  }

  if (pool) {
    try {
      await pool.query(
        `INSERT INTO products 
          (id, name, slug, subtitle, price, volume, category, short_description, image_url, badge_text, availability, stock_quantity, is_featured, batch_number, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW())
         ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          slug = EXCLUDED.slug,
          subtitle = EXCLUDED.subtitle,
          price = EXCLUDED.price,
          volume = EXCLUDED.volume,
          category = EXCLUDED.category,
          short_description = EXCLUDED.short_description,
          image_url = EXCLUDED.image_url,
          badge_text = EXCLUDED.badge_text,
          availability = EXCLUDED.availability,
          stock_quantity = EXCLUDED.stock_quantity,
          is_featured = EXCLUDED.is_featured,
          batch_number = EXCLUDED.batch_number,
          updated_at = NOW()`,
        [
          newOrUpdated.id,
          newOrUpdated.name,
          newOrUpdated.slug,
          newOrUpdated.subtitle,
          newOrUpdated.price,
          newOrUpdated.volume,
          newOrUpdated.category,
          newOrUpdated.shortDescription,
          newOrUpdated.imageUrl,
          newOrUpdated.badgeText,
          newOrUpdated.availability,
          newOrUpdated.stockQuantity,
          newOrUpdated.isFeatured,
          newOrUpdated.batchNumber,
        ]
      )
      return newOrUpdated
    } catch (err) {
      console.warn('Neon DB saveProduct error, updating in-memory:', err)
    }
  }

  const idx = memoryProducts.findIndex((p) => p.id === productId)
  if (idx !== -1) {
    memoryProducts[idx] = newOrUpdated
  } else {
    memoryProducts.unshift(newOrUpdated)
  }
  return newOrUpdated
}

export async function deleteProduct(id: string): Promise<boolean> {
  const pool = getPool()
  if (pool) {
    try {
      await pool.query('DELETE FROM products WHERE id = $1', [id])
      return true
    } catch (err) {
      console.warn('Neon DB deleteProduct error:', err)
    }
  }
  memoryProducts = memoryProducts.filter((p) => p.id !== id)
  return true
}

export async function fetchOrders(): Promise<OrderRecord[]> {
  const pool = getPool()
  if (pool) {
    try {
      const res = await pool.query(
        `SELECT id, order_id AS "orderId", customer_name AS "customerName", phone_number AS "phoneNumber",
                delivery_location AS "deliveryLocation", delivery_address AS "deliveryAddress",
                additional_instructions AS "additionalInstructions", items, subtotal, delivery_fee AS "deliveryFee",
                total_amount AS "totalAmount", status, whatsapp_url AS "whatsappUrl",
                to_char(created_at, 'Mon DD, YYYY HH:MI AM') AS "createdAt"
         FROM orders
         ORDER BY created_at DESC
         LIMIT 100`
      )
      if (res.rows && res.rows.length > 0) {
        return res.rows.map((row) => ({
          ...row,
          subtotal: parseFloat(row.subtotal),
          deliveryFee: parseFloat(row.deliveryFee),
          totalAmount: parseFloat(row.totalAmount),
          items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
        }))
      }
    } catch (err) {
      console.warn('Neon DB fetchOrders error, using memory fallback:', err)
    }
  }
  return memoryOrders
}

export async function createOrder(orderData: Omit<OrderRecord, 'id' | 'createdAt'>): Promise<OrderRecord> {
  const pool = getPool()
  const orderIdKey = `ord-${Date.now()}`

  const newRecord: OrderRecord = {
    ...orderData,
    id: orderIdKey,
    createdAt: 'Just now',
  }

  if (pool) {
    try {
      await pool.query(
        `INSERT INTO orders 
          (id, order_id, customer_name, phone_number, delivery_location, delivery_address, additional_instructions, items, subtotal, delivery_fee, total_amount, status, whatsapp_url, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())`,
        [
          orderIdKey,
          orderData.orderId,
          orderData.customerName,
          orderData.phoneNumber,
          orderData.deliveryLocation,
          orderData.deliveryAddress,
          orderData.additionalInstructions || '',
          JSON.stringify(orderData.items),
          orderData.subtotal,
          orderData.deliveryFee,
          orderData.totalAmount,
          orderData.status,
          orderData.whatsappUrl || '',
        ]
      )
      return newRecord
    } catch (err) {
      console.warn('Neon DB createOrder error, saving to memory fallback:', err)
    }
  }

  memoryOrders.unshift(newRecord)
  return newRecord
}

export async function updateOrderStatus(orderId: string, status: OrderRecord['status']): Promise<boolean> {
  const pool = getPool()
  if (pool) {
    try {
      const res = await pool.query(
        `UPDATE orders SET status = $1, updated_at = NOW() WHERE order_id = $2 OR id = $2`,
        [status, orderId]
      )
      if ((res.rowCount ?? 0) > 0) return true
    } catch (err) {
      console.warn('Neon DB updateOrderStatus error:', err)
    }
  }

  const order = memoryOrders.find((o) => o.orderId === orderId || o.id === orderId)
  if (order) {
    order.status = status
    return true
  }
  return false
}

export async function fetchSettings(): Promise<BusinessSettings> {
  const pool = getPool()
  if (pool) {
    try {
      const res = await pool.query(
        `SELECT business_name AS "businessName", tagline, whatsapp_number AS "whatsappNumber",
                business_phone AS "businessPhone", business_email AS "businessEmail",
                delivery_fee AS "deliveryFee", operating_hours AS "operatingHours",
                delivery_coverage AS "deliveryCoverage", store_status AS "storeStatus"
         FROM settings
         WHERE id = 'default'
         LIMIT 1`
      )
      if (res.rows && res.rows.length > 0) {
        const row = res.rows[0]
        return {
          ...row,
          deliveryFee: parseFloat(row.deliveryFee),
        }
      }
    } catch (err) {
      console.warn('Neon DB fetchSettings error:', err)
    }
  }
  return memorySettings
}

export async function updateSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
  const pool = getPool()
  const updated: BusinessSettings = { ...memorySettings, ...settings }

  if (pool) {
    try {
      await pool.query(
        `INSERT INTO settings 
          (id, business_name, tagline, whatsapp_number, business_phone, business_email, delivery_fee, operating_hours, delivery_coverage, store_status, updated_at)
         VALUES ('default', $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
         ON CONFLICT (id) DO UPDATE SET
          business_name = EXCLUDED.business_name,
          tagline = EXCLUDED.tagline,
          whatsapp_number = EXCLUDED.whatsapp_number,
          business_phone = EXCLUDED.business_phone,
          business_email = EXCLUDED.business_email,
          delivery_fee = EXCLUDED.delivery_fee,
          operating_hours = EXCLUDED.operating_hours,
          delivery_coverage = EXCLUDED.delivery_coverage,
          store_status = EXCLUDED.store_status,
          updated_at = NOW()`,
        [
          updated.businessName,
          updated.tagline,
          updated.whatsappNumber,
          updated.businessPhone,
          updated.businessEmail,
          updated.deliveryFee,
          updated.operatingHours,
          updated.deliveryCoverage,
          updated.storeStatus,
        ]
      )
      return updated
    } catch (err) {
      console.warn('Neon DB updateSettings error:', err)
    }
  }

  memorySettings = updated
  return updated
}
