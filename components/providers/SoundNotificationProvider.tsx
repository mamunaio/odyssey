'use client'
import { useEffect, useRef } from 'react'
import { useToasterStore } from 'react-hot-toast'

export default function SoundNotificationProvider() {
  const { toasts } = useToasterStore()
  const prevToastsLength = useRef(0)

  useEffect(() => {
    // Only trigger sound if the toast count increased (a new notification was added)
    if (toasts.length > prevToastsLength.current) {
      const latestToast = toasts[toasts.length - 1]
      
      // Check if sound notifications are enabled in localStorage (default to true)
      const soundEnabled = typeof window !== 'undefined' ? localStorage.getItem('odyssey_sound_enabled') !== 'false' : true
      
      if (soundEnabled) {
        // Play specific synthesized chime based on toast type
        if (latestToast.type === 'success') {
          playSynthesizedSound('success')
        } else if (latestToast.type === 'error') {
          playSynthesizedSound('error')
        }
      }
    }
    prevToastsLength.current = toasts.length
  }, [toasts])

  const playSynthesizedSound = (type: 'success' | 'error') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return
      
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)

      if (type === 'success') {
        // High-end premium double-chime (Odyssey Signature Chime)
        osc.type = 'sine'
        // Tone 1
        osc.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
        // Tone 2 (E5) playing shortly after
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08) // E5
        // Tone 3 (G5) for an uplifting major triad resolution
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16) // G5
        
        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.04)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45)
        
        osc.start()
        osc.stop(ctx.currentTime + 0.45)
      } else {
        // Warning/Error sound (gentle double low tone alert)
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
      // AudioContext blocked or not supported
    }
  }

  return null
}
