import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import connectDB from '@/lib/db/connect'
import { User, Tenant } from '@/lib/models'
import { slugify } from '@/lib/utils'

const RegisterSchema = z.object({
  name:         z.string().min(2).max(100),
  email:        z.string().email(),
  password:     z.string().min(8).max(100),
  companyName:  z.string().min(2).max(100),
})

export async function POST(req: NextRequest) {
  try {
    const body   = await req.json()
    const parsed = RegisterSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { name, email, password, companyName } = parsed.data

    await connectDB()

    // Generate unique slug
    let slug      = slugify(companyName)
    const slugCount = await Tenant.countDocuments({ slug: new RegExp(`^${slug}`) })
    if (slugCount > 0) slug = `${slug}-${slugCount + 1}`

    // Check existing user across all tenants
    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Create tenant
    const tenant = await Tenant.create({ name: companyName, slug })

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create owner user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      tenantId: tenant._id,
      role: 'owner',
    })

    return NextResponse.json({
      success: true,
      data: { userId: user._id, tenantId: tenant._id, slug: tenant.slug },
      message: 'Account created successfully',
    }, { status: 201 })

  } catch (error: unknown) {
    const err = error as Error & { errors?: unknown };
    console.error('[REGISTER_ERROR]', {
      message: err.message,
      stack: err.stack,
      errors: err.errors // For Mongoose validation errors
    })
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
