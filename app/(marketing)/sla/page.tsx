'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'

export default function SLAPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white font-sans p-6 md:p-24">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-500 font-bold mb-12 hover:underline">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-5xl font-black mb-8">Service Level Agreement</h1>
        <p className="text-xl text-white/70 mb-12">Commitment to reliability and uptime.</p>
        
        <div className="space-y-12 text-lg text-white font-medium leading-relaxed">
          <section>
            <h2 className="text-2xl font-black mb-4">1. Uptime Commitment</h2>
            <p>Odyssey commits to providing a 99.9% uptime guarantee for all Professional and Enterprise customers.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-black mb-4">2. Maintenance Windows</h2>
            <p>Planned maintenance will be communicated at least 48 hours in advance and will typically occur during low-usage hours.</p>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-4">3. Support Response Times</h2>
            <p>Pro users receive priority email support with a guaranteed response within 12 hours. Enterprise users receive 24/7 dedicated support.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
