'use client'
import Link from 'next/link'
import { ChevronLeft, Code } from 'lucide-react'

export default function IntroductionPage() {
  return (
    <>
      <h1 className="text-5xl font-black mb-8 text-surface-950 dark:text-white">Introduction</h1>
      <p className="text-xl text-surface-600 dark:text-white font-medium leading-relaxed mb-12">
        Odyssey is a comprehensive infrastructure platform designed for building and scaling multi-tenant SaaS applications. 
        We provide the tools to isolate data, manage global traffic, and handle billing with a single integration.
      </p>

      <div className="p-8 rounded-3xl bg-surface-50 dark:bg-white/5 border border-surface-200 dark:border-white/10 mb-12">
        <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-surface-950 dark:text-white">
          <Code className="w-5 h-5 text-brand-600 dark:text-brand-500" /> Key Features
        </h3>
        <ul className="space-y-4 font-medium text-surface-600 dark:text-white/70">
          <li>• Automated Database Isolation (RLS)</li>
          <li>• Global Edge Routing & Domains</li>
          <li>• Built-in Tenant Management UI</li>
          <li>• Usage-based Billing Integration</li>
        </ul>
      </div>

      <Link href="/" className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-500 font-bold hover:underline">
        <ChevronLeft className="w-4 h-4" /> Back to Odyssey Home
      </Link>
    </>
  )
}
