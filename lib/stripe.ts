import Stripe from 'stripe'
import Tenant from './models/Tenant'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

// Initializing the Stripe SDK
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Price mapping to dynamically map Plan Slugs to Stripe price IDs
export const PLAN_PRICE_IDS = {
  starter: process.env.STRIPE_PRICE_STARTER || 'price_starter_dummy',
  pro: process.env.STRIPE_PRICE_PRO || 'price_pro_dummy',
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise_dummy',
}

/**
 * Gets the existing Stripe Customer ID for a Tenant or creates one if it doesn't exist.
 * @param tenantId The ID of the Tenant in MongoDB
 * @returns The Stripe Customer ID string
 */
export async function getOrCreateStripeCustomer(tenantId: string): Promise<string> {
  const tenant = await Tenant.findById(tenantId)
  if (!tenant) {
    throw new Error('Tenant not found')
  }

  if (tenant.stripeCustomerId) {
    return tenant.stripeCustomerId
  }

  // Create Stripe Customer with metadata for traceability
  const customer = await stripe.customers.create({
    name: tenant.name,
    metadata: {
      tenantId: tenant._id.toString(),
      slug: tenant.slug,
    },
  })

  // Update MongoDB tenant record
  tenant.stripeCustomerId = customer.id
  await tenant.save()

  return customer.id
}
