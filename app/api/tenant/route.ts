import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import connectDB from '@/lib/db/connect'
import { Tenant } from '@/lib/models'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const tenantId = (session.user as { tenantId: string }).tenantId
    await connectDB()

    const tenant = await Tenant.findById(tenantId).lean()
    return NextResponse.json({ success: true, data: tenant })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { plan } = await req.json()
    const tenantId = (session.user as { tenantId: string }).tenantId

    await connectDB()

    const tenant = await Tenant.findByIdAndUpdate(
      tenantId,
      { plan },
      { new: true }
    )

    return NextResponse.json({ success: true, data: tenant })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
