'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, Book, Code, Terminal, Zap } from 'lucide-react'

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-white font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-white/10 p-8 space-y-8 shrink-0">
        <Link href="/" className="flex items-center gap-2 mb-10 font-black text-xl tracking-tighter">
          <Zap className="w-5 h-5 fill-white" /> Odyssey Docs
        </Link>
        
        <div>
          <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-500 mb-4">Getting Started</h5>
          <ul className="space-y-3 text-sm font-bold">
            <li className="text-white">Introduction</li>
            <li className="text-white/40 hover:text-white transition-colors cursor-pointer">Quickstart</li>
            <li className="text-white/40 hover:text-white transition-colors cursor-pointer">Architecture</li>
          </ul>
        </div>

        <div>
          <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-500 mb-4">SDK Reference</h5>
          <ul className="space-y-3 text-sm font-bold text-white/40">
            <li className="hover:text-white transition-colors cursor-pointer">Middleware</li>
            <li className="hover:text-white transition-colors cursor-pointer">Hooks</li>
            <li className="hover:text-white transition-colors cursor-pointer">API Keys</li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-24 overflow-y-auto">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-black mb-8">Introduction</h1>
          <p className="text-xl text-white font-medium leading-relaxed mb-12">
            Odyssey is a comprehensive infrastructure platform designed for building and scaling multi-tenant SaaS applications. 
            We provide the tools to isolate data, manage global traffic, and handle billing with a single integration.
          </p>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 mb-12">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <Code className="w-5 h-5 text-brand-500" /> Key Features
            </h3>
            <ul className="space-y-4 font-medium text-white/70">
              <li>• Automated Database Isolation (RLS)</li>
              <li>• Global Edge Routing & Domains</li>
              <li>• Built-in Tenant Management UI</li>
              <li>• Usage-based Billing Integration</li>
            </ul>
          </div>

          <Link href="/" className="inline-flex items-center gap-2 text-brand-500 font-bold hover:underline">
            <ChevronLeft className="w-4 h-4" /> Back to Odyssey Home
          </Link>
        </div>
      </main>
    </div>
  )
}
