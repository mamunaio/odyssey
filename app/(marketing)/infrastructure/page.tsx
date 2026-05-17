'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, Globe, Zap, Cpu, Database } from 'lucide-react'

export default function InfrastructurePage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white font-sans p-6 md:p-24">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-500 font-bold mb-12 hover:underline">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>
        <h1 className="text-6xl font-black mb-8">Infrastructure</h1>
        <p className="text-2xl text-white/70 mb-16 max-w-2xl">High-performance foundation for mission-critical SaaS applications.</p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {[
            { icon: Globe, t: 'Global Edge Network', d: 'Your application is served from over 300 locations worldwide, ensuring sub-millisecond latency for every user.' },
            { icon: Zap, t: 'Serverless Compute', d: 'Odyssey utilizes serverless edge functions that scale instantly with your traffic, from one request to millions.' },
            { icon: Database, t: 'Distributed Databases', d: 'Data is replicated across multiple regions for high availability and low-latency access.' },
            { icon: Cpu, t: 'Automated Scaling', d: 'No more manual capacity planning. Our infrastructure handles traffic spikes automatically without downtime.' },
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
