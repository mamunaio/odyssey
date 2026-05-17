import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth/config'
import connectDB from '@/lib/db/connect'
import { Invitation, User, Tenant } from '@/lib/models'
import { generateToken } from '@/lib/utils'

const InviteSchema = z.object({
  email: z.string().email(),
  role:  z.enum(['admin', 'member', 'viewer']),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const role = (session.user as { role: string }).role
    if (!['owner', 'admin'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const body   = await req.json()
    const parsed = InviteSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Validation failed' }, { status: 400 })
    }

    await connectDB()

    const tenantId = (session.user as { tenantId: string }).tenantId
    const tenant   = await Tenant.findById(tenantId)

    // Check member limit
    const memberCount = await User.countDocuments({ tenantId, isActive: true })
    if (tenant && memberCount >= tenant.maxMembers) {
      return NextResponse.json({ success: false, error: 'Member limit reached. Upgrade your plan.' }, { status: 403 })
    }

    // Check existing invitation
    const existing = await Invitation.findOne({ tenantId, email: parsed.data.email, status: 'pending' })
    if (existing) {
      return NextResponse.json({ success: false, error: 'Invitation already sent' }, { status: 409 })
    }

    const invitation = await Invitation.create({
      tenantId,
      email:     parsed.data.email,
      role:      parsed.data.role,
      token:     generateToken(),
      invitedBy: (session.user as { id: string }).id,
    })

    // TODO: Send invitation email via Resend

    return NextResponse.json({ success: true, data: invitation, message: 'Invitation sent' }, { status: 201 })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
