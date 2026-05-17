'use client'
import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { UserPlus, Mail, MoreHorizontal, Shield, User, Clock, CheckCircle2, XCircle, Trash2, Edit3, UserMinus, Loader2, UserCheck } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(d => d.data)

export default function MembersPage() {
  const { data: members, isLoading, mutate } = useSWR('/api/users', fetcher)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole,  setInviteRole]  = useState<'admin'|'member'|'viewer'>('member')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [editingMember, setEditingMember] = useState<any>(null)
  const [sending, setSending] = useState(false)

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
            // Harmonic Chime (Chord Effect)
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            
            osc.type = 'sine';
            osc2.type = 'sine';
            
            osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
            osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
            
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            
            gain2.gain.setValueAtTime(0, ctx.currentTime);
            gain2.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
            gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            
            osc.start();
            osc2.start();
            osc.stop(ctx.currentTime + 0.4);
            osc2.stop(ctx.currentTime + 0.4);
        } else {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(300, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        }
    } catch (e) {}
  }, [])

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)

    const res  = await fetch('/api/invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
    })
    const data = await res.json()

    if (data.success) {
      playSynthesizedSound('success')
      toast.success('Invitation sent!')
      setShowInviteModal(false)
      setInviteEmail('')
    } else {
      toast.error(data.error)
    }
    setSending(false)
  }

  async function handleUpdateRole(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)

    try {
      const res = await fetch(`/api/users`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: editingMember._id, role: editingMember.role }),
      })
      const data = await res.json()

      if (data.success) {
        playSynthesizedSound('success')
        toast.success('Member role updated')
        mutate()
        setEditingMember(null)
      } else {
        throw new Error(data.error)
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSending(false)
    }
  }

  async function handleToggleStatus(userId: string, currentStatus: boolean) {
    const loadingToast = toast.loading('Updating status...')
    try {
      const res = await fetch(`/api/users`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive: !currentStatus }),
      })
      const data = await res.json()

      if (data.success) {
        playSynthesizedSound('success')
        toast.success(currentStatus ? 'User deactivated' : 'User activated', { id: loadingToast })
        mutate()
      } else {
        throw new Error(data.error)
      }
    } catch (err: any) {
      toast.error(err.message, { id: loadingToast })
    }
  }

  async function handleRemoveMember(userId: string) {
    if (!confirm('Are you absolutely sure you want to remove this member? This action cannot be undone.')) return

    const loadingToast = toast.loading('Removing member...')
    try {
      const res = await fetch(`/api/users?userId=${userId}`, {
        method: 'DELETE',
      })
      const data = await res.json()

      if (data.success) {
        playSynthesizedSound('delete')
        toast.success('Member removed from workspace', { id: loadingToast })
        mutate()
      } else {
        throw new Error(data.error)
      }
    } catch (err: any) {
      toast.error(err.message, { id: loadingToast })
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tightest text-surface-950 dark:text-white mb-2">Members</h1>
          <p className="text-surface-500 dark:text-white/40 text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <User className="w-3.5 h-3.5" /> {members?.length ?? 0} workspace members
          </p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)} 
          className="bg-surface-950 dark:bg-white text-white dark:text-surface-950 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-600 dark:hover:bg-brand-600 hover:text-white dark:hover:text-white transition-all shadow-xl flex items-center gap-3"
        >
          <UserPlus className="w-4 h-4" /> Invite New Member
        </button>
      </div>

      {/* Members Table Card */}
      <div className="p-1 rounded-[2.5rem] bg-surface-200/80 dark:bg-white/5 border border-surface-200 dark:border-white/10 shadow-2xl overflow-visible">
        <div className="bg-white dark:bg-surface-900/40 rounded-[2.3rem] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-50 dark:bg-white/5 border-b border-surface-100 dark:border-white/5">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 dark:text-white/40">Member Info</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 dark:text-white/40">Access Role</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 dark:text-white/40">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 dark:text-white/40">Joined On</th>
                <th className="px-8 py-5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 text-surface-400 dark:text-white/20 uppercase tracking-[0.3em] font-black text-xs">
                       <Clock className="w-8 h-8 animate-pulse" />
                       Loading workspace directory...
                    </div>
                  </td>
                </tr>
              ) : members?.map((member: any) => (
                <tr key={member._id} className={cn("hover:bg-surface-50 dark:hover:bg-white/[0.02] transition-colors group", !member.isActive && "opacity-60")}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-600 flex items-center justify-center text-xs font-black text-white shadow-lg">
                        {getInitials(member.name)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-surface-950 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-500 transition-colors">{member.name}</p>
                        <p className="text-[10px] font-bold text-surface-500 dark:text-white/30 uppercase tracking-widest mt-1">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-white/5 border border-surface-200 dark:border-white/10">
                       <Shield className="w-3 h-3 text-brand-600 dark:text-brand-500" />
                       <span className="text-[10px] font-black text-surface-950 dark:text-white uppercase tracking-widest">{member.role}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {member.isActive ? (
                      <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-surface-400 dark:text-white/20">
                        <XCircle className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Inactive</span>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-surface-500 dark:text-white/40">
                      {new Date(member.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right relative">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <button className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-white/5 hover:bg-surface-200 dark:hover:bg-white/10 flex items-center justify-center text-surface-950 dark:text-white/60 hover:text-brand-600 dark:hover:text-white transition-all outline-none">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Portal>
                        <DropdownMenu.Content 
                          className="z-[100] min-w-[200px] bg-white dark:bg-surface-900 border border-surface-200 dark:border-white/10 p-2 rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200"
                          sideOffset={5}
                          align="end"
                        >
                          <DropdownMenu.Item 
                            className="flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-surface-600 dark:text-white/60 hover:text-surface-950 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-white/5 rounded-xl outline-none cursor-pointer transition-all"
                            onClick={() => setEditingMember({ ...member })}
                          >
                            <Edit3 className="w-4 h-4 text-brand-600 dark:text-brand-500" />
                            Edit Permissions
                          </DropdownMenu.Item>
                          <DropdownMenu.Item 
                            className="flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-surface-600 dark:text-white/60 hover:text-surface-950 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-white/5 rounded-xl outline-none cursor-pointer transition-all"
                            onClick={() => handleToggleStatus(member._id, member.isActive)}
                          >
                            {member.isActive ? (
                                <><UserMinus className="w-4 h-4 text-amber-600 dark:text-amber-500" /> Deactivate User</>
                            ) : (
                                <><UserCheck className="w-4 h-4 text-green-600 dark:text-green-500" /> Activate User</>
                            )}
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator className="h-px bg-surface-200 dark:bg-white/5 my-2" />
                          <DropdownMenu.Item 
                            className="flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl outline-none cursor-pointer transition-all"
                            onClick={() => handleRemoveMember(member._id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove Member
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div 
            className="fixed inset-0 bg-surface-950/60 backdrop-blur-xl z-50 flex items-center justify-center p-6 cursor-pointer"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded-[3rem] bg-surface-100 dark:bg-white/10 border border-surface-200 dark:border-white/20 shadow-2xl w-full max-w-lg cursor-default"
            >
              <div className="bg-white dark:bg-surface-900 rounded-[2.8rem] p-10 md:p-12">
                <div className="mb-10 text-center">
                   <div className="w-16 h-16 rounded-3xl bg-brand-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-600/40">
                      <UserPlus className="w-8 h-8 text-white" />
                   </div>
                   <h2 className="text-3xl font-black text-surface-950 dark:text-white mb-2">Invite Collaborator</h2>
                   <p className="text-surface-500 dark:text-white/40 font-medium text-sm">Send a workspace invitation to your team.</p>
                </div>

                <form onSubmit={handleInvite} className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 dark:text-white/40 mb-3">Email address</label>
                    <input 
                      type="email" 
                      className="w-full bg-surface-50 dark:bg-white/5 border-2 border-surface-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:border-brand-600 focus:outline-none transition-all font-black text-surface-950 dark:text-white placeholder:text-surface-400 dark:placeholder:text-white/10" 
                      placeholder="teammate@odyssey.com"
                      value={inviteEmail} 
                      onChange={e => setInviteEmail(e.target.value)} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 dark:text-white/40 mb-3">Workspace Role</label>
                    <select 
                      className="w-full bg-surface-50 dark:bg-white/5 border-2 border-surface-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:border-brand-600 focus:outline-none transition-all font-black text-surface-950 dark:text-white appearance-none cursor-pointer"
                      value={inviteRole} 
                      onChange={e => setInviteRole(e.target.value as any)}
                    >
                      <option value="viewer" className="bg-white dark:bg-surface-950">Viewer — Read access only</option>
                      <option value="member" className="bg-white dark:bg-surface-950">Member — Edit access</option>
                      <option value="admin" className="bg-white dark:bg-surface-950">Admin — Full workspace access</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setShowInviteModal(false)} 
                      className="flex-1 py-5 rounded-2xl border-2 border-surface-200 dark:border-white/10 text-surface-700 dark:text-white font-black text-xs uppercase tracking-widest hover:bg-surface-100 dark:hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={sending} 
                      className="flex-1 bg-surface-950 dark:bg-white text-white dark:text-surface-950 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-600 dark:hover:bg-brand-600 hover:text-white dark:hover:text-white transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                      {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Mail className="w-4 h-4" /> Send Invitation</>}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Role Modal */}
      <AnimatePresence>
        {editingMember && (
          <div 
            className="fixed inset-0 bg-surface-950/60 backdrop-blur-xl z-50 flex items-center justify-center p-6 cursor-pointer"
            onClick={() => setEditingMember(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded-[3rem] bg-surface-100 dark:bg-white/10 border border-surface-200 dark:border-white/20 shadow-2xl w-full max-w-lg cursor-default"
            >
              <div className="bg-white dark:bg-surface-900 rounded-[2.8rem] p-10 md:p-12">
                <div className="mb-10 text-center">
                   <div className="w-16 h-16 rounded-3xl bg-brand-600/10 border border-brand-600/20 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                      <Shield className="w-8 h-8 text-brand-600 dark:text-brand-500" />
                   </div>
                   <h2 className="text-3xl font-black text-surface-950 dark:text-white mb-2">Adjust Permissions</h2>
                   <p className="text-surface-500 dark:text-white/40 font-medium text-sm">Modifying access for <span className="text-surface-950 dark:text-white font-bold">{editingMember.name}</span></p>
                </div>

                <form onSubmit={handleUpdateRole} className="space-y-8">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-surface-500 dark:text-white/40 mb-3">Select New Role</label>
                    <select 
                      className="w-full bg-surface-50 dark:bg-white/5 border-2 border-surface-200 dark:border-white/10 rounded-2xl px-6 py-4 focus:border-brand-600 focus:outline-none transition-all font-black text-surface-950 dark:text-white appearance-none cursor-pointer"
                      value={editingMember.role} 
                      onChange={e => setEditingMember({ ...editingMember, role: e.target.value })}
                    >
                      <option value="viewer" className="bg-white dark:bg-surface-950">Viewer — View only</option>
                      <option value="member" className="bg-white dark:bg-surface-950">Member — General access</option>
                      <option value="admin" className="bg-white dark:bg-surface-950">Admin — Full authority</option>
                      <option value="owner" className="bg-white dark:bg-surface-950">Owner — Root access</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setEditingMember(null)} 
                      className="flex-1 py-5 rounded-2xl border-2 border-surface-200 dark:border-white/10 text-surface-700 dark:text-white font-black text-xs uppercase tracking-widest hover:bg-surface-100 dark:hover:bg-white/5 transition-all"
                    >
                      Dismiss
                    </button>
                    <button 
                      type="submit" 
                      disabled={sending} 
                      className="flex-1 bg-surface-950 dark:bg-white text-white dark:text-surface-950 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-600 dark:hover:bg-brand-600 hover:text-white dark:hover:text-white transition-all shadow-xl flex items-center justify-center gap-3"
                    >
                      {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Apply Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
