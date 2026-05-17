'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function BackToTop() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | Window | null>(null)

  useEffect(() => {
    // Dynamic resolution of the scrollable container based on the active view
    const mainElement = document.querySelector('main')
    const container = mainElement ? mainElement : window
    setScrollContainer(container)

    const handleScroll = () => {
      const scrollY = mainElement ? mainElement.scrollTop : window.scrollY
      setIsVisible(scrollY > 300)
    }

    // Attach scroll listener to the resolved container
    container.addEventListener('scroll', handleScroll, { passive: true })
    
    // Trigger scroll detection immediately on mount/pathname change
    handleScroll()

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [pathname])

  const scrollToTop = () => {
    try {
      // Satisfying futuristic chime sound on tap
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (AudioContext) {
        const ctx = new AudioContext()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.frequency.setValueAtTime(600, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1)
        
        gain.gain.setValueAtTime(0.01, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1)
        
        osc.start()
        osc.stop(ctx.currentTime + 0.1)
      }
    } catch (e) {}

    // Trigger smooth scrolling based on current scrollable container type
    if (scrollContainer === window) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (scrollContainer) {
      (scrollContainer as HTMLElement).scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 15 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-24 right-6 z-[9998] w-12 h-12 rounded-full flex items-center justify-center bg-white/90 dark:bg-surface-900/90 border border-surface-200/80 dark:border-surface-800/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] text-brand-600 dark:text-white transition-all cursor-pointer focus:outline-none"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5 shrink-0" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
