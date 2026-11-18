import { NextRequest, NextResponse } from 'next/server'
import { fetchProducts } from '@/lib/db'

export async function GET() {
  try {
    const products = await fetchProducts()
    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch drinks catalog' },
      { status: 500 }
    )
  }
}
