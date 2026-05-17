'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Zap, Globe, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    password: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Something went wrong')
      }

      toast.success('Account created successfully!')
      router.push('/login')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 text-surface-950 dark:text-white font-sans flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-brand-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-violet-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link 
          href="/" 
          className="absolute -top-16 left-0 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-surface-500 dark:text-white/40 hover:text-surface-950 dark:hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Home
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-8 h-8 bg-surface-950 dark:bg-white rounded-lg flex items-center justify-center transition-transform group-hover:rotate-6">
              <Zap className="w-5 h-5 text-white dark:text-surface-950 fill-white dark:fill-surface-950" />
            </div>
            <span className="text-2xl font-black tracking-tighter">Odyssey</span>
          </Link>
          <h1 className="text-3xl font-black mb-2">Build the future.</h1>
          <p className="text-surface-550 dark:text-white/60 font-medium text-sm">Join 2,000+ teams on the infrastructure of choice.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-1 rounded-[2.5rem] bg-surface-100 dark:bg-white/10 border border-surface-200 dark:border-white/20 backdrop-blur-3xl shadow-2xl"
        >
          <div className="bg-white dark:bg-surface-900/80 rounded-[2.2rem] p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-surface-550 dark:text-white/60 mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-surface-50 dark:bg-white/5 border-2 border-surface-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-surface-950 dark:text-white focus:border-brand-600 focus:outline-none transition-all font-bold placeholder:text-surface-400 dark:placeholder:text-white/20" 
                  placeholder="John Doe"
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  required 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-surface-550 dark:text-white/60 mb-2">Work Email</label>
                <input 
                  type="email" 
                  className="w-full bg-surface-50 dark:bg-white/5 border-2 border-surface-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-surface-950 dark:text-white focus:border-brand-600 focus:outline-none transition-all font-bold placeholder:text-surface-400 dark:placeholder:text-white/20" 
                  placeholder="name@company.com"
                  value={formData.email} 
                  onChange={e => setFormData({ ...formData, email: e.target.value })} 
                  required 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-surface-550 dark:text-white/60 mb-2">Workspace Name</label>
                <input 
                  type="text" 
                  className="w-full bg-surface-50 dark:bg-white/5 border-2 border-surface-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-surface-950 dark:text-white focus:border-brand-600 focus:outline-none transition-all font-bold placeholder:text-surface-400 dark:placeholder:text-white/20" 
                  placeholder="e.g. Acme Corp"
                  value={formData.companyName} 
                  onChange={e => setFormData({ ...formData, companyName: e.target.value })} 
                  required 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-surface-550 dark:text-white/60 mb-2">Create Password</label>
                <input 
                  type="password" 
                  className="w-full bg-surface-50 dark:bg-white/5 border-2 border-surface-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-surface-950 dark:text-white focus:border-brand-600 focus:outline-none transition-all font-bold placeholder:text-surface-400 dark:placeholder:text-white/20" 
                  placeholder="••••••••" 
                  value={formData.password} 
                  onChange={e => setFormData({ ...formData, password: e.target.value })} 
                  required 
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-600/5 border border-brand-600/20 text-surface-700 dark:text-white/70">
                <Shield className="w-5 h-5 text-brand-500 shrink-0" />
                <p className="text-[10px] font-bold text-surface-600 dark:text-white/70 leading-relaxed uppercase tracking-wider">
                  By signing up, you agree to our Terms and Data Isolation Policy.
                </p>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-surface-950 dark:bg-white text-white dark:text-surface-950 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-600 dark:hover:bg-brand-600 hover:text-white dark:hover:text-white transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Provisioning...</> : 'Deploy My Workspace'}
              </button>
            </form>
          </div>
        </motion.div>

        <p className="text-center text-sm font-bold text-surface-600 dark:text-white/60 mt-8">
          Already have a workspace? <Link href="/login" className="text-brand-500 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  )
}
