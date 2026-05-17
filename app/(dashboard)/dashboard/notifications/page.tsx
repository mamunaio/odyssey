'use client'
import { Bell, CheckCircle2, AlertCircle, Info, Trash2, Calendar, Search, Filter, Loader2, MousePointer2, Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface Notification {
  id: string
  title: string
  desc: string
  type: 'success' | 'warning' | 'info'
  time: string
  read: boolean
  category: string
}

const initialNotifications: Notification[] = [
  { id: '1', title: 'System Upgrade Successful', desc: 'Odyssey v2.4 core engine has been patched to the latest RLS standards.', type: 'success', time: 'Oct 24, 2023 • 10:30 AM', read: true, category: 'System' },
  { id: '2', title: 'New Login Detected', desc: 'A login from a new IP (192.168.1.45) was detected for your account.', type: 'warning', time: 'Oct 24, 2023 • 09:15 AM', read: false, category: 'Security' },
  { id: '3', title: 'Billing Cycle Notice', desc: 'Your Pro plan subscription will renew in 3 days. Ensure payment method is valid.', type: 'info', time: 'Oct 23, 2023 • 02:00 PM', read: true, category: 'Billing' },
  { id: '4', title: 'API Key Revoked', desc: 'The production API key for "Web-Client-Alpha" has been manually revoked.', type: 'warning', time: 'Oct 22, 2023 • 11:45 PM', read: true, category: 'Security' },
  { id: '5', title: 'Member Joined', desc: 'Sarah Chen has joined the workspace as a Senior Developer.', type: 'success', time: 'Oct 21, 2023 • 04:20 PM', read: true, category: 'Team' },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [filter, setFilter] = useState<'all' | 'unread' | 'security'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 100% Reliable Sound Engine using Web Audio API
  const playSynthesizedSound = useCallback((type: 'success' | 'delete') => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'success') {
            // High pitch short pop
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } else {
            // Lower pitch woosh
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        }
    } catch (e) {
        console.error('Audio synthesis failed', e);
    }
  }, [])

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           n.desc.toLowerCase().includes(searchQuery.toLowerCase())
      
      if (filter === 'unread') return matchesSearch && !n.read
      if (filter === 'security') return matchesSearch && n.category === 'Security'
      return matchesSearch
    })
  }, [notifications, filter, searchQuery])

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    playSynthesizedSound('success')
    toast.success('All notifications marked as read')
  }

  const handleClearHistory = () => {
    if (!confirm('Clear all history?')) return
    setNotifications([])
    playSynthesizedSound('delete')
    toast.error('History cleared')
  }

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    playSynthesizedSound('delete')
    toast.success('Log entry deleted')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tightest text-white mb-2">Notification Center</h1>
          <p className="text-white/40 text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Bell className="w-3.5 h-3.5" /> Workspace Activity Log
          </p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleMarkAllRead}
             disabled={notifications.length === 0}
             className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed flex items-center gap-2"
           >
              <Volume2 className="w-3 h-3 text-brand-500" />
              Mark all as read
           </button>
           <button 
             onClick={handleClearHistory}
             disabled={notifications.length === 0}
             className="px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-20 disabled:cursor-not-allowed"
           >
              Clear History
           </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 space-y-2">
           {[
             { label: 'All Activity', id: 'all', icon: Bell },
             { label: 'Unread Only', id: 'unread', icon: AlertCircle },
             { label: 'Security Alerts', id: 'security', icon: Trash2 },
           ].map((item) => (
             <button 
               key={item.id}
               onClick={() => setFilter(item.id as any)}
               className={cn(
                 "w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                 filter === item.id ? "bg-white text-surface-950 shadow-xl shadow-white/5" : "text-white/40 hover:bg-white/5 hover:text-white"
               )}
             >
               <div className="flex items-center gap-3">
                 <item.icon className="w-4 h-4" />
                 {item.label}
               </div>
             </button>
           ))}
        </aside>

        {/* Notifications List */}
        <div className="flex-1 space-y-4">
           <div className="relative mb-8">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                type="text" 
                placeholder="Search logs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm font-bold text-white focus:outline-none focus:border-brand-600 transition-all placeholder:text-white/10"
              />
           </div>

           <div className="space-y-4 min-h-[400px]">
             <AnimatePresence mode="popLayout">
               {filteredNotifications.length === 0 ? (
                 <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-white/20 uppercase tracking-[0.3em] font-black text-xs gap-4"
                 >
                    <MousePointer2 className="w-10 h-10 animate-bounce" />
                    No notifications found
                 </motion.div>
               ) : filteredNotifications.map((notif) => (
                 <motion.div 
                   layout
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   key={notif.id}
                   className={cn(
                     "p-1 rounded-[2.5rem] transition-all group",
                     !notif.read ? "bg-gradient-to-r from-brand-600/40 to-transparent shadow-[0_0_40px_-20px_rgba(139,92,246,0.3)]" : "bg-white/5 border border-white/10"
                   )}
                 >
                   <div className="bg-surface-900/60 backdrop-blur-xl rounded-[2.3rem] p-8 flex items-start gap-6">
                     <div className={cn(
                       "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg",
                       notif.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-500" :
                       notif.type === 'warning' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                       "bg-blue-500/10 border-blue-500/20 text-blue-500"
                     )}>
                       {notif.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : 
                        notif.type === 'warning' ? <AlertCircle className="w-6 h-6" /> : 
                        <Info className="w-6 h-6" />}
                     </div>
                     
                     <div className="flex-1">
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-black text-white">{notif.title}</h3>
                            <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-white/30">
                              {notif.category}
                            </span>
                            {!notif.read && <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />}
                          </div>
                          <div className="flex items-center gap-2 text-white/20">
                             <Calendar className="w-3.5 h-3.5" />
                             <span className="text-[10px] font-bold">{notif.time}</span>
                          </div>
                       </div>
                       <p className="text-sm font-bold text-white/40 leading-relaxed max-w-2xl">
                         {notif.desc}
                       </p>
                     </div>

                     <button 
                       onClick={() => handleDelete(notif.id)}
                       className="opacity-0 group-hover:opacity-100 transition-opacity p-3 hover:bg-white/5 rounded-xl text-white/20 hover:text-red-500"
                     >
                        <Trash2 className="w-5 h-5" />
                     </button>
                   </div>
                 </motion.div>
               ))}
             </AnimatePresence>
           </div>
        </div>
      </div>
    </div>
  )
}
