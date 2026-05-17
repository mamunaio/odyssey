'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white font-sans p-6 md:p-24">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-500 font-bold mb-12 hover:underline">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-5xl font-black mb-8">Privacy Policy</h1>
        <p className="text-xl text-white/70 mb-12">Last updated: May 17, 2026</p>
        
        <div className="space-y-12 text-lg text-white font-medium leading-relaxed">
          <section>
            <h2 className="text-2xl font-black mb-4">1. Data Collection</h2>
            <p>We collect information that you provide directly to us when you create an account, create or modify your profile, or use our services.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-black mb-4">2. Use of Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect Odyssey and our users.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-4">3. Data Isolation</h2>
            <p>As a multi-tenant platform, your data is isolated at the database level. We never share data between tenants without explicit permission.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-black mb-4">4. Security</h2>
            <p>We use industry-standard security measures to protect your data from unauthorized access, disclosure, alteration, or destruction.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
