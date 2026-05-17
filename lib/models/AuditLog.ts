import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAuditLogDocument extends Document {
  tenantId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  action: string
  resource: string
  resourceId?: string
  metadata?: Record<string, unknown>
  ipAddress?: string
  createdAt: Date
}

const AuditLogSchema = new Schema<IAuditLogDocument>({
  tenantId:   { type: Schema.Types.ObjectId, ref: 'Tenant', required: true },
  userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  action:     { type: String, required: true },
  resource:   { type: String, required: true },
  resourceId: { type: String },
  metadata:   { type: Schema.Types.Mixed },
  ipAddress:  { type: String },
}, { timestamps: true })

AuditLogSchema.index({ tenantId: 1, createdAt: -1 })
AuditLogSchema.index({ userId: 1 })

const AuditLog: Model<IAuditLogDocument> =
  mongoose.models.AuditLog ?? mongoose.model('AuditLog', AuditLogSchema)

export default AuditLog
