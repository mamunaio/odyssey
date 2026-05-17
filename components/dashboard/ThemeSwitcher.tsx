'use client'

import React from 'react'
import { Sun, Moon, Laptop } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme, Theme } from '@/components/providers/ThemeProvider'
import { cn } from '@/lib/utils'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const options: { key: Theme; label: string; icon: any }[] = [
    { key: 'light', label: 'Light', icon: Sun },
    { key: 'system', label: 'System', icon: Laptop },
    { key: 'dark', label: 'Dark', icon: Moon }
  ]

  const playToggleSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      // Soft, futuristic chime sound
      osc.frequency.setValueAtTime(440, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12)
      
      gain.gain.setValueAtTime(0.015, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.12)
      
      osc.start()
      osc.stop(ctx.currentTime + 0.12)
    } catch (e) {}
  }

  const handleSelect = (key: Theme) => {
    if (key === theme) return
    playToggleSound()
    setTheme(key)
  }

  return (
    <div className="w-full p-1 rounded-2xl bg-surface-100 dark:bg-surface-900/50 border border-surface-200/50 dark:border-surface-800/40 flex items-center justify-between gap-1 shadow-inner relative overflow-hidden">
      {options.map((opt) => {
        const isActive = theme === opt.key
        const Icon = opt.icon
        return (
          <button
            key={opt.key}
            onClick={() => handleSelect(opt.key)}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider relative flex items-center justify-center gap-2 transition-colors cursor-pointer focus:outline-none z-10",
              isActive 
                ? "text-brand-600 dark:text-white" 
                : "text-surface-500 hover:text-surface-900 dark:text-surface-400 dark:hover:text-white"
            )}
          >
            {/* Sliding background indicator */}
            {isActive && (
              <motion.div
                layoutId="active-theme-bg"
                className="absolute inset-0 bg-white dark:bg-surface-800 border border-surface-200/50 dark:border-surface-700/30 rounded-xl shadow-sm z-0"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            
            <Icon className="w-3.5 h-3.5 shrink-0 z-10" />
            <span className="text-[10px] hidden sm:inline z-10">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
