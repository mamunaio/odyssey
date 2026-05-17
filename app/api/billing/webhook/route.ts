import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/connect'
import Tenant from '@/lib/models/Tenant'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error('Stripe signature or webhook secret is missing')
    }

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err: any) {
    console.error(`⚠️ Webhook signature verification failed:`, err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  await connectDB()

  const session = event.data.object as any

  switch (event.type) {
    case 'checkout.session.completed': {
      const subscriptionId = session.subscription as string
      const customerId = session.customer as string
      const tenantId = session.metadata?.tenantId
      const plan = session.metadata?.plan

      if (!tenantId) {
        console.error('No tenantId found in checkout session metadata')
        break
      }

      await Tenant.findByIdAndUpdate(tenantId, {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        plan: plan || 'starter',
        status: 'active',
      })
      
      console.log(`✅ Subscription created successfully for Tenant ID: ${tenantId}`)
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string
      
      // Determine the plan based on the active Price ID
      const priceId = subscription.items.data[0]?.price.id
      let plan: 'starter' | 'pro' | 'enterprise' = 'starter'
      
      // Map Price IDs back to plans
      if (priceId === process.env.STRIPE_PRICE_PRO) {
        plan = 'pro'
      } else if (priceId === process.env.STRIPE_PRICE_ENTERPRISE) {
        plan = 'enterprise'
      } else if (priceId === process.env.STRIPE_PRICE_STARTER) {
        plan = 'starter'
      } else {
        // Fallback string matching for dummy price IDs
        if (priceId && priceId.includes('pro')) plan = 'pro'
        if (priceId && priceId.includes('enterprise')) plan = 'enterprise'
        if (priceId && priceId.includes('starter')) plan = 'starter'
      }

      let status: 'active' | 'suspended' | 'trial' | 'cancelled' = 'active'
      if (subscription.status === 'active') {
        status = 'active'
      } else if (subscription.status === 'past_due' || subscription.status === 'unpaid') {
        status = 'suspended'
      } else if (subscription.status === 'canceled') {
        status = 'cancelled'
      }

      await Tenant.findOneAndUpdate(
        { stripeCustomerId: customerId },
        {
          stripeSubscriptionId: subscription.id,
          plan,
          status,
        }
      )
      console.log(`🔄 Subscription updated for customer: ${customerId}`)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      await Tenant.findOneAndUpdate(
        { stripeCustomerId: customerId },
        {
          stripeSubscriptionId: null,
          plan: 'starter',
          status: 'cancelled',
        }
      )
      console.log(`❌ Subscription deleted for customer: ${customerId}`)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
export const dynamic = 'force-dynamic'
