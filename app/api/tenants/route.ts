import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import connectDB from '@/lib/db/connect'
import { Tenant } from '@/lib/models'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    const tenant = await Tenant.findById((session.user as { tenantId: string }).tenantId)
    if (!tenant) return NextResponse.json({ success: false, error: 'Tenant not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: tenant })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const role = (session.user as { role: string }).role
    if (!['owner', 'admin'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    await connectDB()

    const tenant = await Tenant.findByIdAndUpdate(
      (session.user as { tenantId: string }).tenantId,
      { $set: body },
      { new: true, runValidators: true }
    )

    return NextResponse.json({ success: true, data: tenant })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
