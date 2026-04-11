import type { AppProps as NextAppProps } from 'next/app'
import type { JSX, PropsWithChildren, ReactNode } from 'react'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { MotionConfig } from 'motion/react'

import { NuqsAdapter } from '@junat/react-hooks'

import 'core-js/actual/array/to-sorted'
import 'core-js/actual/url/parse'
import '@junat/ui/bottom-sheet.css'

import { useWakeLock } from '@junat/react-hooks/use_wake_lock'

import { LocaleProvider } from '~/i18n'
import { queryClient } from '~/lib/react_query'

import '~/styles/map.css'
import '~/styles/global.css'
import '~/styles/reset.css'

const NoScript = dynamic(() => import('~/components/no_script'))

interface AppProps extends NextAppProps {
  Component: NextAppProps['Component'] & {
    layout?: ({ children }: PropsWithChildren) => JSX.Element
  }
}

export default function App({ Component, pageProps }: Readonly<AppProps>) {
  useWakeLock()
  const { locale } = useRouter()

  if (Component.layout) {
    return (
      <AppProvider locale={locale}>
        <Component.layout>
          <NoScript />

          <Component {...pageProps} />
        </Component.layout>
      </AppProvider>
    )
  }

  return (
    <AppProvider locale={locale}>
      <NoScript />

      <Component {...pageProps} />
    </AppProvider>
  )
}

const ToastProvider = dynamic(
  () =>
    import('@junat/ui/components/toast/index').then(mod => mod.ToastProvider),
  { ssr: false },
)
const DialogProvider = dynamic(
  () => import('@junat/ui/components/dialog').then(mod => mod.DialogProvider),
  { ssr: false },
)

const Toast = dynamic(
  () => import('@junat/ui/components/toast/index').then(mod => mod.Toast),
  { ssr: false },
)

interface AppProviderProps {
  children: ReactNode | ReactNode[]
  locale: string | undefined
}

function AppProvider({ children, locale }: Readonly<AppProviderProps>) {
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider locale={locale}>
        <MotionConfig reducedMotion="user">
          <NuqsAdapter>
            <DialogProvider>
              <ToastProvider>
                {children}

                <Toast />
              </ToastProvider>
            </DialogProvider>
          </NuqsAdapter>

          {/* <ReactQueryDevtools /> */}
        </MotionConfig>
      </LocaleProvider>
    </QueryClientProvider>
  )
}
