'use client'
import { Zap } from 'lucide-react'
import toast from 'react-hot-toast'

interface DashboardHeaderProps {
  userName: string
  plan: string
}

export default function DashboardHeader({ userName, plan }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
      <div>
        <h1 className="text-5xl font-black tracking-tightest text-white mb-3">Overview</h1>
        <div className="flex items-center gap-4">
          <p className="text-white font-bold text-lg">
            Welcome back, <span className="text-brand-500 uppercase tracking-widest">{userName}</span>
          </p>
          <span className="h-4 w-px bg-white/10" />
          <div className="bg-brand-600/10 border border-brand-600/30 px-4 py-1.5 rounded-full flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-brand-500 fill-brand-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-500">
              {plan} Plan
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button 
          onClick={() => toast.success('Telemetry data export initiated')}
          className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all text-white"
        >
          Export Data
        </button>
        <button 
          onClick={() => toast.error('Workspace creation restricted to Admin')}
          className="px-8 py-4 rounded-2xl bg-white text-surface-950 text-xs font-black uppercase tracking-widest hover:bg-brand-600 hover:text-white transition-all shadow-2xl shadow-white/5"
        >
          Create Project
        </button>
      </div>
    </div>
  )
}
