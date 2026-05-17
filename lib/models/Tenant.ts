import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ITenantDocument extends Document {
  name: string
  slug: string
  domain?: string
  logo?: string
  plan: 'starter' | 'pro' | 'enterprise'
  status: 'active' | 'suspended' | 'trial' | 'cancelled'
  trialEndsAt?: Date
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  maxMembers: number
  maxProjects: number
  settings: {
    ssoEnabled: boolean
    twoFactorRequired: boolean
    allowedDomains?: string[]
    customBranding?: { primaryColor: string; logo?: string }
  }
  createdAt: Date
  updatedAt: Date
}

const TenantSchema = new Schema<ITenantDocument>({
  name:     { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  slug:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  domain:   { type: String, sparse: true, lowercase: true },
  logo:     { type: String },
  plan:     { type: String, enum: ['starter','pro','enterprise'], default: 'starter' },
  status:   { type: String, enum: ['active','suspended','trial','cancelled'], default: 'trial' },
  trialEndsAt: { type: Date, default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
  stripeCustomerId:     { type: String, sparse: true },
  stripeSubscriptionId: { type: String, sparse: true },
  maxMembers:  { type: Number, default: 5 },
  maxProjects: { type: Number, default: 3 },
  settings: {
    ssoEnabled:          { type: Boolean, default: false },
    twoFactorRequired:   { type: Boolean, default: false },
    allowedDomains:      [{ type: String }],
    customBranding: {
      primaryColor: { type: String, default: '#3a5fff' },
      logo:         { type: String },
    },
  },
}, { timestamps: true, toJSON: { virtuals: true } })

TenantSchema.index({ slug: 1 }, { unique: true })
TenantSchema.index({ stripeCustomerId: 1 }, { sparse: true })

const Tenant: Model<ITenantDocument> =
  mongoose.models.Tenant ?? mongoose.model('Tenant', TenantSchema)

export default Tenant
