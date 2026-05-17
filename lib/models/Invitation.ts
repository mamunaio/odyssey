import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IInvitationDocument extends Document {
  tenantId: mongoose.Types.ObjectId
  email: string
  role: 'admin' | 'member' | 'viewer'
  token: string
  status: 'pending' | 'accepted' | 'expired' | 'revoked'
  invitedBy: mongoose.Types.ObjectId
  expiresAt: Date
  createdAt: Date
}

const InvitationSchema = new Schema<IInvitationDocument>({
  tenantId:  { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  email:     { type: String, required: true, lowercase: true },
  role:      { type: String, enum: ['admin','member','viewer'], default: 'member' },
  token:     { type: String, required: true, unique: true },
  status:    { type: String, enum: ['pending','accepted','expired','revoked'], default: 'pending' },
  invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
}, { timestamps: true })

InvitationSchema.index({ token: 1 }, { unique: true })
InvitationSchema.index({ tenantId: 1, email: 1 })
InvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const Invitation: Model<IInvitationDocument> =
  mongoose.models.Invitation ?? mongoose.model('Invitation', InvitationSchema)

export default Invitation
