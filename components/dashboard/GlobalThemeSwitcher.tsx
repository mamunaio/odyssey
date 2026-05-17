'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import ThemeSwitcher from './ThemeSwitcher'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme, Theme } from '@/components/providers/ThemeProvider'
import { Sun, Moon, Laptop } from 'lucide-react'

export default function GlobalThemeSwitcher() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const playToggleSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.frequency.setValueAtTime(440, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12)
      
      gain.gain.setValueAtTime(0.015, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.12)
      
      osc.start()
      osc.stop(ctx.currentTime + 0.12)
    } catch (e) {}
  }

  const cycleTheme = () => {
    playToggleSound()
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('system')
    else setTheme('light')
  }

  const ActiveIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Laptop

  return (
    <>
      {/* Desktop Floating Theme Switcher */}
      <div className="hidden sm:block fixed bottom-6 right-6 z-[9999]">
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-64 p-1.5 rounded-[2rem] bg-white/80 dark:bg-surface-900/80 border border-surface-200/80 dark:border-surface-800/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-300"
          >
            <ThemeSwitcher />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile Floating Theme Switcher (Mini Circular Button) */}
      <div className="block sm:hidden fixed bottom-6 right-6 z-[9999]">
        <AnimatePresence>
          <motion.button 
            onClick={cycleTheme}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/90 dark:bg-surface-900/90 border border-surface-200/80 dark:border-surface-800/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] text-brand-600 dark:text-white transition-all cursor-pointer focus:outline-none"
          >
            <ActiveIcon className="w-5 h-5 shrink-0 animate-fade-in" />
          </motion.button>
        </AnimatePresence>
      </div>
    </>
  )
}

