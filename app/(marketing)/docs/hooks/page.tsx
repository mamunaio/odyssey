import Link from 'next/link'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export default function HooksPage() {
  return (
    <>
      <h1 className="text-5xl font-black mb-8 text-surface-950 dark:text-white">React Hooks</h1>
      <p className="text-xl text-surface-600 dark:text-white/80 font-medium leading-relaxed mb-12">
        Client-side utilities to interact with the active tenant context and current session.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-black mb-4 text-surface-950 dark:text-white">useTenant()</h2>
        <p className="text-surface-600 dark:text-white/60 mb-4">
          Retrieve the currently active tenant object. Throws an error if used outside a multi-tenant route.
        </p>
        <div className="p-6 rounded-2xl bg-surface-950 text-white font-mono text-sm border border-surface-200 dark:border-white/10 overflow-x-auto mb-8">
          <pre><code>{`'use client'
import { useTenant } from '@odyssey/react'

export function DashboardHeader() {
  const { tenant, isLoading } = useTenant()
  
  if (isLoading) return <Loading />
  
  return <h1>Workspace: {tenant.name}</h1>
}`}</code></pre>
        </div>

        <h2 className="text-2xl font-black mb-4 text-surface-950 dark:text-white">useWorkspaceMembers()</h2>
        <p className="text-surface-600 dark:text-white/60 mb-4">
          Fetch and manage members within the current tenant context.
        </p>
        <div className="p-6 rounded-2xl bg-surface-950 text-white font-mono text-sm border border-surface-200 dark:border-white/10 overflow-x-auto">
          <pre><code>{`const { members, inviteMember, removeMember } = useWorkspaceMembers()

// Invite user
await inviteMember({ email: 'new@example.com', role: 'admin' })`}</code></pre>
        </div>
      </section>

      <div className="mt-16 pt-8 border-t border-surface-200 dark:border-white/10 flex justify-between">
        <Link href="/docs/middleware" className="inline-flex items-center gap-2 text-surface-500 dark:text-white/40 hover:text-surface-950 dark:hover:text-white font-bold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Previous: Middleware
        </Link>
        <Link href="/docs/api-keys" className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-500 font-bold hover:underline">
          Next: API Keys <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </>
  )
}
