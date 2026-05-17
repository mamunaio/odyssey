import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth/config'
import Sidebar from '@/components/dashboard/Sidebar'
import TopBar  from '@/components/dashboard/TopBar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  return (
    <div className="flex h-screen bg-surface-950 text-white overflow-hidden relative font-sans">
      <Sidebar user={session.user as unknown as { name?: string, email?: string, image?: string, role?: string, tenantId?: string }} />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar user={session.user as unknown as { name?: string, email?: string, image?: string, role?: string, tenantId?: string }} />
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
