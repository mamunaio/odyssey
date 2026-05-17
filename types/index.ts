export type PlanType = 'starter' | 'pro' | 'enterprise'
export type TenantStatus = 'active' | 'suspended' | 'trial' | 'cancelled'
export type MemberRole = 'owner' | 'admin' | 'member' | 'viewer'
export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'revoked'

export interface ITenant {
  _id: string
  name: string
  slug: string
  domain?: string
  logo?: string
  plan: PlanType
  status: TenantStatus
  trialEndsAt?: Date
  stripeCustomerId?: string
  maxMembers: number
  maxProjects: number
  createdAt: Date
  updatedAt: Date
}

export interface IUser {
  _id: string
  name: string
  email: string
  image?: string
  tenantId: string
  role: MemberRole
  isActive: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface IInvitation {
  _id: string
  tenantId: string
  email: string
  role: MemberRole
  token: string
  status: InvitationStatus
  invitedBy: string
  expiresAt: Date
  createdAt: Date
}

export interface ApiSuccess<T = unknown> {
  success: true
  data: T
  message?: string
}

export interface ApiError {
  success: false
  error: string
  code?: string
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError

export const PLAN_LIMITS: Record<PlanType, { members: number; projects: number; storage: string }> = {
  starter:    { members: 5,  projects: 3,  storage: '5GB' },
  pro:        { members: 25, projects: 20, storage: '50GB' },
  enterprise: { members: -1, projects: -1, storage: 'Unlimited' },
}

export const PLAN_PRICES: Record<PlanType, { monthly: number; yearly: number }> = {
  starter:    { monthly: 29,  yearly: 290  },
  pro:        { monthly: 79,  yearly: 790  },
  enterprise: { monthly: 249, yearly: 2490 },
}
