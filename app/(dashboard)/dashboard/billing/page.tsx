'use client'
import { useState, useCallback, useEffect } from 'react'
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
  const [processingPortal, setProcessingPortal] = useState(false)

  // Handlers for development/demo simulated Stripe parameters
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('simulated_success') === 'true') {
      const planName = params.get('plan') || 'PRO'
      toast.success(`[DEMO MODE] Workspace upgraded to ${planName.toUpperCase()} successfully!`, {
        duration: 5000,
        icon: '🚀'
      })
      mutate() // Trigger local SWR cache revalidation
      router.replace('/dashboard/billing')
    } else if (params.get('simulated_portal') === 'true') {
      toast.success(`[DEMO MODE] Stripe Portal loaded! In production, users manage receipts and payment methods here.`, {
        duration: 7000,
        icon: '💳'
      })
      router.replace('/dashboard/billing')
    }
  }, [router, mutate])

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
      // Upgrade/New Checkout detected - invoke Stripe Checkout API
      setProcessing(true)
      playSynthesizedSound('success')
      try {
        const res = await fetch('/api/billing/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: selectedPlan })
        })
        const data = await res.json()
        if (data.success && data.url) {
          window.location.href = data.url
        } else {
          throw new Error(data.error || 'Failed to initiate checkout')
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to redirect to payment gateway')
        setProcessing(false)
      }
    }
  }

  async function handleManageBilling() {
    setProcessingPortal(true)
    playSynthesizedSound('success')
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' })
      const data = await res.json()
      if (data.success && data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to open billing portal')
      }
    } catch (err: any) {
      toast.error(err.message || 'Billing portal is currently unavailable')
      setProcessingPortal(false)
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
          <h1 className="text-4xl font-black tracking-tightest text-surface-950 dark:text-white mb-2">Billing & Plans</h1>
          <p className="text-surface-400 dark:text-white/40 text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <CreditCard className="w-3.5 h-3.5" /> Managed by Odyssey Finance
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-brand-600/10 border border-brand-600/20">
             <Volume2 className="w-4 h-4 text-brand-500" />
             <span className="text-[10px] font-black uppercase tracking-widest text-brand-500">Active plan:</span>
             <span className="text-xs font-black uppercase tracking-widest text-surface-950 dark:text-white">{tenant?.plan || 'Loading...'}</span>
          </div>
          {tenant?.stripeCustomerId && (
            <button
              onClick={handleManageBilling}
              disabled={processingPortal || processing}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white dark:bg-white/5 border border-surface-200 dark:border-white/10 hover:border-surface-300 dark:hover:border-white/20 hover:bg-surface-50 dark:hover:bg-white/10 text-surface-700 dark:text-white font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-sm hover:shadow disabled:opacity-50"
            >
              {processingPortal ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CreditCard className="w-3.5 h-3.5 text-brand-500" />
              )}
              Manage Billing & Receipts
            </button>
          )}
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
                isCurrent 
                  ? "bg-brand-600 shadow-[0_20px_50px_rgba(139,92,246,0.25)]" 
                  : "bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] dark:shadow-none hover:border-brand-600/50 hover:bg-brand-600/10 transition-all duration-300"
              )}
            >
              <div className={cn(
                "rounded-[2.8rem] p-10 h-full flex flex-col relative overflow-hidden",
                isCurrent ? "bg-brand-600" : "bg-white dark:bg-surface-900/40"
              )}>
                {isCurrent && (
                  <div className="absolute top-8 right-8">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                )}
                
                <h3 className={cn(
                  "text-2xl font-black mb-1",
                  isCurrent ? "text-white" : "text-surface-950 dark:text-white"
                )}>{name}</h3>
                <p className={cn(
                  "text-xs font-bold uppercase tracking-widest mb-10",
                  isCurrent ? "text-white/70" : "text-surface-400 dark:text-white/30"
                )}>{desc}</p>

                <div className="flex items-baseline gap-1 mb-12">
                  <span className={cn(
                    "text-5xl font-black tracking-tightest",
                    isCurrent ? "text-white" : "text-surface-950 dark:text-white"
                  )}>${prices.monthly}</span>
                  <span className={cn(
                    "text-sm font-bold uppercase tracking-widest",
                    isCurrent ? "text-white/60" : "text-surface-400 dark:text-white/20"
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
                        isCurrent ? "text-white" : "text-surface-700 dark:text-white/60"
                      )}>{item.l}</span>
                    </li>
                  ))}
                </ul>

                {!isCurrent ? (
                  <button 
                    onClick={() => handlePlanAction(key)}
                    disabled={processing}
                    className={cn(
                      "w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-3 cursor-pointer",
                      isDowngrade 
                        ? "bg-surface-100 dark:bg-white/10 border border-surface-200 dark:border-white/20 text-surface-700 dark:text-white hover:bg-surface-200 dark:hover:bg-white/20" 
                        : "bg-surface-950 dark:bg-white text-white dark:text-surface-950 hover:bg-brand-600 dark:hover:bg-brand-600 hover:text-white dark:hover:text-white hover:shadow-brand transition-all border border-surface-200 dark:border-none",
                      processing && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {processing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isDowngrade ? (
                      'Downgrade Plan'
                    ) : (
                      'Upgrade Workspace'
                    )}
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
              <div className="bg-white dark:bg-surface-900 rounded-[2.8rem] p-10 md:p-12 shadow-2xl border border-surface-200 dark:border-none">
                <div className="text-center mb-10">
                   <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-6">
                      <AlertTriangle className="w-8 h-8 text-amber-500" />
                   </div>
                   <h2 className="text-3xl font-black text-surface-950 dark:text-white mb-2">Are you sure?</h2>
                   <p className="text-surface-500 dark:text-white/40 text-sm font-bold leading-relaxed">
                      You are about to downgrade to the <span className="text-surface-950 dark:text-white font-extrabold">{showDowngradeModal.toUpperCase()}</span> plan. 
                      You will lose access to premium features and your workspace limits will be reduced immediately.
                   </p>
                </div>

                <div className="flex gap-4">
                   <button 
                     onClick={() => setShowDowngradeModal(null)}
                     disabled={processing}
                     className="flex-1 py-5 rounded-2xl border-2 border-surface-200 dark:border-white/10 text-surface-650 dark:text-white font-black text-xs uppercase tracking-widest hover:bg-surface-50 dark:hover:bg-white/5 transition-all cursor-pointer"
                   >
                      Keep Current
                   </button>
                   <button 
                     onClick={confirmDowngrade}
                     disabled={processing}
                     className="flex-1 bg-amber-500 text-surface-950 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 cursor-pointer"
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
