import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import connectDB from '@/lib/db/connect'
import { Tenant, User } from '@/lib/models'
import { Users, FolderOpen, CreditCard, TrendingUp, Zap, BarChart3, ArrowUpRight, Activity } from 'lucide-react'
import { cn } from '@/lib/utils'
import DashboardHeader from '@/components/dashboard/DashboardHeader'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  await connectDB()

  const tenantId  = (session!.user as { tenantId: string }).tenantId
  const [tenant, memberCount] = await Promise.all([
    Tenant.findById(tenantId).lean(),
    User.countDocuments({ tenantId, isActive: true }),
  ])

  const stats = [
    { label: 'Total members', value: memberCount, icon: Users,     color: 'text-blue-500 bg-blue-500/10 border-blue-500/20'   },
    { label: 'Active projects', value: 12,          icon: FolderOpen,color: 'text-violet-500 bg-violet-500/10 border-violet-500/20'},
    { label: 'Current plan',  value: (tenant as { plan?: string })?.plan ?? 'starter', icon: CreditCard, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    { label: 'Uptime',        value: '99.9%',      icon: TrendingUp,color: 'text-green-500 bg-green-500/10 border-green-500/20' },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      <DashboardHeader 
        userName={session?.user?.name ?? 'User'} 
        plan={(tenant as { plan?: string })?.plan ?? 'Starter'} 
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-1 rounded-[2.5rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 hover:border-brand-600/50 hover:bg-brand-600/10 transition-all group cursor-default shadow-xl">
            <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] p-8 h-full">
              <div className="flex items-center justify-between mb-10">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg group-hover:scale-110 transition-transform bg-white",
                  color
                )}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500 font-black text-[11px] bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +12.5%
                </div>
              </div>
              <p className="text-5xl font-black text-surface-950 dark:text-white tracking-tightest mb-2 leading-none">{value}</p>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-surface-500 dark:text-white/60">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart Card */}
        <div className="lg:col-span-2 p-1 rounded-[3rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl">
          <div className="bg-white dark:bg-surface-900/60 rounded-[2.8rem] p-10 h-[450px] flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Activity className="w-64 h-64 text-surface-950 dark:text-white" />
             </div>
             
             <div className="mb-10 relative z-10">
               <h3 className="text-3xl font-black text-surface-950 dark:text-white mb-3">Workspace Health</h3>
               <p className="text-[11px] font-black text-brand-600 dark:text-brand-500 uppercase tracking-[0.3em]">Live Infrastructure telemetry</p>
             </div>

             <div className="flex-1 border-2 border-dashed border-surface-200 dark:border-white/5 rounded-[2rem] flex items-center justify-center bg-surface-50 dark:bg-white/[0.01] relative z-10 group overflow-hidden">
                <div className="absolute inset-0 bg-brand-600/5 opacity-0 group-hover:opacity-100 transition-opacity blur-[80px]" />
                <div className="text-center relative z-10">
                   <BarChart3 className="w-12 h-12 text-surface-300 dark:text-white/10 mx-auto mb-6" />
                   <p className="text-sm font-black uppercase tracking-[0.4em] text-surface-400 dark:text-white/30">Streaming Active Segments...</p>
                </div>
             </div>
          </div>
        </div>

        {/* Audit Logs Card */}
        <div className="p-1 rounded-[3rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl">
          <div className="bg-white dark:bg-surface-900/40 rounded-[2.8rem] p-10 h-[450px] flex flex-col">
            <div className="flex items-center justify-between mb-12">
               <h3 className="text-2xl font-black text-surface-950 dark:text-white">Audit Trail</h3>
               <div className="w-8 h-8 rounded-full bg-surface-100 dark:bg-white/5 border border-surface-200 dark:border-white/10 flex items-center justify-center hover:bg-surface-200 dark:hover:bg-white/10 cursor-pointer transition-all">
                  <ArrowUpRight className="w-4 h-4 text-surface-500 dark:text-white/40" />
               </div>
            </div>
            
            <div className="space-y-10 flex-1 overflow-y-auto pr-4 scrollbar-hide">
              {[
                { t: 'New tenant provisioned', d: 'Workspace "DataFlow" is live', h: '2m ago', icon: <Zap className="w-3 h-3" /> },
                { t: 'Billing threshold reached', d: 'Enterprise usage exceeded 80%', h: '1h ago', icon: <Activity className="w-3 h-3" /> },
                { t: 'Member access revoked', d: 'User "Alex" removed from Acme', h: '5h ago', icon: <Users className="w-3 h-3" /> }
              ].map((log, i) => (
                <div key={i} className="flex gap-6 group cursor-pointer relative">
                  <div className="w-1.5 h-full absolute left-4 top-8 bg-surface-200 dark:bg-white/5 rounded-full" />
                  <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-white/5 border border-surface-200 dark:border-white/10 flex items-center justify-center shrink-0 group-hover:bg-brand-600 group-hover:border-brand-600 transition-all shadow-lg">
                    <div className="text-surface-500 dark:text-white/60 group-hover:text-white">{log.icon}</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-surface-950 dark:text-white leading-none mb-2.5 group-hover:text-brand-600 dark:group-hover:text-brand-500 transition-colors">{log.t}</p>
                    <p className="text-xs font-bold text-surface-500 dark:text-white/40 leading-relaxed mb-4">{log.d}</p>
                    <div className="px-3 py-1 rounded-full bg-surface-100 dark:bg-white/5 border border-surface-200 dark:border-white/5 inline-block text-[9px] font-black uppercase tracking-widest text-surface-600 dark:text-white/60">
                       {log.h}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
