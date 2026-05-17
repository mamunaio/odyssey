'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BarChart3, TrendingUp, Users, Zap, Activity, Globe, ArrowUpRight, ArrowDownRight, Server, Database, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

const kpis = [
  { label: 'Total API Requests', value: '14.2M', trend: '+24.5%', isUp: true },
  { label: 'Data Transfer', value: '4.8 TB', trend: '+12.3%', isUp: true },
  { label: 'Active Workspaces', value: '1,204', trend: '+8.1%', isUp: true },
  { label: 'P99 Latency', value: '42ms', trend: '-1.5%', isUp: false }, // Down is good here
]

// Mock data for a 30-day chart
const chartData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 60) + 20)

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tightest text-white mb-2">Analytics</h1>
          <p className="text-white/40 text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" /> Real-time workspace intelligence
          </p>
        </div>
        <div className="flex gap-4">
           <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 shadow-xl">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Live Stream Active</span>
           </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="p-8 rounded-[2rem] bg-surface-900 border border-white/10 flex flex-col justify-between group hover:border-brand-600/50 transition-colors shadow-xl"
          >
             <div className="flex justify-between items-start mb-6">
               <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{kpi.label}</span>
               <div className={cn(
                 "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-md",
                 kpi.label === 'P99 Latency' 
                   ? (kpi.isUp ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500") 
                   : (kpi.isUp ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500")
               )}>
                 {kpi.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                 {kpi.trend}
               </div>
             </div>
             <div className="text-4xl font-black text-white tracking-tight">{kpi.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Main Chart Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-1 rounded-[3rem] bg-white/5 border border-white/10 shadow-2xl"
      >
        <div className="bg-surface-900/60 rounded-[2.8rem] p-10 h-[500px] flex flex-col">
           <div className="flex justify-between items-end mb-12">
             <div>
                <h3 className="text-2xl font-black text-white mb-2">Network Traffic</h3>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Global API requests over 30 days</p>
             </div>
             <div className="flex gap-2">
                {['24H', '7D', '30D', '1Y'].map((t, i) => (
                  <button key={i} className={cn(
                    "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                    t === '30D' ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20" : "text-white/40 hover:bg-white/5 hover:text-white"
                  )}>
                    {t}
                  </button>
                ))}
             </div>
           </div>
           
           <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2 pt-10 border-b border-white/10 relative">
              {/* Y-Axis lines */}
              <div className="absolute inset-x-0 bottom-[33%] border-t border-dashed border-white/5 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-[66%] border-t border-dashed border-white/5 pointer-events-none" />
              <div className="absolute inset-x-0 bottom-[100%] border-t border-dashed border-white/5 pointer-events-none" />
              
              {mounted && chartData.map((val, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ duration: 1, delay: i * 0.02, ease: "easeOut" }}
                  className="w-full bg-brand-600/40 hover:bg-brand-500 rounded-t-md relative group cursor-crosshair transition-colors"
                >
                   {/* Tooltip */}
                   <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-950 border border-white/10 px-3 py-2 rounded-lg pointer-events-none z-10 shadow-2xl flex flex-col items-center">
                     <span className="text-[10px] font-black text-white">{Math.floor(val * 1234)}</span>
                     <span className="text-[8px] font-black text-brand-500 uppercase">Requests</span>
                   </div>
                </motion.div>
              ))}
           </div>
           <div className="flex justify-between items-center mt-4 text-[9px] font-black text-white/30 uppercase tracking-widest">
              <span>Nov 1</span>
              <span>Nov 15</span>
              <span>Nov 30</span>
           </div>
        </div>
      </motion.div>

      {/* Bottom Grid: Top Workspaces & System Health */}
      <div className="grid lg:grid-cols-3 gap-8">
         {/* Top Workspaces Table */}
         <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.6 }}
           className="lg:col-span-2 p-10 rounded-[2.5rem] bg-surface-900 border border-white/10 shadow-2xl flex flex-col"
         >
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-black text-white">Top Workspaces</h3>
               <button className="text-[10px] font-black text-brand-500 uppercase tracking-widest hover:text-brand-400">View All</button>
            </div>
            
            <div className="flex-1 flex flex-col gap-4">
               {[
                 { n: 'Acme Corp', id: 'ws_8h2j', u: '1.2M', c: 'bg-blue-500' },
                 { n: 'Globex Inc', id: 'ws_9k4l', u: '850K', c: 'bg-purple-500' },
                 { n: 'Soylent Ltd', id: 'ws_1m9p', u: '420K', c: 'bg-green-500' },
                 { n: 'Initech', id: 'ws_5b7n', u: '310K', c: 'bg-orange-500' }
               ].map((ws, i) => (
                 <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg", ws.c)}>
                         {ws.n.charAt(0)}
                       </div>
                       <div>
                         <p className="text-sm font-black text-white mb-0.5">{ws.n}</p>
                         <p className="text-[10px] font-mono text-white/40">{ws.id}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-white mb-0.5">{ws.u}</p>
                       <p className="text-[9px] font-black uppercase tracking-widest text-brand-500">Reqs / mo</p>
                    </div>
                 </div>
               ))}
            </div>
         </motion.div>

         {/* System Health */}
         <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.8 }}
           className="p-10 rounded-[2.5rem] bg-surface-900 border border-white/10 shadow-2xl flex flex-col"
         >
            <h3 className="text-xl font-black text-white mb-8">System Health</h3>
            
            <div className="space-y-6 flex-1">
               {[
                 { l: 'Database Cluster', s: 'Operational', i: Database },
                 { l: 'Edge Network', s: 'Operational', i: Globe },
                 { l: 'Background Jobs', s: 'Operational', i: Server },
                 { l: 'API Gateway', s: 'Operational', i: Activity }
               ].map((sys, i) => (
                 <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                       <sys.i className="w-4 h-4 text-white/60" />
                    </div>
                    <div className="flex-1">
                       <p className="text-sm font-black text-white mb-1">{sys.l}</p>
                       <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-green-500">{sys.s}</span>
                       </div>
                    </div>
                 </div>
               ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
               <Clock className="w-4 h-4 text-white/40" />
               <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Last updated: Just now</span>
            </div>
         </motion.div>
      </div>

      {/* Enterprise Analytics CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="p-1 rounded-[3rem] bg-gradient-to-r from-brand-600 to-violet-600 shadow-2xl mt-10"
      >
        <div className="bg-surface-950/40 backdrop-blur-3xl rounded-[2.8rem] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
          <Zap className="absolute -right-20 -top-20 w-96 h-96 text-white/5 rotate-12 pointer-events-none" />
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-4xl font-black text-white mb-6 tracking-tight">Advanced Intelligence</h2>
            <p className="text-lg font-bold text-white/70 leading-relaxed mb-10">
              Unlock cross-tenant comparisons, automated anomaly detection, and custom SQL reporting with Odyssey Enterprise.
            </p>
            <Link href="/dashboard/billing/checkout?plan=enterprise" className="inline-block bg-white text-surface-950 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-600 hover:text-white hover:scale-105 active:scale-95 transition-all shadow-2xl hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] group">
               Upgrade to Enterprise <ArrowUpRight className="inline-block w-4 h-4 ml-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="relative z-10 grid grid-cols-2 gap-4">
             {[
               { icon: Globe, label: 'Geo Analysis' },
               { icon: Activity, label: 'Health API' },
               { icon: BarChart3, label: 'Custom ETL' },
               { icon: Zap, label: 'Real-time' }
             ].map((box, i) => (
               <div key={i} className="p-6 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center gap-3 w-32 h-32 hover:bg-white/20 transition-colors cursor-pointer group">
                  <box.icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{box.label}</span>
               </div>
             ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
