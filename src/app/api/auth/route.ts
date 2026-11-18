import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

function getPool(): Pool {
  const connectionString = process.env.DATABASE_URI || ''
  return new Pool({
    connectionString,
    ssl: connectionString.includes('neon') ? { rejectUnauthorized: false } : false,
  })
}

export async function GET(req: NextRequest) {
  const pool = getPool()
  try {
    const res = await pool.query('SELECT count(*) FROM admin_users')
    const count = parseInt(res.rows[0].count, 10)
    await pool.end()
    return NextResponse.json({
      hasAdmin: count > 0,
      count,
    })
  } catch (error: any) {
    await pool.end()
    return NextResponse.json({ hasAdmin: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const pool = getPool()
  try {
    const body = await req.json()
    const { action, name, email, password } = body

    if (!email || !password) {
      await pool.end()
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const cleanEmail = email.trim().toLowerCase()

    // 1. Create first admin user
    if (action === 'create-first-user') {
      const check = await pool.query('SELECT count(*) FROM admin_users')
      const count = parseInt(check.rows[0].count, 10)

      if (count > 0) {
        await pool.end()
        return NextResponse.json(
          {
            success: false,
            error: 'An administrator account already exists. Please log in.',
          },
          { status: 403 }
        )
      }

      if (password.length < 6) {
        await pool.end()
        return NextResponse.json(
          { success: false, error: 'Password must be at least 6 characters' },
          { status: 400 }
        )
      }

      const salt = await bcrypt.genSalt(10)
      const passwordHash = await bcrypt.hash(password, salt)
      const adminId = `admin-${Date.now()}`
      const adminName = name?.trim() || 'Blessed Administrator'

      await pool.query(
        `INSERT INTO admin_users (id, name, email, password_hash, role, created_at, updated_at)
         VALUES ($1, $2, $3, $4, 'admin', NOW(), NOW())`,
        [adminId, adminName, cleanEmail, passwordHash]
      )

      await pool.end()

      // Set cookie for automatic sign in
      const response = NextResponse.json({
        success: true,
        message: 'Admin account created successfully',
        user: { id: adminId, name: adminName, email: cleanEmail, role: 'admin' },
      })

      response.cookies.set('blessed_admin_token', adminId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return response
    }

    // 2. Standard Login
    if (action === 'login') {
      const res = await pool.query(
        'SELECT id, name, email, password_hash, role FROM admin_users WHERE email = $1',
        [cleanEmail]
      )

      if (res.rows.length === 0) {
        await pool.end()
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        )
      }

      const user = res.rows[0]
      const isValid = await bcrypt.compare(password, user.password_hash)

      if (!isValid) {
        await pool.end()
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        )
      }

      await pool.end()

      const response = NextResponse.json({
        success: true,
        message: 'Logged in successfully',
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      })

      response.cookies.set('blessed_admin_token', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })

      return response
    }

    // 3. Logout
    if (action === 'logout') {
      await pool.end()
      const response = NextResponse.json({ success: true, message: 'Logged out' })
      response.cookies.delete('blessed_admin_token')
      return response
    }

    await pool.end()
    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 })
  } catch (error: any) {
    await pool.end()
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
