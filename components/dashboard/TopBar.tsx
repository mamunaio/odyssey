'use client'
import { useState, useEffect, useCallback } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { Bell, ChevronDown, LogOut, User, Settings, Search, Command, CheckCircle2, AlertCircle, Info, Zap, Menu } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

import useSWR from 'swr'

interface TopBarProps {
  user: { name?: string; email?: string; image?: string }
  onMenuClick?: () => void
}

interface Notification {
  id: string
  title: string
  desc: string
  type: 'success' | 'warning' | 'info'
  time: string
  read: boolean
}

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(d => d.data)

export default function TopBar({ user }: TopBarProps) {
  const { data: tenant } = useSWR('/api/tenant', fetcher)
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', title: 'System Update', desc: 'Odyssey v2.4 is now live with better RLS.', type: 'info', time: '2m ago', read: false },
    { id: '2', title: 'Security Alert', desc: 'New login detected from Tokyo, Japan.', type: 'warning', time: '1h ago', read: false },
  ])
  const [unreadCount, setUnreadCount] = useState(2)
  const [bellShake, setBellShake] = useState(false)

  const playSound = useCallback(() => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
    audio.volume = 0.5
    audio.play().catch(e => console.log('Sound blocked by browser interaction policy'))
  }, [])

  const addNotification = useCallback((notif: Omit<Notification, 'id' | 'read' | 'time'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      read: false,
      time: 'Just now'
    }
    setNotifications(prev => [newNotif, ...prev])
    setUnreadCount(prev => prev + 1)
    setBellShake(true)
    playSound()
    
    toast.custom((t) => (
      <div className={cn(
        "max-w-md w-full bg-surface-900 border border-white/10 shadow-2xl rounded-2xl p-4 pointer-events-auto flex items-start gap-4 animate-in slide-in-from-right-full duration-500",
        t.visible ? "opacity-100" : "opacity-0"
      )}>
        <div className="w-10 h-10 rounded-xl bg-brand-600/10 flex items-center justify-center shrink-0 border border-brand-600/20">
          <Bell className="w-5 h-5 text-brand-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-black text-white">{newNotif.title}</p>
          <p className="text-xs font-bold text-white/40 mt-1">{newNotif.desc}</p>
        </div>
        <button onClick={() => toast.dismiss(t.id)} className="text-white/20 hover:text-white transition-colors">
           <Zap className="w-4 h-4 rotate-45" />
        </button>
      </div>
    ), { duration: 5000, position: 'top-right' })

    setTimeout(() => setBellShake(false), 500)
  }, [playSound])

  // Simulate a real-time notification after 5 seconds for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      addNotification({
        title: 'Deployment Success',
        desc: 'Workspace "Odyssey-Core" is fully provisioned.',
        type: 'success'
      })
    }, 8000)
    return () => clearTimeout(timer)
  }, [addNotification])

  const markAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  return (
    <header className="h-20 bg-white/40 dark:bg-surface-950/40 backdrop-blur-3xl border-b border-surface-200/50 dark:border-white/5 flex items-center justify-between px-4 md:px-10 shrink-0 z-30 sticky top-0 transition-colors duration-300">
      <div className="flex items-center gap-4 flex-1">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2.5 rounded-xl bg-surface-100 dark:bg-white/5 border border-surface-200 dark:border-white/10 text-surface-600 dark:text-white/60 hover:text-surface-950 dark:hover:text-white transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="relative max-w-lg w-full group hidden sm:block">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-surface-400 dark:text-white/20 group-focus-within:text-brand-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search resources, members or settings..." 
            className="w-full bg-surface-100 dark:bg-white/[0.03] border border-surface-200 dark:border-white/5 rounded-2xl py-3 pl-14 pr-14 text-sm font-bold text-surface-950 dark:text-white focus:outline-none focus:border-brand-600 focus:bg-white dark:focus:bg-white/[0.05] transition-all placeholder:text-surface-400 dark:placeholder:text-white/20 shadow-inner"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-200 dark:bg-white/5 border border-surface-300 dark:border-white/10 text-[10px] font-black text-surface-400 dark:text-white/30 uppercase tracking-tighter">
            <Command className="w-3 h-3" /> K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <DropdownMenu.Root onOpenChange={(open) => open && markAsRead()}>
          <DropdownMenu.Trigger asChild>
            <button className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-surface-100 dark:bg-white/5 border border-surface-200 dark:border-white/10 hover:bg-surface-200 dark:hover:bg-white/10 text-surface-600 dark:text-white/60 hover:text-surface-950 dark:hover:text-white transition-all outline-none cursor-pointer">
              <motion.div animate={bellShake ? { rotate: [0, 15, -15, 15, -15, 0] } : {}}>
                <Bell className="w-5 h-5" />
              </motion.div>
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-brand-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
              )}
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className="w-80 bg-white dark:bg-surface-900 border border-surface-200 dark:border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in duration-200 mt-2" align="end">
              <div className="px-4 py-3 border-b border-surface-100 dark:border-white/5 mb-2 flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-widest text-surface-950 dark:text-white">Notifications</p>
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              </div>
              
              <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
                {notifications.map(notif => (
                  <DropdownMenu.Item key={notif.id} className="flex gap-4 p-3 rounded-xl hover:bg-surface-100 dark:hover:bg-white/5 cursor-pointer outline-none transition-all group">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                      notif.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-500" :
                      notif.type === 'warning' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                      "bg-blue-500/10 border-blue-500/20 text-blue-500"
                    )}>
                      {notif.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : 
                       notif.type === 'warning' ? <AlertCircle className="w-5 h-5" /> : 
                       <Info className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-black text-surface-950 dark:text-white truncate">{notif.title}</p>
                        <span className="text-[9px] font-bold text-surface-400 dark:text-white/20 whitespace-nowrap">{notif.time}</span>
                      </div>
                      <p className="text-[10px] font-bold text-surface-500 dark:text-white/40 mt-0.5 leading-relaxed truncate">{notif.desc}</p>
                    </div>
                  </DropdownMenu.Item>
                ))}
              </div>

              <DropdownMenu.Separator className="my-2 border-t border-surface-100 dark:border-white/5" />
              <Link href="/dashboard/notifications" className="block w-full">
                <button className="w-full py-2.5 text-[10px] font-black uppercase tracking-widest text-brand-500 hover:text-brand-600 transition-colors cursor-pointer">
                  View all notifications
                </button>
              </Link>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <div className="w-px h-6 bg-surface-200 dark:bg-white/10" />

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-4 pl-1 pr-1 py-1 rounded-2xl hover:bg-surface-100 dark:hover:bg-white/5 transition-all outline-none group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-600 flex items-center justify-center text-xs font-black text-white shadow-lg">
                {user.name?.[0]?.toUpperCase() ?? 'O'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-black text-surface-950 dark:text-white leading-none">{user.name}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-surface-400 dark:text-white/40 mt-1 leading-none">
                  {tenant?.plan ? `${tenant.plan} Plan` : '...'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-surface-400 dark:text-white/40 group-hover:text-surface-900 dark:group-hover:text-white transition-colors" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content className="w-64 bg-white dark:bg-surface-900 border border-surface-200 dark:border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in duration-200 mt-2" align="end">
              <div className="px-4 py-4 border-b border-surface-100 dark:border-white/5 mb-2 bg-surface-50 dark:bg-white/5 rounded-xl">
                <p className="text-sm font-black text-surface-950 dark:text-white">{user.name}</p>
                <p className="text-[10px] font-bold text-surface-400 dark:text-white/40 mt-1 truncate uppercase tracking-widest">{user.email}</p>
              </div>
              
              <Link href="/dashboard/profile">
                <DropdownMenu.Item className="flex items-center gap-3 px-3 py-3 text-xs font-black uppercase tracking-wider text-surface-600 dark:text-white/60 hover:bg-surface-100 dark:hover:bg-white/5 hover:text-surface-950 dark:hover:text-white rounded-xl cursor-pointer outline-none transition-all">
                  <User className="w-4 h-4 text-brand-500" /> Account Settings
                </DropdownMenu.Item>
              </Link>
              <DropdownMenu.Item className="flex items-center gap-3 px-3 py-3 text-xs font-black uppercase tracking-wider text-surface-600 dark:text-white/60 hover:bg-surface-100 dark:hover:bg-white/5 hover:text-surface-950 dark:hover:text-white rounded-xl cursor-pointer outline-none transition-all">
                <Settings className="w-4 h-4 text-brand-500" /> Workspace Config
              </DropdownMenu.Item>
              
              <DropdownMenu.Separator className="my-2 border-t border-surface-100 dark:border-white/5" />
              
              <DropdownMenu.Item
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex items-center gap-3 px-3 py-3 text-xs font-black uppercase tracking-wider text-red-500 hover:bg-red-500/10 rounded-xl cursor-pointer outline-none transition-all">
                <LogOut className="w-4 h-4" /> Sign Out from Odyssey
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  )
}
