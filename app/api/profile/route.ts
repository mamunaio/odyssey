import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import connectDB from '@/lib/db/connect'
import { User } from '@/lib/models'
import bcrypt from 'bcryptjs'

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { name, currentPassword, newPassword } = await req.json()
    const userId = (session.user as { id: string }).id

    await connectDB()

    const user = await User.findById(userId)
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

    // Update name if provided
    if (name) user.name = name

    // Handle password change
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password || '')
      if (!isMatch) {
        return NextResponse.json({ success: false, error: 'Incorrect current password' }, { status: 400 })
      }
      user.password = await bcrypt.hash(newPassword, 12)
    }

    await user.save()

    return NextResponse.json({ success: true, message: 'Profile updated successfully' })
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
