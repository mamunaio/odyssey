'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, Shield, Lock, Users, EyeOff } from 'lucide-react'

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white font-sans p-6 md:p-24">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-500 font-bold mb-12 hover:underline">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-6xl font-black mb-8">Security</h1>
        <p className="text-2xl text-white/70 mb-16 max-w-2xl">Bank-grade security is not an option—it is our core promise.</p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {[
            { icon: Shield, t: 'Hardened Isolation', d: 'Using logical database isolation and Row-Level Security (RLS) to ensure zero data leakage between tenants.' },
            { icon: Lock, t: 'Enterprise Auth', d: 'Support for SAML SSO, Multi-Factor Authentication (MFA), and magic links out of the box.' },
            { icon: EyeOff, t: 'Encrypted at Rest', d: 'All customer data is encrypted using AES-256 both in transit and at rest.' },
            { icon: Users, t: 'RBAC Controls', d: 'Fine-grained Role-Based Access Control to manage who can see and do what in your workspace.' },
          ].map((item, i) => (
            <div key={i} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-brand-600 transition-all">
              <item.icon className="w-10 h-10 text-brand-600 mb-6" />
              <h3 className="text-2xl font-black mb-4">{item.t}</h3>
              <p className="text-white/70 leading-relaxed font-medium">{item.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
