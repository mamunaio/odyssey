import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import connectDB from '@/lib/db/connect'
import { stripe, getOrCreateStripeCustomer, PLAN_PRICE_IDS } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { plan } = await req.json()
    if (!plan || !['starter', 'pro', 'enterprise'].includes(plan)) {
      return NextResponse.json({ success: false, error: 'Invalid plan selected' }, { status: 400 })
    }

    const tenantId = (session.user as { tenantId: string }).tenantId
    await connectDB()

    const host = req.headers.get('x-forwarded-host') || req.headers.get('host')
    const protocol = req.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https')
    const appUrl = host ? `${protocol}://${host}` : (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')

    // 1. Detect if the Stripe API key is the dummy placeholder
    const stripeKey = process.env.STRIPE_SECRET_KEY || ''
    const isPlaceholderKey = stripeKey.startsWith('sk_test_...') || stripeKey === 'sk_test_' || !stripeKey

    if (isPlaceholderKey) {
      // SIMULATED DEMO MODE: Directly upgrade in DB and redirect back with simulated parameter
      const Tenant = (await import('@/lib/models/Tenant')).default
      await Tenant.findByIdAndUpdate(tenantId, {
        plan,
        status: 'active'
      })
      return NextResponse.json({
        success: true,
        url: `${appUrl}/dashboard/billing?simulated_success=true&plan=${plan}`
      })
    }

    // 2. Real Stripe Mode: Get or create the Stripe customer in Mongoose & Stripe
    const stripeCustomerId = await getOrCreateStripeCustomer(tenantId)

    // 2. Identify the active Price ID from config mapping
    const priceId = PLAN_PRICE_IDS[plan as keyof typeof PLAN_PRICE_IDS]

    // 3. Initiate the Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/dashboard/billing`,
      metadata: {
        tenantId,
        plan,
      },
    })

    return NextResponse.json({ success: true, url: checkoutSession.url })
  } catch (error: any) {
    console.error('[STRIPE_CHECKOUT_ERROR]:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
