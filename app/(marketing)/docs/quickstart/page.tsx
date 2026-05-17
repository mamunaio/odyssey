import Link from 'next/link'
import { Terminal, ArrowRight } from 'lucide-react'

export default function QuickstartPage() {
  return (
    <>
      <h1 className="text-5xl font-black mb-8 text-surface-950 dark:text-white">Quickstart</h1>
      <p className="text-xl text-surface-600 dark:text-white/80 font-medium leading-relaxed mb-12">
        Get up and running with Odyssey in under 5 minutes. Learn how to initialize a project, configure your first tenant, and deploy.
      </p>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-black mb-4 text-surface-950 dark:text-white">1. Install the CLI</h2>
          <p className="text-surface-600 dark:text-white/60 mb-4">
            The Odyssey CLI is the fastest way to scaffold your next multi-tenant application.
          </p>
          <div className="p-6 rounded-2xl bg-surface-950 text-white font-mono text-sm flex items-center justify-between border border-surface-200 dark:border-white/10">
            <span>npm install -g @odyssey/cli</span>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-4 text-surface-950 dark:text-white">2. Initialize Project</h2>
          <p className="text-surface-600 dark:text-white/60 mb-4">
            Run the init command to generate a new Next.js project pre-configured with Odyssey middleware and authentication.
          </p>
          <div className="p-6 rounded-2xl bg-surface-950 text-white font-mono text-sm flex items-center justify-between border border-surface-200 dark:border-white/10">
            <span>odyssey init my-saas-app</span>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-black mb-4 text-surface-950 dark:text-white">3. Configure Environment</h2>
          <p className="text-surface-600 dark:text-white/60 mb-4">
            Link your local project to your Odyssey dashboard by authenticating.
          </p>
          <div className="p-6 rounded-2xl bg-surface-950 text-white font-mono text-sm flex items-center justify-between border border-surface-200 dark:border-white/10">
            <span>odyssey login</span>
          </div>
        </section>
      </div>

      <div className="mt-16 pt-8 border-t border-surface-200 dark:border-white/10 flex justify-end">
        <Link href="/docs/architecture" className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-500 font-bold hover:underline">
          Next: Architecture <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </>
  )
}
