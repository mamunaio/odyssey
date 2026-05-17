'use client'
import { useState, useCallback } from 'react'
import { Check, Zap, CreditCard, ShieldCheck, HelpCircle, Volume2, AlertTriangle, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import useSWR from 'swr'
import toast from 'react-hot-toast'

type PlanType = 'starter' | 'pro' | 'enterprise'

const TIER_RANK = { starter: 1, pro: 2, enterprise: 3 }

const PLAN_LIMITS = {
  starter: { members: 5, projects: 3, storage: '5GB' },
  pro: { members: 25, projects: 20, storage: '50GB' },
  enterprise: { members: -1, projects: -1, storage: 'Unlimited' },
}

const PLAN_PRICES = {
  starter: { monthly: 29 },
  pro: { monthly: 79 },
  enterprise: { monthly: 249 },
}

const plans: { key: PlanType; name: string; desc: string }[] = [
  { key: 'starter',    name: 'Starter',    desc: 'Perfect for small teams' },
  { key: 'pro',        name: 'Pro',        desc: 'Growing teams & businesses' },
  { key: 'enterprise', name: 'Enterprise', desc: 'Large-scale organizations' },
]

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(d => d.data)

export default function BillingPage() {
  const { data: tenant, mutate } = useSWR('/api/tenant', fetcher)
  const router = useRouter()
  const [showDowngradeModal, setShowDowngradeModal] = useState<PlanType | null>(null)
  const [processing, setProcessing] = useState(false)

  const playSynthesizedSound = useCallback((type: 'success' | 'alert') => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        if (type === 'success') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.start(); osc.stop(ctx.currentTime + 0.3);
        } else {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(200, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
            osc.start(); osc.stop(ctx.currentTime + 0.2);
        }
    } catch (e) {}
  }, [])

  async function handlePlanAction(selectedPlan: PlanType) {
    if (!tenant) return

    const currentRank = TIER_RANK[tenant.plan as PlanType] || 0
    const targetRank  = TIER_RANK[selectedPlan]

    if (targetRank < currentRank) {
      // Downgrade detected - show confirmation
      playSynthesizedSound('alert')
      setShowDowngradeModal(selectedPlan)
    } else {
      // Upgrade detected - redirect to checkout
      router.push(`/dashboard/billing/checkout?plan=${selectedPlan}`)
    }
  }

  async function confirmDowngrade() {
    if (!showDowngradeModal) return
    setProcessing(true)

    try {
      const res = await fetch('/api/tenant', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: showDowngradeModal })
      })
      const data = await res.json()

      if (data.success) {
        playSynthesizedSound('success')
        toast.success(`Plan downgraded to ${showDowngradeModal.toUpperCase()}`)
        mutate()
        setShowDowngradeModal(null)
      } else {
        throw new Error()
      }
    } catch (err) {
      toast.error('Failed to update plan')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tightest text-white mb-2">Billing & Plans</h1>
          <p className="text-white/40 text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5" /> Managed by Odyssey Finance
          </p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-brand-600/10 border border-brand-600/20">
           <Volume2 className="w-4 h-4 text-brand-500" />
           <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">Active plan:</span>
           <span className="text-xs font-black uppercase tracking-widest text-white">{tenant?.plan || 'Loading...'}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map(({ key, name, desc }) => {
          const isCurrent = tenant?.plan === key
          const limits    = PLAN_LIMITS[key]
          const prices    = PLAN_PRICES[key]
          const isDowngrade = tenant && TIER_RANK[key] < TIER_RANK[tenant.plan as PlanType]

          return (
            <div 
              key={key} 
              className={cn(
                "p-1 rounded-[3rem] transition-all duration-500 group relative",
                isCurrent ? "bg-brand-600 shadow-[0_0_80px_-20px_rgba(139,92,246,0.3)]" : "bg-white/5 border border-white/10 hover:border-brand-600/50"
              )}
            >
              <div className={cn(
                "rounded-[2.8rem] p-10 h-full flex flex-col relative overflow-hidden",
                isCurrent ? "bg-brand-600" : "bg-surface-900/40"
              )}>
                {isCurrent && (
                  <div className="absolute top-8 right-8">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                )}
                
                <h3 className="text-2xl font-black mb-1 text-white">{name}</h3>
                <p className={cn(
                  "text-xs font-bold uppercase tracking-widest mb-10",
                  isCurrent ? "text-white/70" : "text-white/30"
                )}>{desc}</p>

                <div className="flex items-baseline gap-1 mb-12">
                  <span className="text-5xl font-black text-white tracking-tightest">${prices.monthly}</span>
                  <span className={cn(
                    "text-sm font-bold uppercase tracking-widest",
                    isCurrent ? "text-white/60" : "text-white/20"
                  )}>/mo</span>
                </div>

                <ul className="space-y-5 mb-14 flex-1">
                  {[
                    { l: `${limits.members === -1 ? 'Unlimited' : limits.members} members` },
                    { l: `${limits.projects === -1 ? 'Unlimited' : limits.projects} projects` },
                    { l: `${limits.storage} high-speed storage` },
                    { l: 'Advanced RLS security' },
                    { l: 'Priority email support' },
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                        isCurrent ? "bg-white/20" : "bg-brand-600/10 border border-brand-600/20"
                      )}>
                        <Check className={cn(
                          "w-3 h-3",
                          isCurrent ? "text-white" : "text-brand-500"
                        )} />
                      </div>
                      <span className={cn(
                        "text-sm font-bold",
                        isCurrent ? "text-white" : "text-white/60"
                      )}>{item.l}</span>
                    </li>
                  ))}
                </ul>

                {!isCurrent ? (
                  <button 
                    onClick={() => handlePlanAction(key)}
                    className={cn(
                      "w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3",
                      isDowngrade ? "bg-white/10 border border-white/20 text-white hover:bg-white/20" : "bg-white text-surface-950 hover:bg-brand-600 hover:text-white"
                    )}
                  >
                    {isDowngrade ? 'Downgrade Plan' : 'Upgrade Workspace'}
                  </button>
                ) : (
                  <div className="w-full py-5 rounded-2xl bg-white/20 border border-white/20 text-white font-black text-xs uppercase tracking-widest text-center">
                    Current active plan
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Downgrade Confirmation Modal */}
      <AnimatePresence>
        {showDowngradeModal && (
          <div 
            className="fixed inset-0 bg-surface-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 cursor-pointer"
            onClick={() => !processing && setShowDowngradeModal(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded-[3rem] bg-amber-500/10 border border-amber-500/20 shadow-2xl w-full max-w-lg cursor-default"
            >
              <div className="bg-surface-900 rounded-[2.8rem] p-10 md:p-12">
                <div className="text-center mb-10">
                   <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
                      <AlertTriangle className="w-8 h-8 text-amber-500" />
                   </div>
                   <h2 className="text-3xl font-black text-white mb-2">Are you sure?</h2>
                   <p className="text-white/40 text-sm font-bold leading-relaxed">
                      You are about to downgrade to the <span className="text-white">{showDowngradeModal.toUpperCase()}</span> plan. 
                      You will lose access to premium features and your workspace limits will be reduced immediately.
                   </p>
                </div>

                <div className="flex gap-4">
                   <button 
                     onClick={() => setShowDowngradeModal(null)}
                     disabled={processing}
                     className="flex-1 py-5 rounded-2xl border-2 border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                   >
                      Keep Current
                   </button>
                   <button 
                     onClick={confirmDowngrade}
                     disabled={processing}
                     className="flex-1 bg-amber-500 text-surface-950 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3"
                   >
                      {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Downgrade'}
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
