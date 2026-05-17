'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Eye, EyeOff, Zap, Globe } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [showPass,  setShowPass]  = useState(false)
  const [loading,   setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await signIn('credentials', {
        email, password, redirect: false,
      })

      if (res?.error) {
        toast.error('Invalid email or password')
        setLoading(false)
        return
      }

      toast.success('Welcome back!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Authentication failed. Check your connection or configuration.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 text-surface-950 dark:text-white font-sans flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-brand-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-violet-600/10 rounded-full blur-[100px]" />
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
          <h1 className="text-3xl font-black mb-2">Welcome back.</h1>
          <p className="text-surface-550 dark:text-white/60 font-medium text-sm">Enter your credentials to access your workspace.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-1 rounded-[2.5rem] bg-surface-100 dark:bg-white/10 border border-surface-200 dark:border-white/20 backdrop-blur-3xl shadow-2xl"
        >
          <div className="bg-white dark:bg-surface-900/80 rounded-[2.2rem] p-8 md:p-10">
            {/* OAuth */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                className="flex items-center justify-center gap-3 py-3 rounded-xl bg-surface-50 dark:bg-white/5 border border-surface-200 dark:border-white/10 text-xs font-black uppercase tracking-wider text-surface-700 dark:text-white hover:bg-surface-100 dark:hover:bg-white/10 transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4" /> Google
              </button>
              <button 
                onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                className="flex items-center justify-center gap-3 py-3 rounded-xl bg-surface-50 dark:bg-white/5 border border-surface-200 dark:border-white/10 text-xs font-black uppercase tracking-wider text-surface-700 dark:text-white hover:bg-surface-100 dark:hover:bg-white/10 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg> GitHub
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-200 dark:border-white/10" />
              </div>
              <div className="relative text-center">
                <span className="bg-white dark:bg-surface-900 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-surface-400 dark:text-white/40">Or continue with</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-surface-500 dark:text-white/60 mb-2">Email Address</label>
                <input 
                  type="email" 
                  className="w-full bg-surface-50 dark:bg-white/5 border-2 border-surface-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-surface-950 dark:text-white focus:border-brand-600 focus:outline-none transition-all font-bold placeholder:text-surface-400 dark:placeholder:text-white/20" 
                  placeholder="name@company.com"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-surface-500 dark:text-white/60">Password</label>
                  <Link href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-brand-500 hover:underline">Forgot?</Link>
                </div>
                <div className="relative">
                  <input 
                    type={showPass ? 'text' : 'password'} 
                    className="w-full bg-surface-50 dark:bg-white/5 border-2 border-surface-200 dark:border-white/10 rounded-xl px-5 py-3.5 text-surface-950 dark:text-white focus:border-brand-600 focus:outline-none transition-all font-bold placeholder:text-surface-400 dark:placeholder:text-white/20 pr-12"
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 dark:text-white/40 hover:text-surface-900 dark:hover:text-white transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-surface-950 dark:bg-white text-white dark:text-surface-950 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-brand-600 dark:hover:bg-brand-600 hover:text-white dark:hover:text-white transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Authenticating...</> : 'Sign In to Odyssey'}
              </button>
            </form>
          </div>
        </motion.div>

        <p className="text-center text-sm font-bold text-surface-600 dark:text-white/60 mt-8">
          New to the platform? <Link href="/register" className="text-brand-500 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  )
}
