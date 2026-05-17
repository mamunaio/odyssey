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
import ThemeProvider from '@/components/providers/ThemeProvider'
import GlobalThemeSwitcher from '@/components/dashboard/GlobalThemeSwitcher'
import BackToTop from '@/components/shared/BackToTop'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bricolage.variable} scroll-smooth`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('theme') || 'system';
                const root = document.documentElement;
                root.classList.remove('light', 'dark');
                if (savedTheme === 'system') {
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  root.classList.add(systemTheme);
                } else {
                  root.classList.add(savedTheme);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased bg-white dark:bg-surface-950 text-surface-950 dark:text-white transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster position="top-right" />
          <SoundNotificationProvider />
          <GlobalThemeSwitcher />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
