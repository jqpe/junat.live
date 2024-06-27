import type { AppProps as NextAppProps } from 'next/app'
import type { ReactNode } from 'react'
import type { LayoutProps } from '~/types/layout_props'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import constants from '@junat/core/constants'
import { useWakeLock } from '~/hooks/use_wake_lock'
import { getSupportedLocale, LocaleProvider } from '~/i18n'
import { queryClient } from '~/lib/react_query'

import '~/styles/global.css'
import '~/styles/reset.css'

const NoScript = dynamic(() => import('~/components/no_script'))

interface AppProps extends NextAppProps {
  Component: NextAppProps['Component'] & {
    layout?: ({ children, layoutProps }: LayoutProps) => JSX.Element
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useWakeLock()

  if (Component.layout) {
    const layoutProps = {
      locale: getSupportedLocale(router.locale),
      ...constants,
    }

    return (
      <AppProvider>
        <Component.layout layoutProps={layoutProps}>
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
  import('~/features/toast').then(mod => mod.ToastProvider),
)
const DialogProvider = dynamic(() =>
  import('~/components/dialog').then(mod => mod.DialogProvider),
)

const Toast = dynamic(() => import('~/features/toast').then(mod => mod.Toast))

interface AppProviderProps {
  children: ReactNode | ReactNode[]
}

function AppProvider({ children }: AppProviderProps) {
  const router = useRouter()

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider locale={router.locale}>
        <DialogProvider>
          <ToastProvider>
            {children}
            <Toast />
          </ToastProvider>
        </DialogProvider>
      </LocaleProvider>

      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
