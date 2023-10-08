import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'

import { api } from '@/utils/api'

import '@/styles/globals.css'
import TopBar from '@/components/TopBar'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import 'regenerator-runtime/runtime'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps }
}) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider session={session}>
        <div className="relative">
          <TopBar className="sticky inset-x-0 top-0" />
          <Component {...pageProps} />
          <Toaster />
        </div>
      </SessionProvider>
    </ThemeProvider>
  )
}

export default api.withTRPC(MyApp)
