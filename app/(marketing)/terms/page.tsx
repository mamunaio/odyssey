'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white font-sans p-6 md:p-24">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-500 font-bold mb-12 hover:underline">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-5xl font-black mb-8">Terms of Service</h1>
        <p className="text-xl text-white/70 mb-12">Last updated: May 17, 2026</p>
        
        <div className="space-y-12 text-lg text-white font-medium leading-relaxed">
          <section>
            <h2 className="text-2xl font-black mb-4">1. Acceptance of Terms</h2>
            <p>By accessing or using Odyssey, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-black mb-4">2. User Accounts</h2>
            <p>You are responsible for maintaining the security of your account and workspace. Odyssey cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-4">3. Payment Terms</h2>
            <p>Subscription fees are billed in advance on a monthly or annual basis and are non-refundable for the current billing period.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-black mb-4">4. Termination</h2>
            <p>Odyssey reserves the right to terminate your account for any reason, including violation of these terms, at any time.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
