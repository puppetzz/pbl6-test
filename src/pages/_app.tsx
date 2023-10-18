import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppProps } from 'next/app'

import { api } from '@/utils/api'

import '@/styles/globals.css'
import TopBar from '@/components/TopBar'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import 'regenerator-runtime/runtime'
import { Suspense, type ReactElement, type ReactNode } from 'react'
import { type NextPage } from 'next/types'
import { Raleway } from 'next/font/google'

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
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider session={session}>
        <Suspense fallback="loading...">
          <div className={`flex min-h-screen flex-col ${raleway.className}`}>
            <TopBar className="sticky inset-x-0 top-0 shrink-0" />
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
