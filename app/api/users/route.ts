import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import connectDB from '@/lib/db/connect'
import { User } from '@/lib/models'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    const users = await User.find({ tenantId: (session.user as { tenantId: string }).tenantId })
      .select('-password')
      .sort({ createdAt: -1 })

    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { userId, role, isActive } = await req.json()
    if (!userId) return NextResponse.json({ success: false, error: 'Missing userId' }, { status: 400 })

    await connectDB()

    const user = await User.findOne({ _id: userId, tenantId: (session.user as { tenantId: string }).tenantId })
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

    // Prevent deactivating the last owner
    if (isActive === false && user.role === 'owner') {
        const ownerCount = await User.countDocuments({ tenantId: user.tenantId, role: 'owner', isActive: true })
        if (ownerCount <= 1) {
            return NextResponse.json({ success: false, error: 'Cannot deactivate the last owner' }, { status: 400 })
        }
    }

    if (role !== undefined) user.role = role
    if (isActive !== undefined) user.isActive = isActive
    
    await user.save()

    return NextResponse.json({ success: true, message: 'User updated successfully' })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    
    if (!userId) return NextResponse.json({ success: false, error: 'Missing userId' }, { status: 400 })

    await connectDB()

    const user = await User.findOne({ _id: userId, tenantId: (session.user as { tenantId: string }).tenantId })
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

    if (user.role === 'owner') {
        return NextResponse.json({ success: false, error: 'Owners cannot be removed directly. Transfer ownership first.' }, { status: 400 })
    }

    await User.findByIdAndDelete(userId)

    return NextResponse.json({ success: true, message: 'User removed successfully' })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
