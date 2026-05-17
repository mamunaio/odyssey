'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const links = [
    { title: 'Introduction', href: '/docs' },
    { title: 'Quickstart', href: '/docs/quickstart' },
    { title: 'Architecture', href: '/docs/architecture' },
  ]

  const sdkLinks = [
    { title: 'Middleware', href: '/docs/middleware' },
    { title: 'Hooks', href: '/docs/hooks' },
    { title: 'API Keys', href: '/docs/api-keys' },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 text-surface-950 dark:text-white font-sans flex flex-col md:flex-row transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-surface-200 dark:border-white/10 p-8 space-y-8 shrink-0 bg-surface-50 dark:bg-surface-900/20">
        <Link href="/" className="flex items-center gap-2 mb-10 font-black text-xl tracking-tighter hover:opacity-80 transition-opacity">
          <Zap className="w-5 h-5 fill-surface-950 dark:fill-white text-surface-950 dark:text-white" /> Odyssey Docs
        </Link>
        
        <div>
          <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-500 mb-4">Getting Started</h5>
          <ul className="space-y-3 text-sm font-bold">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className={cn(
                      "transition-colors",
                      isActive ? "text-brand-600 dark:text-brand-400" : "text-surface-500 dark:text-white/40 hover:text-surface-950 dark:hover:text-white"
                    )}
                  >
                    {link.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-500 mb-4">SDK Reference</h5>
          <ul className="space-y-3 text-sm font-bold">
            {sdkLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className={cn(
                      "transition-colors",
                      isActive ? "text-brand-600 dark:text-brand-400" : "text-surface-500 dark:text-white/40 hover:text-surface-950 dark:hover:text-white"
                    )}
                  >
                    {link.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-24 overflow-y-auto">
        <div className="max-w-3xl">
          {children}
        </div>
      </main>
    </div>
  )
}
