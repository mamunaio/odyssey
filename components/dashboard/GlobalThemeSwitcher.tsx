'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import ThemeSwitcher from './ThemeSwitcher'
import { motion, AnimatePresence } from 'framer-motion'

export default function GlobalThemeSwitcher() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-6 right-6 z-[9999] w-64 p-1.5 rounded-[2rem] bg-white/80 dark:bg-surface-900/80 border border-surface-200/80 dark:border-surface-800/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-300"
      >
        <ThemeSwitcher />
      </motion.div>
    </AnimatePresence>
  )
}
