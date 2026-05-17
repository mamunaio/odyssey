import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import connectDB from '@/lib/db/connect'
import { stripe } from '@/lib/stripe'
import Tenant from '@/lib/models/Tenant'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const tenantId = (session.user as { tenantId: string }).tenantId
    await connectDB()

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // 1. Detect if the Stripe API key is the dummy placeholder
    const stripeKey = process.env.STRIPE_SECRET_KEY || ''
    const isPlaceholderKey = stripeKey.startsWith('sk_test_...') || stripeKey === 'sk_test_' || !stripeKey

    if (isPlaceholderKey) {
      // SIMULATED PORTAL MODE: Redirect back with simulated portal parameter
      return NextResponse.json({
        success: true,
        url: `${appUrl}/dashboard/billing?simulated_portal=true`
      })
    }

    const tenant = await Tenant.findById(tenantId)
    if (!tenant) {
      return NextResponse.json({ success: false, error: 'Tenant not found' }, { status: 404 })
    }

    if (!tenant.stripeCustomerId) {
      return NextResponse.json(
        { success: false, error: 'No billing history found. Please upgrade your plan first.' },
        { status: 400 }
      )
    }

    // Create the billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: tenant.stripeCustomerId,
      return_url: `${appUrl}/dashboard/billing`,
    })

    return NextResponse.json({ success: true, url: portalSession.url })
  } catch (error: any) {
    console.error('[STRIPE_PORTAL_ERROR]:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
