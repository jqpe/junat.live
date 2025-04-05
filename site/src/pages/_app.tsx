import type { AppProps as NextAppProps } from 'next/app'
import type { JSX, PropsWithChildren, ReactNode } from 'react'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { MotionConfig } from 'motion/react'

import 'core-js/actual/array/to-sorted'
import '@junat/ui/bottom-sheet.css'

import { useWakeLock } from '@junat/react-hooks/use_wake_lock'

import { LocaleProvider } from '~/i18n'
import { queryClient } from '~/lib/react_query'

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

  if (Component.layout) {
    return (
      <AppProvider>
        <Component.layout>
          <NoScript />

          <Component {...pageProps} />
        </Component.layout>
      </AppProvider>
    )
  }

  return (
    <AppProvider>
      <NoScript />

      <Component {...pageProps} />
    </AppProvider>
  )
}

const ToastProvider = dynamic(() =>
  import('@junat/ui/components/toast/index').then(mod => mod.ToastProvider),
)
const DialogProvider = dynamic(() =>
  import('@junat/ui/components/dialog').then(mod => mod.DialogProvider),
)

const Toast = dynamic(() =>
  import('@junat/ui/components/toast/index').then(mod => mod.Toast),
)

interface AppProviderProps {
  children: ReactNode | ReactNode[]
}

function AppProvider({ children }: Readonly<AppProviderProps>) {
  const router = useRouter()

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider locale={router.locale}>
        <MotionConfig reducedMotion="user">
          <DialogProvider>
            <ToastProvider>
              {children}
              <Toast />
            </ToastProvider>
          </DialogProvider>

          <ReactQueryDevtools buttonPosition="bottom-left" />
        </MotionConfig>
      </LocaleProvider>
    </QueryClientProvider>
  )
}
