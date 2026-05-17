'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

interface DashboardShellProps {
  children: React.ReactNode
  user: { name?: string; email?: string; image?: string; role?: string; tenantId?: string }
}

export default function DashboardShell({ children, user }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-white dark:bg-surface-950 text-surface-950 dark:text-white overflow-hidden relative font-sans transition-colors duration-300">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <Sidebar 
        user={user} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* TopBar */}
        <TopBar 
          user={user} 
          onMenuClick={() => setSidebarOpen(true)} 
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth relative">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-600/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
