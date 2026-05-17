import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUserDocument extends Document {
  name: string
  email: string
  password?: string
  image?: string
  emailVerified?: Date
  tenantId: mongoose.Types.ObjectId
  role: 'owner' | 'admin' | 'member' | 'viewer'
  isActive: boolean
  lastLoginAt?: Date
  notificationPrefs: {
    email: boolean
    inApp: boolean
    digest: 'none' | 'daily' | 'weekly'
  }
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUserDocument>({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, lowercase: true, trim: true },
  password:      { type: String, select: false },
  image:         { type: String },
  emailVerified: { type: Date },
  tenantId:      { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  role:          { type: String, enum: ['owner','admin','member','viewer'], default: 'member' },
  isActive:      { type: Boolean, default: true },
  lastLoginAt:   { type: Date },
  notificationPrefs: {
    email:  { type: Boolean, default: true },
    inApp:  { type: Boolean, default: true },
    digest: { type: String, enum: ['none','daily','weekly'], default: 'weekly' },
  },
}, { timestamps: true, toJSON: { virtuals: true } })

UserSchema.index({ email: 1, tenantId: 1 }, { unique: true })
UserSchema.index({ tenantId: 1 })

const User: Model<IUserDocument> =
  mongoose.models.User ?? mongoose.model('User', UserSchema)

export default User
