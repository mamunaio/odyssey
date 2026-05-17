'use client'
import { useState, useEffect } from 'react'
import { 
  Search, MessageSquare, Calendar, BookOpen, ChevronDown, ChevronUp, 
  Send, Loader2, LifeBuoy, AlertCircle, CheckCircle2, ShieldAlert, 
  ArrowRight, ExternalLink, Globe, Check
} from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

// Pre-defined FAQ Knowledge Base Data
const FAQ_KNOWLEDGE_BASE = [
  {
    id: 'faq-1',
    category: 'Billing',
    question: 'How do I upgrade my plan and what are the limits?',
    answer: 'You can navigate to the Billing tab in the sidebar. We offer Pro ($79/mo) and Enterprise ($249/mo) plans. Upgrading immediately unlocks higher team limits, SAML SSO integrations, and larger cloud storage allocations for your entire workspace.'
  },
  {
    id: 'faq-2',
    category: 'Members',
    question: 'How can I invite new members and configure their roles?',
    answer: 'Visit the Members tab in the sidebar and click "Invite Member". Enter their email address and assign them a Role (Admin, Member, or Viewer). An invitation email will be dispatched immediately containing a secure link to register.'
  },
  {
    id: 'faq-3',
    category: 'SSO',
    question: 'Can I connect multiple Google or GitHub SSO accounts?',
    answer: 'Yes! Inside your My Profile settings, you can connect or disconnect Google, GitHub, or Discord identity providers. These linked SSO accounts allow secure, passwordless one-click authentication.'
  },
  {
    id: 'faq-4',
    category: 'Security',
    question: 'How do I revoke an active browser session?',
    answer: 'In the Security Shield section on your Profile settings page, you can see all active browser sessions (IP, OS, Location). Simply click "Revoke Access" next to any device to instantly invalidate its authentication token.'
  },
  {
    id: 'faq-5',
    category: 'Workspace',
    question: 'What is the Sound Notifications suite?',
    answer: 'Under Workspace Settings, we have integrated a custom Web Audio synthesizer that plays alert previews (Success Chimes & Warning alerts). You can toggle sound preferences globally for your workspace activities.'
  }
]

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null)
  
  // Dynamic Call Booking states
  const [bookingTime, setBookingTime] = useState<string | null>(null)
  const [isBooking, setIsBooking] = useState(false)
  const [bookedSlot, setBookedSlot] = useState<string | null>(null)
  const [callSlots, setCallSlots] = useState([
    { id: 't1', time: '02:30 PM today', available: true },
    { id: 't2', time: '04:00 PM today', available: true },
    { id: 't3', time: '10:00 AM tomorrow', available: true },
    { id: 't4', time: '11:30 AM tomorrow', available: false }
  ])

  // Support Ticket Form state
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [ticketSubmitting, setTicketSubmitting] = useState(false)
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketCategory, setTicketCategory] = useState('Billing & Subscriptions')
  const [ticketSeverity, setTicketSeverity] = useState('Standard Inquiry')
  const [ticketDescription, setTicketDescription] = useState('')

  // Live Help Tickets log database
  const [tickets, setTickets] = useState([
    { id: 'TKT-2041', subject: 'SAML SSO Certificate verification error', category: 'Security & SSO', severity: 'High Severity', status: 'Under Review', time: '2 hours ago' },
    { id: 'TKT-2039', subject: 'Downgrade refund query for Starter plan', category: 'Billing & Subscriptions', severity: 'Standard Inquiry', status: 'Resolved', time: '3 days ago' }
  ])

  // Filtered FAQs based on query
  const filteredFaqs = FAQ_KNOWLEDGE_BASE.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Tone Synthesis preview when ticket is submitted
  const playSynthesizedChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      
      const now = ctx.currentTime
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gainNode = ctx.createGain()

      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(523.25, now) // C5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15) // A5

      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(659.25, now) // E5
      osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15) // C6

      gainNode.gain.setValueAtTime(0.15, now)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4)

      osc1.connect(gainNode)
      osc2.connect(gainNode)
      gainNode.connect(ctx.destination)

      osc1.start(now)
      osc2.start(now)
      osc1.stop(now + 0.45)
      osc2.stop(now + 0.45)
    } catch (e) {
      console.warn('Web Audio Context not loaded', e)
    }
  }

  // Handle Call Slot Booking
  const handleBookCall = (slotId: string, time: string) => {
    setIsBooking(true)
    setTimeout(() => {
      setBookedSlot(time)
      setCallSlots(prev => prev.map(s => s.id === slotId ? { ...s, available: false } : s))
      setIsBooking(false)
      playSynthesizedChime()
      toast.success(`Success! Expert Consultation call confirmed for ${time}. Check your calendar invite.`, {
        duration: 4000,
        style: {
          border: '1px solid rgba(16, 185, 129, 0.2)',
          background: '#09090b',
          color: '#fff',
        }
      })
    }, 1200)
  }

  // Handle Ticket Form Submission
  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketSubject || !ticketDescription) {
      toast.error('Please enter a ticket subject and description.')
      return
    }

    setTicketSubmitting(true)
    setTimeout(() => {
      const newTicketId = `TKT-${Math.floor(1000 + Math.random() * 9000)}`
      const newTicket = {
        id: newTicketId,
        subject: ticketSubject,
        category: ticketCategory,
        severity: ticketSeverity,
        status: 'Pending Response',
        time: 'Just now'
      }

      setTickets(prev => [newTicket, ...prev])
      setTicketSubject('')
      setTicketDescription('')
      setShowTicketForm(false)
      setTicketSubmitting(false)
      playSynthesizedChime()

      toast.success(`Ticket ${newTicketId} provisioned successfully! Support engineers have been alerted.`, {
        duration: 4500,
        style: {
          border: '1px solid rgba(139, 92, 246, 0.2)',
          background: '#09090b',
          color: '#fff',
        }
      })
    }, 1500)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24 text-surface-950 dark:text-white">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tightest text-surface-950 dark:text-white mb-2">Support & Help</h1>
          <p className="text-surface-500 dark:text-white/40 text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <LifeBuoy className="w-3.5 h-3.5" /> 24/7 Enterprise Assistance
          </p>
        </div>
      </div>

      {/* Dynamic Search knowledge Base Input */}
      <div className="p-1 rounded-[2.5rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
        <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="max-w-md space-y-2">
            <h2 className="text-2xl font-black text-surface-950 dark:text-white leading-tight">Need immediate troubleshooting?</h2>
            <p className="text-surface-500 dark:text-white/45 text-xs font-bold leading-relaxed">
              Search FAQ guides to immediately resolve SSO, billing, role permissions, or session revocation issues.
            </p>
          </div>
          <div className="w-full md:max-w-md relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-surface-400 dark:text-white/20 group-focus-within:text-brand-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search SSO keys, invoice billings, invite roles..."
              className="w-full bg-surface-100 dark:bg-white/5 border-2 border-surface-200 dark:border-white/10 rounded-2xl px-6 py-4 pl-13 focus:border-brand-600 focus:outline-none transition-all font-bold text-surface-950 dark:text-white focus:bg-white/50 dark:focus:bg-white/[0.07] shadow-inner placeholder:text-surface-400 dark:placeholder:text-white/20"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Quick Assistance 3-Card Deck */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Submit Ticket Card */}
        <div className="p-1 rounded-[2.2rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl hover:border-brand-500/30 transition-all duration-300 relative overflow-hidden group">
          <div className="bg-white dark:bg-surface-900/40 rounded-[2rem] p-8 flex flex-col h-full">
            <div className="w-12 h-12 rounded-2xl bg-brand-600/10 border border-brand-600/20 text-brand-500 flex items-center justify-center mb-6">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-surface-950 dark:text-white mb-2 group-hover:text-brand-500 transition-colors">Submit Support Ticket</h3>
            <p className="text-surface-500 dark:text-white/40 text-xs font-bold leading-relaxed mb-6 flex-1">
              Direct connection with our technical engineering team. Typical response time is under 15 minutes.
            </p>
            <button 
              onClick={() => {
                setShowTicketForm(!showTicketForm)
                if(!showTicketForm) {
                  // scroll down smoothly to form
                  setTimeout(() => {
                    document.getElementById('ticket-form-panel')?.scrollIntoView({ behavior: 'smooth' })
                  }, 100)
                }
              }}
              className="w-full py-4 rounded-xl bg-surface-950 dark:bg-white text-white dark:text-surface-950 text-[10px] font-black uppercase tracking-widest hover:bg-brand-600 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              {showTicketForm ? 'Close Ticket Form' : 'Open Ticket Form'} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Book Call Card */}
        <div className="p-1 rounded-[2.2rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden group">
          <div className="bg-white dark:bg-surface-900/40 rounded-[2rem] p-8 flex flex-col h-full">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-surface-950 dark:text-white mb-2 group-hover:text-indigo-400 transition-colors">Book Expert Session</h3>
            <p className="text-surface-500 dark:text-white/40 text-xs font-bold leading-relaxed mb-6 flex-1">
              Schedule a 15-minute screen share with an engineer for high-touch enterprise deployment support.
            </p>
            <div className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-2.5 rounded-xl uppercase tracking-wider text-center">
              {bookedSlot ? `Booked: ${bookedSlot}` : '📅 3 slots available today'}
            </div>
          </div>
        </div>

        {/* Documentation Card */}
        <div className="p-1 rounded-[2.2rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden group">
          <div className="bg-white dark:bg-surface-900/40 rounded-[2rem] p-8 flex flex-col h-full">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-black text-surface-950 dark:text-white mb-2 group-hover:text-emerald-400 transition-colors">Odyssey Knowledge Base</h3>
            <p className="text-surface-500 dark:text-white/40 text-xs font-bold leading-relaxed mb-6 flex-1">
              Explore step-by-step guides for custom webhook triggers, Slack maps, SAML setups, and billing cycles.
            </p>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-full py-4 rounded-xl bg-surface-100 dark:bg-white/5 border border-surface-200 dark:border-white/10 text-surface-600 dark:text-white/70 hover:bg-surface-200 dark:hover:bg-white/10 hover:text-surface-950 dark:hover:text-white transition-all text-center text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5"
            >
              Explore API Guides <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>

      {/* Book Call Time slots selection panel (if slots open) */}
      {!bookedSlot && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-1 rounded-[2.5rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] p-8 md:p-10 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-surface-950 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-500" /> Select Expert Consultation Slot
            </h3>
            <div className="w-full h-px bg-surface-200 dark:bg-white/5" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {callSlots.map((s) => (
                <button
                  key={s.id}
                  disabled={!s.available || isBooking}
                  onClick={() => handleBookCall(s.id, s.time)}
                  className={cn(
                    "p-5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[100px]",
                    s.available 
                      ? "bg-surface-50 dark:bg-white/[0.02] border-surface-200 dark:border-white/10 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/[0.02] cursor-pointer group/slot" 
                      : "bg-surface-100 dark:bg-white/[0.01] border-surface-100 dark:border-white/5 text-surface-400 dark:text-white/20 cursor-not-allowed"
                  )}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-surface-400 dark:text-white/30 group-hover/slot:text-indigo-400">
                    Slot {s.id.toUpperCase()}
                  </span>
                  <div className="text-xs font-black text-surface-950 dark:text-white mt-2">
                    {s.time}
                  </div>
                  <div className={cn(
                    "text-[8px] font-black uppercase tracking-widest mt-3 px-2 py-0.5 rounded border self-start",
                    s.available 
                      ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-500" 
                      : "bg-surface-100 dark:bg-white/5 border-surface-200 dark:border-white/5 text-surface-400 dark:text-white/20"
                  )}>
                    {s.available ? 'Available' : 'Reserved'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* ================= SUPPORT TICKET SUBMISSION FORM ================= */}
      <AnimatePresence>
        {showTicketForm && (
          <motion.div 
            id="ticket-form-panel"
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: 20 }}
            transition={{ duration: 0.35 }}
            className="p-1 rounded-[2.5rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl relative overflow-hidden"
          >
            <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] p-8 md:p-10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-surface-950 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-brand-500" /> Submit Help Ticket to Odyssey Engineering
                </h3>
                <span className="text-[9px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-500 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20 animate-pulse">
                  Direct Line
                </span>
              </div>
              <div className="w-full h-px bg-surface-200 dark:bg-white/5" />

              <form onSubmit={handleTicketSubmit} className="space-y-6">
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Category Dropdown */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 dark:text-white/40 mb-3">Category</label>
                    <select 
                      className="w-full bg-surface-50 dark:bg-surface-950/80 border-2 border-surface-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:border-brand-600 focus:outline-none transition-all font-bold text-surface-950 dark:text-white cursor-pointer"
                      value={ticketCategory}
                      onChange={e => setTicketCategory(e.target.value)}
                    >
                      <option className="bg-white dark:bg-surface-950 text-surface-950 dark:text-white" value="Workspace Roles & invites">Workspace Roles & invites</option>
                      <option className="bg-white dark:bg-surface-950 text-surface-950 dark:text-white" value="API & Webhook Integrations">API & Webhook Integrations</option>
                    </select>
                  </div>

                  {/* Severity Tier */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 dark:text-white/40 mb-3">Severity Level</label>
                    <select 
                      className="w-full bg-surface-50 dark:bg-surface-950/80 border-2 border-surface-200 dark:border-white/10 rounded-2xl px-5 py-4 focus:border-brand-600 focus:outline-none transition-all font-bold text-surface-950 dark:text-white cursor-pointer"
                      value={ticketSeverity}
                      onChange={e => setTicketSeverity(e.target.value)}
                    >
                      <option className="bg-white dark:bg-surface-950 text-surface-950 dark:text-white" value="Standard Inquiry">Standard Inquiry</option>
                      <option className="bg-white dark:bg-surface-950 text-amber-600 dark:text-amber-500 font-bold" value="High Severity">High Severity</option>
                      <option className="bg-white dark:bg-surface-950 text-red-600 dark:text-red-500 font-black animate-pulse" value="Critical Production Down">Critical Production Down</option>
                    </select>
                  </div>

                  {/* Subject Input */}
                  <div className="md:col-span-1">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 dark:text-white/40 mb-3">Ticket Subject</label>
                    <input 
                      type="text"
                      placeholder="e.g. Card charge declined on Pro"
                      className="w-full bg-surface-50 dark:bg-white/5 border-2 border-surface-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:border-brand-600 focus:outline-none transition-all font-bold text-surface-950 dark:text-white focus:bg-white/50 dark:focus:bg-white/[0.07] shadow-inner placeholder:text-surface-400 dark:placeholder:text-white/20"
                      value={ticketSubject}
                      onChange={e => setTicketSubject(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Description Textarea */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 dark:text-white/40 mb-3">Issue Details & System Environment</label>
                  <textarea 
                    rows={4}
                    placeholder="Briefly explain the issue, error messages displayed, and browser platform if applicable..."
                    className="w-full bg-surface-50 dark:bg-white/5 border-2 border-surface-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:border-brand-600 focus:outline-none transition-all font-bold text-surface-950 dark:text-white focus:bg-white/50 dark:focus:bg-white/[0.07] shadow-inner placeholder:text-surface-400 dark:placeholder:text-white/20 resize-none"
                    value={ticketDescription}
                    onChange={e => setTicketDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowTicketForm(false)}
                    className="px-6 py-4 rounded-xl bg-surface-100 dark:bg-white/5 border border-surface-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-surface-600 dark:text-white/60 hover:bg-surface-200 dark:hover:bg-white/10 hover:text-surface-950 dark:hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={ticketSubmitting}
                    className="bg-surface-950 dark:bg-white text-white dark:text-surface-950 px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-600 hover:text-white transition-all flex items-center gap-2 active:scale-95 duration-200"
                  >
                    {ticketSubmitting ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Provisioning Ticket...</>
                    ) : (
                      <><Send className="w-3.5 h-3.5" /> Submit Support Ticket</>
                    )}
                  </button>
                </div>

              </form>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= DYNAMIC SEARCH KNOWLEDGE FAQ HUB ================= */}
      <div className="p-1 rounded-[2.5rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
        <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] p-8 md:p-10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-surface-950 dark:text-white flex items-center gap-2">
              <LifeBuoy className="w-5 h-5 text-brand-500" /> Frequently Answered FAQ Guides
            </h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {filteredFaqs.length} Guides Found
            </span>
          </div>
          <div className="w-full h-px bg-surface-200 dark:bg-white/5" />

          {/* Accordion Hub items */}
          <div className="space-y-4 pt-2">
            <AnimatePresence mode="popLayout">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => {
                  const isExpanded = expandedFaqId === faq.id
                  return (
                    <motion.div
                      layout
                      key={faq.id}
                      transition={{ duration: 0.25 }}
                      className={cn(
                        "rounded-2xl border transition-all duration-300 overflow-hidden",
                        isExpanded 
                          ? "bg-brand-600/5 border-brand-600/20 shadow-[0_0_15px_rgba(139,92,246,0.03)]" 
                          : "bg-surface-50 dark:bg-white/[0.01] border-surface-200 dark:border-white/5 hover:border-surface-300 dark:hover:border-white/10"
                      )}
                    >
                      {/* Accordion Header */}
                      <button
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 select-none focus:outline-none"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-[8px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20 shrink-0">
                            {faq.category}
                          </span>
                          <h4 className="text-sm font-black text-surface-950 dark:text-white leading-relaxed">{faq.question}</h4>
                        </div>
                        <div className="text-surface-500 dark:text-white/40">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {/* Accordion content body */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                          >
                            <div className="px-5 pb-5 pt-1 text-xs font-bold leading-relaxed text-surface-500 dark:text-white/50 border-t border-surface-200 dark:border-white/5">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </motion.div>
                  )
                })
              ) : (
                <div className="py-12 text-center text-surface-400 dark:text-white/20 font-black uppercase tracking-widest text-xs flex flex-col items-center justify-center gap-2">
                  <AlertCircle className="w-8 h-8 text-surface-300 dark:text-white/10 mb-2" />
                  No FAQ guides matching your query
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* ================= PERSONAL HELP TICKETS LOGS STREAM ================= */}
      <div className="p-1 rounded-[2.5rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
        <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] p-8 md:p-10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-surface-950 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-brand-500" /> Personal Support Ticket Audit Log
            </h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-600 dark:text-brand-500 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20 animate-pulse">
              Sync Active
            </span>
          </div>
          <div className="w-full h-px bg-surface-200 dark:bg-white/5" />

          {/* Ticket stream items */}
          <div className="space-y-4 pt-2">
            <AnimatePresence mode="popLayout">
              {tickets.map((t) => (
                <motion.div
                  layout
                  key={t.id}
                  initial={{ opacity: 0, y: -15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden",
                    t.status === 'Pending Response'
                      ? "bg-amber-500/5 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.04)] animate-pulse"
                      : "bg-surface-50 dark:bg-white/[0.01] border-surface-200 dark:border-white/5 hover:border-surface-300 dark:hover:border-white/10"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border text-[10px] font-black",
                      t.status === 'Pending Response'
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-500"
                        : t.status === 'Under Review'
                          ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                          : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    )}>
                      {t.status === 'Resolved' ? <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <MessageSquare className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-black text-surface-400 dark:text-white/30 uppercase tracking-widest">{t.id}</span>
                        <span className="text-surface-300 dark:text-white/20">•</span>
                        <span className="text-[9px] font-black text-surface-500 dark:text-white/40 uppercase tracking-widest bg-surface-100 dark:bg-white/5 px-2 py-0.5 rounded border border-surface-200 dark:border-white/10">
                          {t.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-surface-950 dark:text-white mt-1.5">{t.subject}</h4>
                      
                      <div className="flex items-center gap-3 mt-2 text-[10px] font-bold text-surface-500 dark:text-white/30">
                        <span className={cn(
                          t.severity === 'Critical Production Down' ? 'text-red-600 dark:text-red-500' : t.severity === 'High Severity' ? 'text-amber-600 dark:text-amber-500' : 'text-surface-400 dark:text-white/30'
                        )}>
                          Severity: {t.severity}
                        </span>
                        <span>•</span>
                        <span>Created: {t.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 self-start sm:self-center">
                    <div className={cn(
                      "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all",
                      t.status === 'Pending Response'
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                        : t.status === 'Under Review'
                          ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                          : "bg-green-500/10 border-green-500/20 text-green-500"
                    )}>
                      {t.status}
                    </div>
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
