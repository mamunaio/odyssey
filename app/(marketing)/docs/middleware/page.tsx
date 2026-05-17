import Link from 'next/link'
import { ArrowRight, ArrowLeft, Code } from 'lucide-react'

export default function MiddlewarePage() {
  return (
    <>
      <h1 className="text-5xl font-black mb-8 text-surface-950 dark:text-white">Middleware SDK</h1>
      <p className="text-xl text-surface-600 dark:text-white/80 font-medium leading-relaxed mb-12">
        Intercept and process multi-tenant requests at the edge before they hit your application.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-black mb-4 text-surface-950 dark:text-white">Basic Usage</h2>
        <p className="text-surface-600 dark:text-white/60 mb-4">
          Wrap your Next.js middleware with `withOdyssey` to automatically handle subdomain resolution and domain mapping.
        </p>
        <div className="p-6 rounded-2xl bg-surface-950 text-white font-mono text-sm border border-surface-200 dark:border-white/10 overflow-x-auto">
          <pre><code>{`import { withOdyssey } from '@odyssey/nextjs'

export default withOdyssey({
  // Enforce auth on all dashboard routes
  protectedRoutes: ['/dashboard/:path*'],
  
  // Custom logic after tenant resolution
  afterResolution: async (request, tenant) => {
    // Custom edge logic here
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}`}</code></pre>
        </div>
      </section>

      <div className="mt-16 pt-8 border-t border-surface-200 dark:border-white/10 flex justify-between">
        <Link href="/docs/architecture" className="inline-flex items-center gap-2 text-surface-500 dark:text-white/40 hover:text-surface-950 dark:hover:text-white font-bold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Previous: Architecture
        </Link>
        <Link href="/docs/hooks" className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-500 font-bold hover:underline">
          Next: Hooks <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </>
  )
}
