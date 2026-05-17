'use client'
import { useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CreditCard, ShieldCheck, Zap, ArrowLeft, Loader2, Lock, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const PLAN_PRICES = {
  starter: 29,
  pro: 79,
  enterprise: 249,
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const plan = searchParams.get('plan') || 'pro'
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)

  const playSynthesizedSound = useCallback((type: 'success' | 'process') => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'success') {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc.type = 'sine'; osc2.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime);
            osc2.frequency.setValueAtTime(659.25, ctx.currentTime);
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            gain2.gain.setValueAtTime(0, ctx.currentTime);
            gain2.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
            gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            osc2.connect(gain2); gain2.connect(ctx.destination);
            osc.start(); osc2.start();
            osc.stop(ctx.currentTime + 0.4); osc2.stop(ctx.currentTime + 0.4);
        } else {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.start(); osc.stop(ctx.currentTime + 0.1);
        }
    } catch (e) {}
  }, [])

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault()
    setProcessing(true)
    playSynthesizedSound('process')

    try {
      const res = await fetch('/api/tenant', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      })
      const data = await res.json()

      if (data.success) {
        setTimeout(() => {
          setSuccess(true)
          playSynthesizedSound('success')
          toast.success('Payment authorized successfully')
          setTimeout(() => router.push('/dashboard/billing'), 3000)
        }, 2000)
      } else {
        throw new Error()
      }
    } catch (err) {
      toast.error('Card declined. Please try another.')
      setProcessing(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8">
          <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_-10px_rgba(34,197,94,0.3)]">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-4xl font-black text-white">Payment Confirmed!</h1>
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Upgrading your workspace to {plan.toUpperCase()}...</p>
          <div className="flex items-center justify-center gap-2 text-brand-500 font-black text-[10px] uppercase tracking-widest animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" /> Redirecting to dashboard
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <button onClick={() => router.back()} className="flex items-center gap-3 text-white/40 hover:text-white transition-all group">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">Back to Plans</span>
      </button>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-10">
          <div>
            <h1 className="text-5xl font-black text-white mb-4">Complete Payment</h1>
            <p className="text-white/40 text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-500" /> Secure 256-bit Encrypted Checkout
            </p>
          </div>

          <form onSubmit={handlePayment} className="space-y-8">
             <div className="space-y-6">
                <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Cardholder Name</label>
                   <input type="text" required placeholder="John Odyssey" className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-black placeholder:text-white/10 outline-none focus:border-brand-600 transition-all" />
                </div>
                <div>
                   <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Card Details</label>
                   <div className="relative mb-4">
                      <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                      <input type="text" required placeholder="4242 4242 4242 4242" className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 pl-14 text-white font-black placeholder:text-white/10 outline-none focus:border-brand-600 transition-all" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="MM/YY" className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-black placeholder:text-white/10 outline-none focus:border-brand-600 transition-all" />
                      <input type="text" placeholder="CVC" className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 text-white font-black placeholder:text-white/10 outline-none focus:border-brand-600 transition-all" />
                   </div>
                </div>
             </div>

             <button type="submit" disabled={processing} className="w-full bg-white text-surface-950 py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-600 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50">
               {processing ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying Payment...</> : <><Lock className="w-5 h-5" /> Pay ${PLAN_PRICES[plan as keyof typeof PLAN_PRICES] || 0}.00 Now</>}
             </button>
          </form>
        </div>

        <div className="p-1 rounded-[3rem] bg-white/5 border border-white/10 shadow-2xl sticky top-8">
           <div className="bg-surface-900/40 rounded-[2.8rem] p-10 space-y-10">
              <h3 className="text-xl font-black text-white">Order Summary</h3>
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <div>
                       <p className="text-white font-black text-sm uppercase tracking-widest">{plan} Plan</p>
                       <p className="text-white/30 text-[10px] font-bold">Monthly subscription</p>
                    </div>
                    <span className="text-white font-black">${PLAN_PRICES[plan as keyof typeof PLAN_PRICES] || 0}.00</span>
                 </div>
                 <div className="h-px bg-white/5" />
                 <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-black text-white uppercase tracking-tightest">Total Due</span>
                    <span className="text-3xl font-black text-brand-500">${PLAN_PRICES[plan as keyof typeof PLAN_PRICES] || 0}.00</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest text-white/20">Initialising secure session...</p>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
