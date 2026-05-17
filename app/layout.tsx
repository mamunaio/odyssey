import type { Metadata } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Odyssey',
    default: 'Odyssey — Multi-Tenant Business Platform',
  },
  description: 'The all-in-one platform for managing your business',
}

import AuthProvider from '@/components/providers/SessionProvider'
import SoundNotificationProvider from '@/components/providers/SoundNotificationProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={bricolage.variable}>
      <body className="font-sans antialiased bg-white dark:bg-surface-950 text-surface-950 dark:text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="top-right" />
        <SoundNotificationProvider />
      </body>
    </html>
  )
}
