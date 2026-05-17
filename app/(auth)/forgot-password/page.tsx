'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Loader2, Zap, ArrowLeft, Mail } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSent(true)
      toast.success('Reset link sent to your email!')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-surface-950 text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-brand-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-500 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-3 h-3" /> Back to Sign In
          </Link>
          <h1 className="text-3xl font-black mb-2">Reset Password.</h1>
          <p className="text-white font-medium text-sm">We'll send a recovery link to your inbox.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-1 rounded-[2.5rem] bg-white/10 border border-white/20 backdrop-blur-3xl shadow-2xl"
        >
          <div className="bg-surface-900/80 rounded-[2.2rem] p-8 md:p-10 text-center">
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white mb-2">Workspace Email</label>
                  <input 
                    type="email" 
                    className="w-full bg-white/5 border-2 border-white/10 rounded-xl px-5 py-3.5 focus:border-brand-600 focus:outline-none transition-all font-bold placeholder:text-white/20" 
                    placeholder="name@company.com"
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-white text-surface-950 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-600 hover:text-white transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Send Recovery Link'}
                </button>
              </form>
            ) : (
              <div className="py-10">
                <div className="w-16 h-16 bg-brand-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-brand-600" />
                </div>
                <h3 className="text-xl font-black mb-4">Check your inbox.</h3>
                <p className="text-white font-medium text-sm mb-8 leading-relaxed">
                  We've sent password reset instructions to <br /> <span className="text-brand-500 font-bold">{email}</span>
                </p>
                <button 
                  onClick={() => setSent(false)}
                  className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors underline"
                >
                  Didn't receive it? Try again
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
