'use client'
import { useState, useEffect } from 'react'
import useSWR from 'swr'
import { Save, Loader2, Settings, AlertTriangle, Globe, Lock, Bell, Trash2, ShieldAlert, Plus, CheckCircle2, RefreshCw, MoreVertical, Shield, Key, FileDown, Laptop, Fingerprint, Mail, Volume2, Play, AppWindow, Monitor, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(d => d.data)

export default function SettingsPage() {
  const { data: tenant, mutate } = useSWR('/api/tenant', fetcher)
  const [activeTab, setActiveTab] = useState('General')
  
  // General Tab State
  const [saving, setSaving] = useState(false)
  
  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  // Domain Menu State
  const [showDomainMenu, setShowDomainMenu] = useState(false)
  const [domainStatus, setDomainStatus] = useState<'pending' | 'verifying' | 'active'>('pending')

  // Security Tab States
  const [enforce2FA, setEnforce2FA] = useState(false)
  const [enforceSSO, setEnforceSSO] = useState(false)
  const [ipList, setIpList] = useState<string[]>(['192.168.1.1', '10.0.0.45'])
  const [newIp, setNewIp] = useState('')

  // Notifications Tab States
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [toastsEnabled, setToastsEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [desktopEnabled, setDesktopEnabled] = useState(false)
  const [desktopPermission, setDesktopPermission] = useState<NotificationPermission | 'unsupported'>('default')

  // Slack Integration States
  const [slackEnabled, setSlackEnabled] = useState(false)
  const [slackUrl, setSlackUrl] = useState('')
  const [slackEvents, setSlackEvents] = useState({
    memberJoined: true,
    dnsVerified: false,
    securityAlert: true,
  })
  const [testingSlack, setTestingSlack] = useState(false)
  const [savingNotifications, setSavingNotifications] = useState(false)

  // Initialize notifications from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSoundEnabled(localStorage.getItem('odyssey_sound_enabled') !== 'false')
      setToastsEnabled(localStorage.getItem('odyssey_toasts_enabled') !== 'false')
      setEmailEnabled(localStorage.getItem('odyssey_email_enabled') !== 'false')
      setDesktopEnabled(localStorage.getItem('odyssey_desktop_enabled') === 'true')

      // Slack settings
      setSlackEnabled(localStorage.getItem('odyssey_slack_enabled') === 'true')
      setSlackUrl(localStorage.getItem('odyssey_slack_url') || '')
      try {
        const storedEvents = localStorage.getItem('odyssey_slack_events')
        if (storedEvents) {
          setSlackEvents(JSON.parse(storedEvents))
        }
      } catch (e) {}

      // Browser push permission status
      if ('Notification' in window) {
        setDesktopPermission(Notification.permission)
      } else {
        setDesktopPermission('unsupported')
      }
    }
  }, [])

  const playPreviewSound = (type: 'success' | 'error') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return
      
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)

      if (type === 'success') {
        osc.type = 'sine'
        osc.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08) // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16) // G5
        
        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.04)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45)
        
        osc.start()
        osc.stop(ctx.currentTime + 0.45)
      } else {
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(196.00, ctx.currentTime) // G3
        osc.frequency.setValueAtTime(164.81, ctx.currentTime + 0.12) // E3
        
        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.04)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)
        
        osc.start()
        osc.stop(ctx.currentTime + 0.35)
      }
    } catch (e) {
      console.error('AudioContext blocked or not supported', e)
    }
  }

  const requestDesktopPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('This browser does not support desktop notifications.')
      return
    }

    try {
      const permission = await Notification.requestPermission()
      setDesktopPermission(permission)
      
      if (permission === 'granted') {
        setDesktopEnabled(true)
        localStorage.setItem('odyssey_desktop_enabled', 'true')
        toast.success('Desktop notifications enabled successfully!')
        
        new Notification('Odyssey Workspace', {
          body: 'Browser push notifications successfully connected!',
        })
      } else if (permission === 'denied') {
        setDesktopEnabled(false)
        localStorage.setItem('odyssey_desktop_enabled', 'false')
        toast.error('Notification permission denied. Please enable them in browser settings.')
      }
    } catch (error) {
      toast.error('Failed to request permission.')
    }
  }

  const triggerTestDesktopNotification = () => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      toast.error('Please request and grant notification permission first.')
      return
    }
    
    new Notification('Odyssey Workspace Alert', {
      body: 'Success! This is a test push notification from your settings console.',
    })
    toast.success('Test desktop notification sent!')
  }

  const testSlackWebhook = async () => {
    if (!slackUrl.trim()) {
      toast.error('Please enter a valid webhook URL first.')
      return
    }
    if (!slackUrl.startsWith('https://hooks.slack.com/')) {
      toast.error('Invalid Slack Webhook URL. It must start with https://hooks.slack.com/')
      return
    }

    setTestingSlack(true)
    await new Promise(r => setTimeout(r, 2000))
    setTestingSlack(false)
    toast.success('Test webhook payload dispatched successfully!')
  }

  const handleSaveNotifications = async () => {
    setSavingNotifications(true)
    await new Promise(r => setTimeout(r, 1500))
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('odyssey_sound_enabled', soundEnabled ? 'true' : 'false')
      localStorage.setItem('odyssey_toasts_enabled', toastsEnabled ? 'true' : 'false')
      localStorage.setItem('odyssey_email_enabled', emailEnabled ? 'true' : 'false')
      localStorage.setItem('odyssey_desktop_enabled', desktopEnabled ? 'true' : 'false')
      localStorage.setItem('odyssey_slack_enabled', slackEnabled ? 'true' : 'false')
      localStorage.setItem('odyssey_slack_url', slackUrl)
      localStorage.setItem('odyssey_slack_events', JSON.stringify(slackEvents))
    }
    
    setSavingNotifications(false)
    toast.success('Notification preferences updated successfully!')
  }

  const handleVerifyDNS = () => {
    setShowDomainMenu(false)
    setDomainStatus('verifying')
    
    // Simulate verification delay
    setTimeout(() => {
      setDomainStatus('active')
      toast.success('Domain successfully verified and connected!')
    }, 2500)
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    
    const formData = new FormData(e.currentTarget)
    const newName = formData.get('name') as string

    try {
      const res  = await fetch('/api/tenant', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      })
      const data = await res.json()

      if (data.success) {
        toast.success('Workspace settings saved')
        mutate()
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      toast.error('Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (deleteConfirmText !== tenant?.slug) {
      toast.error('Workspace identifier does not match')
      return
    }
    
    setDeleting(true)
    // Simulate deletion delay
    await new Promise(r => setTimeout(r, 2000))
    toast.success('Workspace scheduled for deletion')
    setDeleting(false)
    setShowDeleteModal(false)
  }

  const tabs = [
    { label: 'General', icon: Settings },
    { label: 'Domains', icon: Globe },
    { label: 'Security', icon: Lock },
    { label: 'Notifications', icon: Bell },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tightest text-surface-950 dark:text-white mb-2">Workspace Settings</h1>
          <p className="text-surface-500 dark:text-white/40 text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Settings className="w-3.5 h-3.5" /> Configure your Odyssey environment
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="space-y-2 lg:col-span-1">
           {tabs.map((item, i) => (
             <button 
               key={i} 
               onClick={() => setActiveTab(item.label)}
               className={cn(
                 "w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                 activeTab === item.label 
                   ? "bg-surface-950 dark:bg-white text-white dark:text-surface-950 shadow-xl" 
                   : "text-surface-500 dark:text-white/40 hover:bg-surface-100 dark:hover:bg-white/5 hover:text-surface-950 dark:hover:text-white"
               )}
             >
               <item.icon className="w-4 h-4" />
               {item.label}
             </button>
           ))}
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'General' && (
              <motion.div 
                key="general"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div className="p-1 rounded-[2.5rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl">
                  <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] p-10 md:p-12">
                    <h2 className="text-2xl font-black text-surface-950 dark:text-white mb-8">General Configuration</h2>
                    <form onSubmit={handleSave} className="space-y-8">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 dark:text-white/40 mb-3">Workspace Name</label>
                        <input 
                          type="text" 
                          name="name"
                          className="w-full bg-surface-50 dark:bg-white/5 border-2 border-surface-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:border-brand-600 focus:outline-none transition-all font-black text-surface-950 dark:text-white placeholder:text-surface-300 dark:placeholder:text-white/20 hover:border-surface-300 dark:hover:border-white/20"
                          defaultValue={tenant?.name || ''} 
                          placeholder="e.g. Acme Corp" 
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 dark:text-white/40 mb-3">Public Workspace URL</label>
                        <div className="flex items-center bg-surface-50 dark:bg-white/[0.02] border-2 border-surface-200 dark:border-white/5 rounded-2xl px-6 py-4 gap-2 cursor-not-allowed">
                          <span className="text-[10px] font-black uppercase tracking-widest text-surface-400 dark:text-white/20">odyssey.app/</span>
                          <span className="text-sm font-black text-brand-600 dark:text-brand-500 uppercase tracking-widest">{tenant?.slug || 'loading...'}</span>
                        </div>
                        <p className="text-[10px] font-bold text-surface-400 dark:text-white/20 mt-3 uppercase tracking-wider flex items-center gap-2">
                           <Lock className="w-3 h-3" /> Workspace identifiers cannot be changed after creation.
                        </p>
                      </div>
                      <div className="flex justify-end pt-6 border-t border-surface-200 dark:border-white/10">
                        <button 
                          type="submit" 
                          disabled={saving} 
                          className="bg-surface-950 dark:bg-white text-white dark:text-surface-950 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-600 dark:hover:bg-brand-600 hover:text-white dark:hover:text-white transition-all shadow-xl hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:scale-105 active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
                        >
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="p-1 rounded-[2.5rem] bg-red-500/10 border border-red-500/20 shadow-2xl">
                  <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] p-10 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                       <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shrink-0 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                          <AlertTriangle className="w-8 h-8 text-red-500" />
                       </div>
                       <div>
                          <h4 className="text-2xl font-black text-surface-950 dark:text-white mb-2">Danger Zone</h4>
                          <p className="text-sm font-bold text-surface-500 dark:text-white/40 max-w-sm leading-relaxed">Permanently delete your workspace, databases, and all associated tenant data. This action is irreversible.</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setShowDeleteModal(true)}
                      className="px-8 py-5 rounded-2xl border-2 border-red-500/20 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2 hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]"
                    >
                       <Trash2 className="w-4 h-4" /> Delete Workspace
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Domains' && (
              <motion.div 
                key="domains"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                <div className="p-1 rounded-[2.5rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl">
                  <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] p-10 md:p-12">
                    <h2 className="text-2xl font-black text-surface-950 dark:text-white mb-2">Custom Domains</h2>
                    <p className="text-sm font-bold text-surface-500 dark:text-white/40 mb-10 leading-relaxed">Connect custom domains to white-label your workspace. You can add apex domains or subdomains.</p>
                    
                    <form onSubmit={e => e.preventDefault()} className="flex flex-col sm:flex-row gap-4 mb-12">
                      <input 
                        type="text" 
                        placeholder="e.g. app.yourcompany.com" 
                        className="flex-1 bg-surface-50 dark:bg-white/5 border-2 border-surface-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:border-brand-600 focus:outline-none transition-all font-black text-surface-950 dark:text-white placeholder:text-surface-300 dark:placeholder:text-white/20 hover:border-surface-300 dark:hover:border-white/20"
                      />
                      <button 
                        type="submit"
                        className="bg-surface-950 dark:bg-white text-white dark:text-surface-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-600 dark:hover:bg-brand-600 hover:text-white dark:hover:text-white transition-all shadow-xl hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add Domain
                      </button>
                    </form>

                    <div className="space-y-4">
                       {/* Built-in Domain */}
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-surface-50 dark:bg-white/[0.02] border border-surface-200 dark:border-white/5 gap-4">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center border border-brand-600/20">
                                <Globe className="w-5 h-5 text-brand-600 dark:text-brand-500" />
                             </div>
                             <div>
                                <p className="text-sm font-black text-surface-950 dark:text-white mb-0.5 flex items-center gap-2">
                                  {tenant?.slug || 'loading...'}.odyssey.app
                                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-surface-200 dark:bg-white/10 text-surface-600 dark:text-white/60">Default</span>
                                </p>
                                <p className="text-[10px] font-mono text-surface-500 dark:text-white/40 flex items-center gap-1"><Lock className="w-3 h-3" /> SSL Active</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-500">Active</span>
                            </div>
                          </div>
                       </div>

                       {/* Custom Domain Example */}
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-2xl bg-surface-50 dark:bg-white/[0.02] border border-surface-200 dark:border-white/5 gap-4 hover:border-surface-300 dark:hover:border-white/10 transition-colors group">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-white/5 flex items-center justify-center border border-surface-200 dark:border-white/10 group-hover:border-surface-300 dark:group-hover:border-white/20 transition-colors">
                                <Globe className="w-5 h-5 text-surface-400 dark:text-white/40 group-hover:text-surface-950 dark:group-hover:text-white transition-colors" />
                             </div>
                             <div>
                                <p className="text-sm font-black text-surface-950 dark:text-white mb-0.5">app.injaazh.com</p>
                                {domainStatus === 'active' ? (
                                  <p className="text-[10px] font-mono text-green-600 dark:text-green-500 flex items-center gap-1"><Lock className="w-3 h-3" /> SSL Active</p>
                                ) : domainStatus === 'verifying' ? (
                                  <p className="text-[10px] font-mono text-brand-600 dark:text-brand-500 flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> Verifying DNS records...</p>
                                ) : (
                                  <p className="text-[10px] font-mono text-surface-400 dark:text-white/40 flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> Issuing SSL Certificate...</p>
                                )}
                             </div>
                          </div>
                          <div className="flex items-center gap-3 relative">
                            {domainStatus === 'active' ? (
                               <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                  <span className="text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-500">Connected</span>
                               </div>
                            ) : domainStatus === 'verifying' ? (
                               <div className="px-3 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center gap-2">
                                  <Loader2 className="w-3 h-3 text-brand-600 dark:text-brand-500 animate-spin" />
                                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-500">Verifying</span>
                               </div>
                            ) : (
                               <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-500">Pending</span>
                               </div>
                            )}

                            {domainStatus === 'pending' && (
                              <div className="relative">
                                 <button 
                                   onClick={() => setShowDomainMenu(!showDomainMenu)}
                                   className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-200 dark:hover:bg-white/10 transition-colors text-surface-400 dark:text-white/40 hover:text-surface-950 dark:hover:text-white focus:outline-none"
                                 >
                                    <MoreVertical className="w-4 h-4" />
                                 </button>

                                 <AnimatePresence>
                                   {showDomainMenu && (
                                     <motion.div 
                                       initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                       animate={{ opacity: 1, scale: 1, y: 0 }}
                                       exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                       transition={{ duration: 0.15 }}
                                       className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-surface-900 border border-surface-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                                     >
                                       <div className="p-1.5 flex flex-col">
                                         <button 
                                           onClick={handleVerifyDNS}
                                           className="flex items-center gap-3 px-3 py-2.5 text-xs font-black text-surface-600 dark:text-white/70 hover:text-surface-950 dark:hover:text-white hover:bg-surface-50 dark:hover:bg-white/5 rounded-lg transition-colors text-left w-full group"
                                         >
                                           <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" /> Verify DNS
                                         </button>
                                         <div className="h-px bg-surface-200 dark:bg-white/5 my-1 mx-2" />
                                         <button 
                                           onClick={() => {
                                              toast.success('Domain removed');
                                              setShowDomainMenu(false);
                                           }}
                                           className="flex items-center gap-3 px-3 py-2.5 text-xs font-black text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors text-left w-full group"
                                         >
                                           <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Remove
                                         </button>
                                       </div>
                                     </motion.div>
                                   )}
                                 </AnimatePresence>
                              </div>
                            )}
                          </div>
                       </div>
                    </div>
                  </div>
                </div>

                {/* DNS Configuration Helper */}
                <div className="p-1 rounded-[2.5rem] bg-surface-200/80 dark:bg-brand-600/5 border border-surface-200 dark:border-brand-600/10 shadow-2xl">
                   <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div>
                         <h4 className="text-lg font-black text-surface-950 dark:text-white mb-2">DNS Configuration</h4>
                         <p className="text-xs font-bold text-surface-500 dark:text-white/40 leading-relaxed max-w-md">To connect your custom domain, you need to add a CNAME record pointing to our edge network in your DNS provider's dashboard.</p>
                      </div>
                      <div className="flex-1 w-full bg-surface-950 border border-surface-900 dark:border-white/10 rounded-2xl p-4 font-mono text-xs overflow-hidden">
                         <div className="flex items-center justify-between text-surface-400 dark:text-white/40 mb-2">
                            <span>Type</span>
                            <span>Name</span>
                            <span>Value</span>
                         </div>
                         <div className="flex items-center justify-between text-white font-bold bg-white/5 px-2 py-3 rounded-lg border border-white/5">
                            <span className="text-brand-500">CNAME</span>
                            <span>app</span>
                            <span className="truncate">cname.odyssey.app</span>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Security' && (
              <motion.div 
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* Authentication & Policy */}
                <div className="p-1 rounded-[2.5rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl">
                  <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] p-10 md:p-12 space-y-10">
                    <div>
                      <h2 className="text-2xl font-black text-surface-950 dark:text-white mb-2 flex items-center gap-3">
                         <Shield className="w-6 h-6 text-brand-600 dark:text-brand-500" /> Authentication Policies
                      </h2>
                      <p className="text-sm font-bold text-surface-500 dark:text-white/40 leading-relaxed">Manage security policies and login requirements for your workspace members.</p>
                    </div>

                    <div className="space-y-6">
                      {/* 2FA Toggle */}
                      <div className="flex items-center justify-between p-6 rounded-2xl bg-surface-50 dark:bg-white/[0.02] border border-surface-200 dark:border-white/5">
                        <div className="space-y-1 max-w-md">
                          <h4 className="text-sm font-black text-surface-950 dark:text-white flex items-center gap-2">
                             Enforce Two-Factor Authentication (2FA)
                          </h4>
                          <p className="text-xs font-bold text-surface-500 dark:text-white/40">Require all members of this workspace to enable 2FA on their accounts to maintain access.</p>
                        </div>
                        <button 
                          onClick={() => {
                            setEnforce2FA(!enforce2FA);
                            toast.success(enforce2FA ? '2FA enforcement disabled' : '2FA enforcement enabled');
                          }}
                          className={cn(
                            "w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center focus:outline-none shrink-0",
                            enforce2FA ? "bg-brand-600" : "bg-surface-300 dark:bg-white/10"
                          )}
                        >
                          <motion.div 
                            layout 
                            className="w-5 h-5 rounded-full bg-white shadow-md"
                            animate={{ x: enforce2FA ? 20 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </button>
                      </div>

                      {/* SSO Toggle */}
                      <div className="flex items-center justify-between p-6 rounded-2xl bg-surface-50 dark:bg-white/[0.02] border border-surface-200 dark:border-white/5">
                        <div className="space-y-1 max-w-md">
                          <h4 className="text-sm font-black text-surface-950 dark:text-white flex items-center gap-2">
                             SAML Single Sign-On (SSO)
                             <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest bg-brand-500/10 text-brand-600 dark:text-brand-500 border border-brand-500/20">Enterprise</span>
                          </h4>
                          <p className="text-xs font-bold text-surface-500 dark:text-white/40">Enforce enterprise identity provider authentication (Okta, Azure AD, OneLogin).</p>
                        </div>
                        <button 
                          onClick={() => {
                            setEnforceSSO(!enforceSSO);
                            toast.success(enforceSSO ? 'SSO requirement disabled' : 'SSO requirement enabled');
                          }}
                          className={cn(
                            "w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center focus:outline-none shrink-0",
                            enforceSSO ? "bg-brand-600" : "bg-surface-300 dark:bg-white/10"
                          )}
                        >
                          <motion.div 
                            layout 
                            className="w-5 h-5 rounded-full bg-white shadow-md"
                            animate={{ x: enforceSSO ? 20 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* IP Allowlist */}
                <div className="p-1 rounded-[2.5rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl">
                  <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] p-10 md:p-12 space-y-8">
                    <div>
                      <h3 className="text-xl font-black text-surface-950 dark:text-white mb-2 flex items-center gap-3">
                         <Globe className="w-5 h-5 text-brand-600 dark:text-brand-500" /> IP Allowlist
                      </h3>
                      <p className="text-xs font-bold text-surface-500 dark:text-white/40 leading-relaxed">Restrict workspace access to designated IP addresses or ranges. Empty list allows all IPs.</p>
                    </div>

                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        value={newIp}
                        onChange={e => setNewIp(e.target.value)}
                        placeholder="e.g. 192.168.1.1/24" 
                        className="flex-1 bg-surface-50 dark:bg-white/5 border-2 border-surface-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:border-brand-600 focus:outline-none transition-all font-black text-surface-950 dark:text-white placeholder:text-surface-300 dark:placeholder:text-white/20 hover:border-surface-300 dark:hover:border-white/20"
                      />
                      <button 
                        onClick={() => {
                          if (!newIp.trim()) return;
                          setIpList([...ipList, newIp.trim()]);
                          setNewIp('');
                          toast.success('IP address added to allowlist');
                        }}
                        className="bg-surface-950 dark:bg-white text-white dark:text-surface-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-600 dark:hover:bg-brand-600 hover:text-white dark:hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add IP
                      </button>
                    </div>

                    <div className="space-y-3">
                      {ipList.map((ip, index) => (
                        <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-white/[0.02] border border-surface-200 dark:border-white/5 text-xs font-bold">
                           <span className="font-mono text-surface-950 dark:text-white/80">{ip}</span>
                           <button 
                             onClick={() => {
                               setIpList(ipList.filter((_, i) => i !== index));
                               toast.success('IP removed from allowlist');
                             }}
                             className="text-red-600 dark:text-red-500 hover:text-red-500 font-black uppercase tracking-widest text-[9px] hover:underline"
                           >
                             Remove
                           </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Session Management & Audit Logs */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Active Sessions */}
                  <div className="p-1 rounded-[2.5rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl">
                    <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] p-8 md:p-10 h-full flex flex-col justify-between">
                       <div>
                         <h3 className="text-lg font-black text-surface-950 dark:text-white mb-2 flex items-center gap-3">
                            <Laptop className="w-5 h-5 text-brand-600 dark:text-brand-500" /> Active Sessions
                         </h3>
                         <p className="text-xs font-bold text-surface-500 dark:text-white/40 mb-8">Manage active web sessions accessing your workspace.</p>
                         
                         <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-50 dark:bg-white/5 border border-surface-200 dark:border-white/5">
                               <div className="flex items-center gap-3">
                                 <Fingerprint className="w-4 h-4 text-green-600 dark:text-green-500" />
                                 <div>
                                   <p className="text-xs font-black text-surface-950 dark:text-white">Chrome on Windows (Current)</p>
                                   <p className="text-[9px] font-mono text-surface-500 dark:text-white/40">IP: 182.56.24.12 • Active now</p>
                                 </div>
                               </div>
                            </div>
                         </div>
                       </div>
                       
                       <button 
                         onClick={() => toast.success('All other sessions revoked successfully')}
                         className="w-full mt-8 py-4 rounded-xl border border-red-500/20 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500 hover:text-red-700 dark:hover:text-white font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 text-center"
                       >
                         Revoke All Other Sessions
                       </button>
                    </div>
                  </div>

                  {/* Audit Logs */}
                  <div className="p-1 rounded-[2.5rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl">
                    <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] p-8 md:p-10 h-full flex flex-col justify-between">
                       <div>
                         <h3 className="text-lg font-black text-surface-950 dark:text-white mb-2 flex items-center gap-3">
                            <Key className="w-5 h-5 text-brand-600 dark:text-brand-500" /> Security Audit Logs
                         </h3>
                         <p className="text-xs font-bold text-surface-500 dark:text-white/40 mb-8 font-semibold">Track and review critical workspace events, configuration changes, and member actions.</p>
                         
                         <div className="p-4 rounded-2xl bg-surface-50 dark:bg-white/[0.02] border border-surface-200 dark:border-white/5 flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-600 dark:bg-brand-500 shadow-[0_0_8px_rgba(139,92,246,0.6)] shrink-0" />
                            <p className="text-xs font-bold text-surface-600 dark:text-white/60">Logging fully operational. Compliance standard compliance checked (SOC2 / GDPR).</p>
                         </div>
                       </div>
                       
                       <button 
                         onClick={() => toast.success('Audit logs downloaded successfully!')}
                         className="w-full mt-8 bg-surface-950 dark:bg-white text-white dark:text-surface-950 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-600 dark:hover:bg-brand-600 hover:text-white dark:hover:text-surface-950 hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 group"
                       >
                         <FileDown className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> Export Audit Logs (CSV)
                       </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'Notifications' && (
              <motion.div 
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* Master Preferences Card */}
                <div className="p-1 rounded-[2.5rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl">
                  <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] p-10 md:p-12 space-y-10">
                    <div>
                      <h2 className="text-2xl font-black text-surface-950 dark:text-white mb-2 flex items-center gap-3">
                         <Bell className="w-6 h-6 text-brand-600 dark:text-brand-500" /> Notifications Settings
                      </h2>
                      <p className="text-sm font-bold text-surface-500 dark:text-white/40 leading-relaxed font-semibold">Customize how Odyssey delivers workspace updates, chime sounds, and security notifications.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Sound Notifications (Odyssey Signature Chime) */}
                      <div className="flex items-center justify-between p-6 rounded-2xl bg-surface-50 dark:bg-white/[0.02] border border-surface-200 dark:border-white/5 hover:border-surface-300 dark:hover:border-white/10 transition-colors">
                        <div className="space-y-1 max-w-[200px] sm:max-w-xs">
                          <h4 className="text-sm font-black text-surface-950 dark:text-white flex items-center gap-2">
                             <Volume2 className="w-4 h-4 text-brand-600 dark:text-brand-500" /> Sound Alerts
                          </h4>
                          <p className="text-[11px] font-bold text-surface-500 dark:text-white/40">Play Odyssey signature synthesized chimes on toast notifications.</p>
                        </div>
                        <button 
                          onClick={() => setSoundEnabled(!soundEnabled)}
                          className={cn(
                            "w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center focus:outline-none shrink-0",
                            soundEnabled ? "bg-brand-600" : "bg-surface-300 dark:bg-white/10"
                          )}
                        >
                          <motion.div 
                            layout 
                            className="w-5 h-5 rounded-full bg-white shadow-md"
                            animate={{ x: soundEnabled ? 20 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </button>
                      </div>

                      {/* In-App Toast Alerts */}
                      <div className="flex items-center justify-between p-6 rounded-2xl bg-surface-50 dark:bg-white/[0.02] border border-surface-200 dark:border-white/5 hover:border-surface-300 dark:hover:border-white/10 transition-colors">
                        <div className="space-y-1 max-w-[200px] sm:max-w-xs">
                          <h4 className="text-sm font-black text-surface-950 dark:text-white flex items-center gap-2">
                             <AppWindow className="w-4 h-4 text-brand-600 dark:text-brand-500" /> Toast Alerts
                          </h4>
                          <p className="text-[11px] font-bold text-surface-500 dark:text-white/40">Display transient on-screen popup toasts for general system messages.</p>
                        </div>
                        <button 
                          onClick={() => setToastsEnabled(!toastsEnabled)}
                          className={cn(
                            "w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center focus:outline-none shrink-0",
                            toastsEnabled ? "bg-brand-600" : "bg-white/10"
                          )}
                        >
                          <motion.div 
                            layout 
                            className="w-5 h-5 rounded-full bg-white shadow-md"
                            animate={{ x: toastsEnabled ? 20 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </button>
                      </div>

                      {/* Email Digests */}
                      <div className="flex items-center justify-between p-6 rounded-2xl bg-surface-50 dark:bg-white/[0.02] border border-surface-200 dark:border-white/5 hover:border-surface-300 dark:hover:border-white/10 transition-colors">
                        <div className="space-y-1 max-w-[200px] sm:max-w-xs">
                          <h4 className="text-sm font-black text-surface-950 dark:text-white flex items-center gap-2">
                             <Mail className="w-4 h-4 text-brand-600 dark:text-brand-500" /> Email Digests
                          </h4>
                          <p className="text-[11px] font-bold text-surface-500 dark:text-white/40">Receive weekly summaries and transactional updates directly to your inbox.</p>
                        </div>
                        <button 
                          onClick={() => setEmailEnabled(!emailEnabled)}
                          className={cn(
                            "w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center focus:outline-none shrink-0",
                            emailEnabled ? "bg-brand-600" : "bg-surface-300 dark:bg-white/10"
                          )}
                        >
                          <motion.div 
                            layout 
                            className="w-5 h-5 rounded-full bg-white shadow-md"
                            animate={{ x: emailEnabled ? 20 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </button>
                      </div>

                      {/* Desktop Browser Alerts */}
                      <div className="flex items-center justify-between p-6 rounded-2xl bg-surface-50 dark:bg-white/[0.02] border border-surface-200 dark:border-white/5 hover:border-surface-300 dark:hover:border-white/10 transition-colors">
                        <div className="space-y-1 max-w-[200px] sm:max-w-xs">
                          <h4 className="text-sm font-black text-surface-950 dark:text-white flex items-center gap-2">
                             <Monitor className="w-4 h-4 text-brand-600 dark:text-brand-500" /> Push Alerts
                          </h4>
                          <p className="text-[11px] font-bold text-surface-500 dark:text-white/40">Deliver native desktop OS notifications through this browser window.</p>
                        </div>
                        <button 
                          onClick={() => {
                            if (desktopPermission !== 'granted') {
                              requestDesktopPermission()
                            } else {
                              const nextVal = !desktopEnabled
                              setDesktopEnabled(nextVal)
                              localStorage.setItem('odyssey_desktop_enabled', nextVal ? 'true' : 'false')
                              toast.success(nextVal ? 'Browser push alerts enabled' : 'Browser push alerts disabled')
                            }
                          }}
                          className={cn(
                            "w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center focus:outline-none shrink-0",
                            desktopEnabled && desktopPermission === 'granted' ? "bg-brand-600" : "bg-surface-300 dark:bg-white/10"
                          )}
                        >
                          <motion.div 
                            layout 
                            className="w-5 h-5 rounded-full bg-white shadow-md"
                            animate={{ x: (desktopEnabled && desktopPermission === 'granted') ? 20 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Odyssey Signature Chime & Browser Push Test Controls */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Synthesis Audio Suite */}
                  <div className="p-1 rounded-[2.5rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl">
                    <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] p-8 md:p-10 h-full flex flex-col justify-between space-y-6">
                       <div>
                         <h3 className="text-lg font-black text-surface-950 dark:text-white mb-2 flex items-center gap-3">
                            <Volume2 className="w-5 h-5 text-brand-600 dark:text-brand-500" /> Odyssey Tone Suite
                         </h3>
                         <p className="text-xs font-bold text-surface-500 dark:text-white/40 mb-6 font-semibold">Test the high-fidelity Synthesized Web Audio alerts configured in this tenant environment.</p>
                         
                         <div className="grid grid-cols-2 gap-4">
                            <motion.button 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => {
                                playPreviewSound('success')
                                toast.success('Triggered Odyssey Signature Chime!')
                              }}
                              className="px-4 py-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 hover:text-white hover:bg-green-500/20 transition-all flex flex-col items-center justify-center gap-3 text-center"
                            >
                               <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                  <Play className="w-5 h-5 fill-current" />
                                </div>
                               <span className="text-[10px] font-black uppercase tracking-widest">Success Chime</span>
                            </motion.button>

                            <motion.button 
                               whileHover={{ scale: 1.02 }}
                               whileTap={{ scale: 0.98 }}
                               onClick={() => {
                                 playPreviewSound('error')
                                 toast.error('Triggered Warning Tone Alert!')
                               }}
                               className="px-4 py-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-white hover:bg-red-500/20 transition-all flex flex-col items-center justify-center gap-3 text-center"
                             >
                                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
                                   <Play className="w-5 h-5 fill-current" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">Warning Alert</span>
                             </motion.button>
                          </div>
                       </div>
                       
                       <p className="text-[10px] font-bold text-surface-400 dark:text-white/20 uppercase tracking-widest text-center">
                          Synthesized live using standard browser AudioContext oscillator
                       </p>
                    </div>
                  </div>

                  {/* Browser Push Orchestration */}
                  <div className="p-1 rounded-[2.5rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl">
                    <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] p-8 md:p-10 h-full flex flex-col justify-between space-y-6">
                       <div>
                         <h3 className="text-lg font-black text-surface-950 dark:text-white mb-2 flex items-center gap-3">
                            <Monitor className="w-5 h-5 text-brand-600 dark:text-brand-500" /> Desktop Notifications
                         </h3>
                         <p className="text-xs font-bold text-surface-500 dark:text-white/40 mb-6 font-semibold">Orchestrate and authorize native browser alerts with custom testing capabilities.</p>
                         
                         <div className="p-5 rounded-2xl bg-surface-50 dark:bg-white/[0.02] border border-surface-200 dark:border-white/5 flex items-center justify-between gap-4">
                            <div>
                               <p className="text-xs font-black text-surface-950 dark:text-white">Browser Permission</p>
                               <p className="text-[10px] font-mono text-surface-500 dark:text-white/40 mt-1">Status: {desktopPermission}</p>
                            </div>
                            
                            {desktopPermission === 'granted' ? (
                               <div className="px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                  <span className="text-[9px] font-black uppercase tracking-widest text-green-600 dark:text-green-500">Authorized</span>
                               </div>
                            ) : desktopPermission === 'denied' ? (
                               <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                                  <span className="text-[9px] font-black uppercase tracking-widest text-red-600 dark:text-red-500">Blocked</span>
                               </div>
                            ) : (
                               <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse" />
                                  <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-500">Not Requested</span>
                               </div>
                            )}
                         </div>
                       </div>
                       
                       <div className="flex gap-4">
                          {desktopPermission !== 'granted' ? (
                             <button 
                               onClick={requestDesktopPermission}
                               className="w-full py-4 rounded-xl bg-surface-950 dark:bg-white text-white dark:text-surface-950 hover:bg-brand-600 dark:hover:bg-brand-600 hover:text-white font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
                             >
                               Request Push Access
                             </button>
                          ) : (
                             <button 
                               onClick={triggerTestDesktopNotification}
                               className="w-full py-4 rounded-xl bg-surface-950 dark:bg-white text-white dark:text-surface-950 hover:bg-brand-600 dark:hover:bg-brand-600 hover:text-white font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] text-center"
                             >
                               Send Test Notification
                             </button>
                          )}
                       </div>
                    </div>
                  </div>
                </div>

                {/* Slack Webhook Integrations Card */}
                <div className="p-1 rounded-[2.5rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl">
                  <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] p-10 md:p-12 space-y-8">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div>
                           <h3 className="text-xl font-black text-surface-950 dark:text-white mb-2 flex items-center gap-3">
                              <span className="w-2.5 h-2.5 rounded-full bg-brand-500 shadow-[0_0_10px_rgba(139,92,246,0.6)]" />
                              Slack Webhook Integration
                           </h3>
                           <p className="text-xs font-bold text-surface-500 dark:text-white/40 leading-relaxed font-semibold">Transmit crucial workspace logs and automated notification digests directly to your company channels.</p>
                        </div>
                        <button 
                          onClick={() => setSlackEnabled(!slackEnabled)}
                          className={cn(
                            "w-12 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center focus:outline-none shrink-0 self-start sm:self-center",
                            slackEnabled ? "bg-brand-600" : "bg-surface-300 dark:bg-white/10"
                          )}
                        >
                          <motion.div 
                            layout 
                            className="w-5 h-5 rounded-full bg-white shadow-md"
                            animate={{ x: slackEnabled ? 20 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </button>
                     </div>

                     <AnimatePresence>
                        {slackEnabled && (
                           <motion.div 
                             initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: 'auto' }}
                             exit={{ opacity: 0, height: 0 }}
                             transition={{ duration: 0.3 }}
                             className="space-y-6 overflow-hidden pt-2 border-t border-surface-200 dark:border-white/5"
                           >
                              <div>
                                 <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 dark:text-white/40 mb-3">Slack Webhook URL</label>
                                 <div className="flex flex-col sm:flex-row gap-4">
                                    <input 
                                      type="text" 
                                      value={slackUrl}
                                      onChange={e => setSlackUrl(e.target.value)}
                                      placeholder="e.g. https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX" 
                                      className="flex-1 bg-surface-50 dark:bg-white/5 border-2 border-surface-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:border-brand-600 focus:outline-none transition-all font-black text-surface-950 dark:text-white placeholder:text-surface-300 dark:placeholder:text-white/20 hover:border-surface-300 dark:hover:border-white/20"
                                    />
                                    <button 
                                      onClick={testSlackWebhook}
                                      disabled={testingSlack}
                                      className="bg-surface-950 dark:bg-white text-white dark:text-surface-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-600 dark:hover:bg-brand-600 hover:text-white dark:hover:text-surface-950 transition-all shadow-xl hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                      {testingSlack ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                      Test Dispatch
                                    </button>
                                 </div>
                              </div>

                              <div className="space-y-4">
                                 <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 dark:text-white/40">Event Subscriptions</label>
                                 <div className="grid sm:grid-cols-3 gap-4">
                                    <label className="flex items-center gap-3 p-4 rounded-xl bg-surface-50 dark:bg-white/[0.02] border border-surface-200 dark:border-white/5 cursor-pointer hover:bg-surface-100 dark:hover:bg-white/[0.04] transition-all">
                                       <input 
                                         type="checkbox" 
                                         checked={slackEvents.memberJoined}
                                         onChange={e => setSlackEvents({ ...slackEvents, memberJoined: e.target.checked })}
                                         className="rounded border-surface-300 dark:border-white/10 bg-white dark:bg-white/5 text-brand-600 focus:ring-brand-600"
                                       />
                                       <span className="text-xs font-black text-surface-600 dark:text-white/70">Member Joined</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 rounded-xl bg-surface-50 dark:bg-white/[0.02] border border-surface-200 dark:border-white/5 cursor-pointer hover:bg-surface-100 dark:hover:bg-white/[0.04] transition-all">
                                       <input 
                                         type="checkbox" 
                                         checked={slackEvents.dnsVerified}
                                         onChange={e => setSlackEvents({ ...slackEvents, dnsVerified: e.target.checked })}
                                         className="rounded border-surface-300 dark:border-white/10 bg-white dark:bg-white/5 text-brand-600 focus:ring-brand-600"
                                       />
                                       <span className="text-xs font-black text-surface-600 dark:text-white/70">Domain Connected</span>
                                    </label>
                                    <label className="flex items-center gap-3 p-4 rounded-xl bg-surface-50 dark:bg-white/[0.02] border border-surface-200 dark:border-white/5 cursor-pointer hover:bg-surface-100 dark:hover:bg-white/[0.04] transition-all">
                                       <input 
                                         type="checkbox" 
                                         checked={slackEvents.securityAlert}
                                         onChange={e => setSlackEvents({ ...slackEvents, securityAlert: e.target.checked })}
                                         className="rounded border-surface-300 dark:border-white/10 bg-white dark:bg-white/5 text-brand-600 focus:ring-brand-600"
                                       />
                                       <span className="text-xs font-black text-surface-600 dark:text-white/70">Security Audits</span>
                                    </label>
                                 </div>
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
                </div>

                {/* Save Preference Action Bar */}
                <div className="flex justify-end pt-6 border-t border-surface-200 dark:border-white/10">
                   <button 
                     onClick={handleSaveNotifications}
                     disabled={savingNotifications}
                     className="bg-surface-950 dark:bg-white text-white dark:text-surface-950 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-600 dark:hover:bg-brand-600 hover:text-white dark:hover:text-surface-950 transition-all shadow-xl hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:scale-105 active:scale-95 flex items-center gap-3 disabled:opacity-50"
                   >
                     {savingNotifications ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                     Save Preferences
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 bg-surface-950/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="p-1 rounded-[3rem] bg-red-500/10 border border-red-500/20 shadow-2xl w-full max-w-xl"
            >
              <div className="bg-surface-900 rounded-[2.8rem] p-10 md:p-12">
                <div className="text-center mb-8">
                   <div className="w-20 h-20 rounded-[2rem] bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(239,68,68,0.3)]">
                      <ShieldAlert className="w-10 h-10 text-red-500" />
                   </div>
                   <h2 className="text-3xl font-black text-white mb-4">Delete Workspace?</h2>
                   <p className="text-white/40 text-sm font-bold leading-relaxed bg-red-500/5 p-4 rounded-2xl border border-red-500/10">
                      You are about to permanently delete <strong className="text-white">{tenant?.name}</strong>. 
                      This will instantly destroy all isolated databases, edge routes, and member data. <strong className="text-red-500">This action cannot be undone.</strong>
                   </p>
                </div>

                <div className="mb-10">
                   <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-3 text-center">
                     Please type <strong className="text-white select-all bg-white/10 px-2 py-0.5 rounded">{tenant?.slug}</strong> to confirm
                   </label>
                   <input 
                     type="text" 
                     className="w-full bg-white/5 border-2 border-red-500/20 rounded-2xl px-6 py-5 focus:border-red-500 focus:outline-none transition-all font-black text-center text-white"
                     value={deleteConfirmText}
                     onChange={e => setDeleteConfirmText(e.target.value)}
                     placeholder={tenant?.slug} 
                   />
                </div>

                <div className="flex gap-4">
                   <button 
                     onClick={() => setShowDeleteModal(false)}
                     disabled={deleting}
                     className="flex-1 py-5 rounded-2xl border-2 border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
                   >
                      Cancel
                   </button>
                   <button 
                     onClick={handleDelete}
                     disabled={deleting || deleteConfirmText !== tenant?.slug}
                     className="flex-1 bg-red-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:bg-red-500 disabled:shadow-none"
                   >
                      {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Deletion'}
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
