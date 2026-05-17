'use client'
import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { 
  User, Mail, Lock, Save, Loader2, Camera, ShieldCheck, Zap, 
  Laptop, Smartphone, AlertCircle, CheckCircle2, 
  RefreshCw, Eye, EyeOff, UploadCloud, Trash2, Check, Globe
} from 'lucide-react'
import { getInitials, cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

// Define premium background presets
const GRADIENT_PRESETS = [
  { key: 'gradient-nebula', name: 'Odyssey Nebula', css: 'from-brand-600 to-violet-600 shadow-[0_0_20px_rgba(139,92,246,0.3)]' },
  { key: 'gradient-cyber', name: 'Emerald Cyber', css: 'from-emerald-500 to-teal-700 shadow-[0_0_20px_rgba(16,185,129,0.3)]' },
  { key: 'gradient-obsidian', name: 'Obsidian Dusk', css: 'from-zinc-800 to-zinc-950 shadow-[0_0_20px_rgba(39,39,42,0.5)]' },
  { key: 'gradient-sunset', name: 'Sunset Aura', css: 'from-rose-500 to-amber-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]' }
]

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  })

  // Synchronize session values once they load
  useEffect(() => {
    if (session?.user) {
      const name = session.user.name || ''
      const email = session.user.email || ''
      setFormData(prev => ({
        ...prev,
        name,
        email,
      }))
    }
  }, [session])

  // Custom states for visual interactive features
  const [showCurrentPass, setShowCurrentPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [activeGradient, setActiveGradient] = useState('gradient-nebula')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // SSO integrations states
  const [connectedProviders, setConnectedProviders] = useState({
    google: true,
    github: false,
    discord: false
  })
  const [linkingProvider, setLinkingProvider] = useState<string | null>(null)

  // Session management state
  const [sessions, setSessions] = useState([
    { id: 's1', browser: 'Chrome', os: 'Windows 11', ip: '103.145.74.12', location: 'Dhaka, Bangladesh', active: true, device: 'desktop', time: 'Current Session' },
    { id: 's2', browser: 'Safari Mobile', os: 'Apple iPhone 16 Pro', ip: '103.145.74.88', location: 'Chittagong, Bangladesh', active: false, device: 'mobile', time: 'Last active: 2 hours ago' },
    { id: 's3', browser: 'Firefox', os: 'Linux Desktop', ip: '192.168.1.105', location: 'Sylhet, Bangladesh', active: false, device: 'desktop', time: 'Last active: 3 days ago' }
  ])
  const [revokingId, setRevokingId] = useState<string | null>(null)

  // File Upload Reference
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Dynamic Password Validation
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    number: false,
    uppercase: false,
    symbol: false
  })
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; label: string; color: string; shadow: string }>({
    score: 0, label: 'Unsecured', color: 'bg-white/10', shadow: 'shadow-none'
  })

  // Calculate Password Strength in Real-time
  useEffect(() => {
    const pw = formData.newPassword
    if (!pw) {
      setPasswordRequirements({ length: false, number: false, uppercase: false, symbol: false })
      setPasswordStrength({ score: 0, label: 'Unsecured', color: 'bg-white/10', shadow: 'shadow-none' })
      return
    }

    const reqs = {
      length: pw.length >= 8,
      number: /\d/.test(pw),
      uppercase: /[A-Z]/.test(pw),
      symbol: /[^A-Za-z0-9]/.test(pw)
    }
    setPasswordRequirements(reqs)

    const passedCount = Object.values(reqs).filter(Boolean).length
    let score = passedCount
    let label = 'Unsecured'
    let color = 'bg-white/10'
    let shadow = 'shadow-none'

    if (score === 1) {
      label = 'Weak Shielding'
      color = 'bg-amber-500'
      shadow = 'shadow-[0_0_15px_rgba(245,158,11,0.4)]'
    } else if (score === 2) {
      label = 'Moderate Protection'
      color = 'bg-yellow-400'
      shadow = 'shadow-[0_0_15px_rgba(250,204,21,0.4)]'
    } else if (score === 3) {
      label = 'Strong Encryption'
      color = 'bg-emerald-500'
      shadow = 'shadow-[0_0_15px_rgba(16,185,129,0.4)]'
    } else if (score === 4) {
      label = 'Cyber-Shielded'
      color = 'bg-violet-500'
      shadow = 'shadow-[0_0_20px_rgba(139,92,246,0.6)]'
    }

    setPasswordStrength({ score, label, color, shadow })
  }, [formData.newPassword])

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const simulateProgressUpload = (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          
          const reader = new FileReader()
          reader.onload = () => {
            setUploadedImage(reader.result as string)
            toast.success('Avatar uploaded successfully')
          }
          reader.readAsDataURL(file)
          return 100
        }
        return prev + 25
      })
    }, 150)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please drop an image file.')
        return
      }
      simulateProgressUpload(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      simulateProgressUpload(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const removeAvatarImage = () => {
    setUploadedImage(null)
    toast.success('Avatar image reset to gradient base')
  }

  // Handle SSO Linking Simulation
  const handleLinkSSO = (provider: 'google' | 'github' | 'discord') => {
    if (connectedProviders[provider]) {
      // Disconnect
      setConnectedProviders(prev => ({ ...prev, [provider]: false }))
      toast.success(`Successfully unlinked your ${provider.toUpperCase()} account.`)
    } else {
      // Connect
      setLinkingProvider(provider)
      setTimeout(() => {
        setConnectedProviders(prev => ({ ...prev, [provider]: true }))
        setLinkingProvider(null)
        toast.success(`Securely connected to ${provider.toUpperCase()} identity.`)
      }, 1500)
    }
  }

  // Handle Session Revocation
  const handleRevokeSession = (id: string) => {
    setRevokingId(id)
    setTimeout(() => {
      setSessions(prev => prev.filter(s => s.id !== id))
      setRevokingId(null)
      toast.success('Session security token revoked.')
    }, 1200)
  }

  // Profile Update handler
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (data.success) {
        toast.success('Account profile updated successfully')
        // Update next-auth session local client cache
        await update({ name: formData.name })
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }))
      } else {
        throw new Error(data.error)
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 text-surface-950 dark:text-white">
      {/* Top Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tightest text-surface-950 dark:text-white mb-2">My Profile</h1>
          <p className="text-surface-500 dark:text-white/40 text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-brand-500" /> Configure your identity & protection shield
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        
        {/* ================= LEFT COLUMN: AVATAR & INTEGRATIONS ================= */}
        <div className="space-y-8 lg:col-span-1">
          
          {/* Futuristic Avatar Customizer Card */}
          <div className="p-1 rounded-[3rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="bg-white dark:bg-surface-900/40 rounded-[2.8rem] p-8 flex flex-col items-center">
              
              {/* Uploader Drag-and-Drop Area */}
              <div 
                className={cn(
                  "relative mb-6 cursor-pointer group/avatar w-36 h-36 rounded-[2.8rem] p-1 transition-all duration-500",
                  isDragging ? "scale-105 border-2 border-dashed border-brand-500 bg-brand-500/10" : ""
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                {/* Visual Gradient/Image Container */}
                <div 
                  className={cn(
                    "w-full h-full rounded-[2.5rem] flex items-center justify-center text-4xl font-black text-white relative overflow-hidden transition-all duration-500 bg-gradient-to-tr",
                    GRADIENT_PRESETS.find(p => p.key === activeGradient)?.css || 'from-brand-600 to-violet-600'
                  )}
                >
                  {uploadedImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={uploadedImage} 
                      alt="Avatar Preview" 
                      className="w-full h-full object-cover rounded-[2.5rem]" 
                    />
                  ) : (
                    getInitials(formData.name || session?.user?.name || 'U')
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-1.5 rounded-[2.5rem]">
                    <UploadCloud className="w-6 h-6 text-brand-500 animate-bounce" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/80">Change Avatar</span>
                  </div>
                </div>

                {/* Upload Status Spinners */}
                {isUploading && (
                  <div className="absolute inset-0 bg-surface-950/80 rounded-[2.8rem] flex flex-col items-center justify-center p-4">
                    <Loader2 className="w-6 h-6 text-brand-500 animate-spin mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-brand-500">{uploadProgress}% loaded</span>
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />

              <h2 className="text-2xl font-black text-surface-950 dark:text-white truncate max-w-full">{formData.name || 'Odyssey Admin'}</h2>
              <p className="text-[10px] font-black text-surface-400 dark:text-white/30 uppercase tracking-widest mb-6 mt-1 truncate max-w-full">{formData.email}</p>
              
              <div className="flex gap-2">
                <div className="px-4 py-2 rounded-xl bg-brand-600/10 border border-brand-600/20 text-[10px] font-black uppercase tracking-widest text-brand-500 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-500" /> Identity Protected
                </div>
                {uploadedImage && (
                  <button 
                    onClick={removeAvatarImage}
                    className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Preset Gradient Background Themes Grid */}
              <div className="w-full border-t border-surface-200 dark:border-white/5 mt-8 pt-6">
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-surface-400 dark:text-white/30 mb-4 text-center">Gradient Theme Presets</h4>
                <div className="grid grid-cols-4 gap-3">
                  {GRADIENT_PRESETS.map((p) => (
                    <button
                      key={p.key}
                      onClick={() => setActiveGradient(p.key)}
                      className={cn(
                        "h-10 rounded-xl bg-gradient-to-tr transition-all duration-300 relative border-2",
                        p.css,
                        activeGradient === p.key ? "border-brand-500 scale-110" : "border-transparent hover:scale-105"
                      )}
                      title={p.name}
                    >
                      {activeGradient === p.key && (
                        <span className="absolute inset-0 flex items-center justify-center text-white">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Connected Identity Accounts Module */}
          <div className="p-1 rounded-[2.5rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
            <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-wider text-surface-950 dark:text-white">SSO Integrations</h3>
                <Zap className="w-4 h-4 text-brand-500" />
              </div>
              <p className="text-surface-500 dark:text-white/40 text-[10px] font-bold leading-relaxed">
                Connect external accounts for secure Single Sign-On authentications.
              </p>

              <div className="space-y-3.5 pt-2">
                {/* Google Provider Row */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-50 dark:bg-white/[0.02] border border-surface-200 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-blue-400 shrink-0" />
                    <div>
                      <p className="text-xs font-black text-surface-950 dark:text-white">Google SSO</p>
                      <p className="text-[9px] font-bold text-surface-400 dark:text-white/30 truncate max-w-[140px]">{connectedProviders.google ? formData.email : 'Not connected'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleLinkSSO('google')}
                    disabled={linkingProvider !== null}
                    className={cn(
                      "px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                      connectedProviders.google ? "bg-surface-100 dark:bg-white/5 text-surface-600 dark:text-white/55 hover:bg-red-500/10 hover:text-red-500 border border-surface-200 dark:border-white/10" : "bg-blue-500 text-white hover:bg-blue-600"
                    )}
                  >
                    {connectedProviders.google ? 'Disconnect' : 'Connect'}
                  </button>
                </div>

                {/* GitHub Provider Row */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-50 dark:bg-white/[0.02] border border-surface-200 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-surface-950 dark:text-white fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <div>
                      <p className="text-xs font-black text-surface-950 dark:text-white">GitHub OAuth</p>
                      <p className="text-[9px] font-bold text-surface-400 dark:text-white/30 truncate max-w-[140px]">{connectedProviders.github ? '@github_odyssey' : 'Not connected'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleLinkSSO('github')}
                    disabled={linkingProvider !== null}
                    className={cn(
                      "px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5",
                      connectedProviders.github ? "bg-surface-100 dark:bg-white/5 text-surface-600 dark:text-white/55 hover:bg-red-500/10 hover:text-red-500 border border-surface-200 dark:border-white/10" : "bg-surface-950 dark:bg-white text-white dark:text-surface-950 hover:bg-brand-600 hover:text-white"
                    )}
                  >
                    {linkingProvider === 'github' ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      connectedProviders.github ? 'Disconnect' : 'Connect'
                    )}
                  </button>
                </div>

                {/* Discord Provider Row */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-50 dark:bg-white/[0.02] border border-surface-200 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-indigo-400 shrink-0" />
                    <div>
                      <p className="text-xs font-black text-surface-950 dark:text-white">Discord Guild</p>
                      <p className="text-[9px] font-bold text-surface-400 dark:text-white/30 truncate max-w-[140px]">{connectedProviders.discord ? '@discord_admin' : 'Not connected'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleLinkSSO('discord')}
                    disabled={linkingProvider !== null}
                    className={cn(
                      "px-3.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5",
                      connectedProviders.discord ? "bg-surface-100 dark:bg-white/5 text-surface-600 dark:text-white/55 hover:bg-red-500/10 hover:text-red-500 border border-surface-200 dark:border-white/10" : "bg-indigo-500 text-white hover:bg-indigo-600"
                    )}
                  >
                    {linkingProvider === 'discord' ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      connectedProviders.discord ? 'Disconnect' : 'Connect'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ================= RIGHT COLUMN: FORM & SECURITY SESSIONS ================= */}
        <div className="lg:col-span-2 space-y-8">
          
          <form onSubmit={handleUpdate} className="space-y-8">
            
            {/* Personal Details Form Section */}
            <div className="p-1 rounded-[2.5rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
              <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] p-8 md:p-10 space-y-6">
                <h3 className="text-lg font-black text-surface-950 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-brand-500" /> Personal Identity Details
                </h3>
                <div className="w-full h-px bg-surface-200 dark:bg-white/5" />

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Full Name Input */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 dark:text-white/40 mb-3">Full Name</label>
                    <div className="relative group/input">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-surface-300 dark:text-white/20 group-focus-within/input:text-brand-500 transition-colors" />
                      <input 
                        type="text" 
                        className="w-full bg-surface-50 dark:bg-white/5 border-2 border-surface-200 dark:border-white/10 rounded-2xl px-6 py-4 pl-14 focus:border-brand-600 focus:outline-none transition-all font-bold text-surface-950 dark:text-white focus:bg-white/[0.07] shadow-inner"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        required 
                      />
                    </div>
                  </div>

                  {/* Email Input (Read-only) */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 dark:text-white/40 mb-3">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-surface-300 dark:text-white/20" />
                      <input 
                        type="email" 
                        disabled
                        className="w-full bg-surface-50 dark:bg-white/[0.02] border-2 border-surface-200 dark:border-white/5 rounded-2xl px-6 py-4 pl-14 text-surface-400 dark:text-white/30 cursor-not-allowed font-bold"
                        value={formData.email}
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest text-brand-500/50 bg-brand-500/5 px-2 py-0.5 rounded border border-brand-500/10">
                        Primary Key
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Shield & Password Settings Section */}
            <div className="p-1 rounded-[2.5rem] bg-white/5 border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="bg-surface-900/40 rounded-[2.3rem] p-8 md:p-10 space-y-6">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-brand-500" /> Security Shield Configuration
                </h3>
                <div className="w-full h-px bg-white/5" />

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Current Password Field */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">Current Password</label>
                    <div className="relative group/input">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within/input:text-brand-500 transition-colors" />
                      <input 
                        type={showCurrentPass ? 'text' : 'password'} 
                        placeholder="••••••••"
                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 pl-14 pr-14 focus:border-brand-600 focus:outline-none transition-all font-bold text-white focus:bg-white/[0.07] shadow-inner placeholder:text-white/10"
                        value={formData.currentPassword}
                        onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowCurrentPass(!showCurrentPass)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white transition-colors"
                      >
                        {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password Field */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3">New Password</label>
                    <div className="relative group/input">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/20 group-focus-within/input:text-brand-500 transition-colors" />
                      <input 
                        type={showNewPass ? 'text' : 'password'} 
                        placeholder="••••••••"
                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 pl-14 pr-14 focus:border-brand-600 focus:outline-none transition-all font-bold text-white focus:bg-white/[0.07] shadow-inner placeholder:text-white/10"
                        value={formData.newPassword}
                        onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                      />
                      <button 
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white transition-colors"
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password strength and requirements check layout */}
                {formData.newPassword && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-4 space-y-4 border-t border-white/5"
                  >
                    {/* Glowing Strength Progress Indicator */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white/40 uppercase tracking-widest">Shield Level</span>
                        <span className="font-black text-brand-500 uppercase tracking-widest">{passwordStrength.label}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden p-px">
                        <motion.div 
                          className={cn("h-full rounded-full transition-all duration-500", passwordStrength.color, passwordStrength.shadow)}
                          style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Requirements checklist bubbles */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2">
                      {[
                        { key: 'length', text: 'Min 8 chars' },
                        { key: 'number', text: 'Has Number' },
                        { key: 'uppercase', text: 'Capital Letter' },
                        { key: 'symbol', text: 'Special Symbol' }
                      ].map((req) => {
                        const verified = passwordRequirements[req.key as keyof typeof passwordRequirements]
                        return (
                          <div 
                            key={req.key}
                            className={cn(
                              "flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all duration-300",
                              verified 
                                ? "bg-green-500/10 border-green-500/20 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]" 
                                : "bg-white/[0.01] border-white/5 text-white/30"
                            )}
                          >
                            <div className={cn(
                              "w-4 h-4 rounded-full flex items-center justify-center shrink-0 border text-[8px]",
                              verified ? "bg-green-500/20 border-green-500/30 text-green-400" : "border-white/10 text-transparent"
                            )}>
                              ✓
                            </div>
                            {req.text}
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

              </div>
            </div>

            {/* Float Save Action Bar */}
            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={saving}
                className="bg-white text-surface-950 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-600 hover:text-white transition-all shadow-2xl flex items-center gap-3 active:scale-95 duration-200"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Provisioning...</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Account Changes</>
                )}
              </button>
            </div>
            
          </form>

          {/* Active Devices & Logs Audit Session Center */}
          <div className="p-1 rounded-[2.5rem] bg-white/5 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="bg-surface-900/40 rounded-[2.3rem] p-8 md:p-10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-brand-500" /> Personal Device Sessions Audit
                </h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-500 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20 animate-pulse">
                  Live Stream
                </span>
              </div>
              <div className="w-full h-px bg-white/5" />
              
              <p className="text-white/40 text-xs font-bold leading-relaxed">
                These are the browser clients recently authenticated on your personal Odyssey profile. You can revoke any other session immediately.
              </p>

              <div className="space-y-4 pt-2">
                <AnimatePresence mode="popLayout">
                  {sessions.map((s) => (
                    <motion.div 
                      layout
                      key={s.id} 
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "p-5 rounded-2xl border transition-all duration-300 flex items-start sm:items-center justify-between gap-4 relative overflow-hidden",
                        s.active 
                          ? "bg-brand-600/5 border-brand-600/20 shadow-[0_0_15px_rgba(139,92,246,0.05)]" 
                          : "bg-white/[0.01] border-white/5 hover:border-white/10"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border",
                          s.active 
                            ? "bg-brand-600/10 border-brand-600/20 text-brand-500" 
                            : "bg-white/5 border-white/10 text-white/40"
                        )}>
                          {s.device === 'desktop' ? <Laptop className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-white">{s.browser} on {s.os}</h4>
                            {s.active && (
                              <span className="text-[8px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                                Active Device
                              </span>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[10px] font-bold text-white/30">
                            <span className="flex items-center gap-1">
                              <Globe className="w-3.5 h-3.5 text-white/20" /> IP: {s.ip}
                            </span>
                            <span>•</span>
                            <span>Location: {s.location}</span>
                            <span>•</span>
                            <span className={cn(s.active ? "text-brand-500" : "text-white/30")}>{s.time}</span>
                          </div>
                        </div>
                      </div>

                      {!s.active && (
                        <button 
                          type="button"
                          onClick={() => handleRevokeSession(s.id)}
                          disabled={revokingId !== null}
                          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all shadow shrink-0"
                        >
                          {revokingId === s.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" />
                          ) : (
                            'Revoke Access'
                          )}
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
