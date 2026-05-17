'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, CreditCard, Settings, BarChart3, HelpCircle, Zap, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard',          icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/members',  icon: Users,           label: 'Members'  },
  { href: '/dashboard/billing',  icon: CreditCard,      label: 'Billing'  },
  { href: '/dashboard/analytics',icon: BarChart3,       label: 'Analytics'},
  { href: '/dashboard/settings', icon: Settings,        label: 'Settings' },
]

interface SidebarProps {
  user: { name?: string; email?: string; image?: string; role?: string; tenantId?: string }
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 bg-surface-950 border-r border-white/10 flex flex-col z-40 relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-[200px] bg-brand-600/5 blur-[80px] pointer-events-none" />

      {/* Logo */}
      <div className="h-20 flex items-center px-8 relative z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center transition-transform group-hover:rotate-6">
            <Zap className="w-5 h-5 text-surface-950 fill-surface-950" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">Odyssey</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-8 space-y-1.5 relative z-10">
        <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Main Menu</p>
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all relative overflow-hidden group',
                active ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' : 'text-white/60 hover:bg-white/5 hover:text-white'
              )}>
              <Icon className={cn(
                "w-4 h-4 shrink-0 transition-colors",
                active ? "text-white" : "text-white/40 group-hover:text-white"
              )} />
              {label}
              {active && <ChevronRight className="ml-auto w-3.5 h-3.5 opacity-60" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 mt-auto border-t border-white/10 space-y-1.5 relative z-10">
        <Link href="/dashboard/support" className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white/60 hover:bg-white/5 hover:text-white transition-all">
          <HelpCircle className="w-4 h-4 text-white/40" />
          Support
        </Link>
      </div>
    </aside>
  )
}
