import Link from 'next/link'
import { Layers, ArrowRight, ArrowLeft } from 'lucide-react'

export default function ArchitecturePage() {
  return (
    <>
      <h1 className="text-5xl font-black mb-8 text-surface-950 dark:text-white">Architecture</h1>
      <p className="text-xl text-surface-600 dark:text-white/80 font-medium leading-relaxed mb-12">
        Understand how Odyssey isolates data, handles multi-region edge routing, and secures tenant boundaries.
      </p>

      <div className="p-8 rounded-3xl bg-surface-50 dark:bg-white/5 border border-surface-200 dark:border-white/10 mb-12">
        <h3 className="text-xl font-black mb-6 flex items-center gap-3 text-surface-950 dark:text-white">
          <Layers className="w-6 h-6 text-brand-600 dark:text-brand-500" /> System Overview
        </h3>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-bold text-surface-950 dark:text-white mb-2">Edge Routing</h4>
            <p className="text-sm text-surface-600 dark:text-white/60 leading-relaxed">
              Every incoming request is intercepted by Odyssey's globally distributed Edge Middleware. It performs instant DNS lookups, resolves the target tenant based on subdomain or custom domain, and injects the `X-Tenant-ID` header before passing the request to your application layer.
            </p>
          </div>
          
          <div className="h-px w-full bg-surface-200 dark:bg-white/10" />

          <div>
            <h4 className="font-bold text-surface-950 dark:text-white mb-2">Database Isolation (RLS)</h4>
            <p className="text-sm text-surface-600 dark:text-white/60 leading-relaxed">
              We enforce multi-tenancy at the database level using PostgreSQL Row-Level Security (RLS). Your application assumes a temporary database role scoped exclusively to the `X-Tenant-ID`. It is physically impossible for queries to leak data between tenants, even if application logic fails.
            </p>
          </div>

          <div className="h-px w-full bg-surface-200 dark:bg-white/10" />

          <div>
            <h4 className="font-bold text-surface-950 dark:text-white mb-2">Authentication</h4>
            <p className="text-sm text-surface-600 dark:text-white/60 leading-relaxed">
              Sessions are tied to both the user and the specific tenant. A user can belong to multiple workspaces, but authentication tokens are explicitly minted for the active tenant context.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 pt-8 border-t border-surface-200 dark:border-white/10 flex justify-between">
        <Link href="/docs/quickstart" className="inline-flex items-center gap-2 text-surface-500 dark:text-white/40 hover:text-surface-950 dark:hover:text-white font-bold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Previous: Quickstart
        </Link>
        <Link href="/docs/middleware" className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-500 font-bold hover:underline">
          Next: Middleware <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </>
  )
}
