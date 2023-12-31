import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppProps } from 'next/app'

import { api } from '@/utils/api'

import TopBar from '@/components/TopBar'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import '@/styles/globals.css'
import { useTheme } from 'next-themes'
import { Raleway } from 'next/font/google'
import { type NextPage } from 'next/types'
import { Suspense, useEffect, type ReactElement, type ReactNode } from 'react'
import 'regenerator-runtime/runtime'

const raleway = Raleway({ subsets: ['latin'] })

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
  Component: NextPageWithLayout
}

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps }
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page)
  const { setTheme } = useTheme()
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTheme(localStorage.getItem('theme') || 'light')
    }
  }, [])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider session={session}>
        <Suspense fallback="loading...">
          <div className={`flex min-h-screen flex-col ${raleway.className}`}>
            <TopBar className="sticky inset-x-0 top-0 z-10 shrink-0" />
            <div className="shrink grow">
              {getLayout(<Component {...pageProps} />)}
            </div>
            <Toaster />
          </div>
        </Suspense>
      </SessionProvider>
    </ThemeProvider>
  )
}

export default api.withTRPC(MyApp)
