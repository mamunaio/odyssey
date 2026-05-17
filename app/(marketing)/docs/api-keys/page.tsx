import Link from 'next/link'
import { ArrowLeft, Key } from 'lucide-react'

export default function ApiKeysPage() {
  return (
    <>
      <h1 className="text-5xl font-black mb-8 text-surface-950 dark:text-white">API Keys</h1>
      <p className="text-xl text-surface-600 dark:text-white/80 font-medium leading-relaxed mb-12">
        Manage programmable access to your tenant boundaries using secure, rolling API keys.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-black mb-4 text-surface-950 dark:text-white">Generating Keys</h2>
        <p className="text-surface-600 dark:text-white/60 mb-6 leading-relaxed">
          API keys are scoped directly to a single tenant. Even if an API key is leaked, it cannot be used to access data from another tenant. You can generate API keys directly from the Workspace Settings dashboard under the Security tab.
        </p>

        <div className="p-8 rounded-3xl bg-surface-50 dark:bg-white/5 border border-surface-200 dark:border-white/10 mb-8">
          <h3 className="text-xl font-black mb-4 flex items-center gap-2 text-surface-950 dark:text-white">
            <Key className="w-5 h-5 text-brand-600 dark:text-brand-500" /> Usage Example
          </h3>
          <p className="text-surface-600 dark:text-white/70 mb-4">
            To authenticate requests to the Odyssey API, pass the key via the Authorization header using the Bearer scheme.
          </p>
          <div className="p-6 rounded-2xl bg-surface-950 text-white font-mono text-sm overflow-x-auto border border-surface-200 dark:border-white/10">
            <pre><code>{`curl -X GET https://api.odyssey.app/v1/members \\
  -H "Authorization: Bearer ody_live_xxxxxxxxxxxxx"`}</code></pre>
          </div>
        </div>
      </section>

      <div className="mt-16 pt-8 border-t border-surface-200 dark:border-white/10 flex justify-start">
        <Link href="/docs/hooks" className="inline-flex items-center gap-2 text-surface-500 dark:text-white/40 hover:text-surface-950 dark:hover:text-white font-bold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Previous: Hooks
        </Link>
      </div>
    </>
  )
}
