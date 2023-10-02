import type { AppProps as NextAppProps } from 'next/app'
import type { LayoutProps } from '@typings/layout_props'
import type { ReactNode } from 'react'

import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import constants from '~/constants'
import { getLocale } from '@utils/get_locale'
import { useWakeLock } from '@hooks/use_wake_lock'
import translate from '@utils/translate'

const NoScript = dynamic(() => import('@components/common/no_script'))

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
      locale: getLocale(router.locale),
      ...constants
    }

    return (
      <AppProvider>
        <Component.layout layoutProps={layoutProps}>
          <NoScript>
            {translate(getLocale(router.locale))('errors', 'nojs')}
          </NoScript>

          <Component {...pageProps} />
        </Component.layout>
      </AppProvider>
    )
  }

  return (
    <AppProvider>
      <NoScript>
        {translate(getLocale(router.locale))('errors', 'nojs')}
      </NoScript>

      <Component {...pageProps} />
    </AppProvider>
  )
}

const ToastProvider = dynamic(() =>
  import('@features/toast').then(mod => mod.ToastProvider)
)
const DialogProvider = dynamic(() =>
  import('@components/elements/dialog').then(mod => mod.DialogProvider)
)

const Toast = dynamic(() => import('@features/toast').then(mod => mod.Toast))

interface AppProviderProps {
  children: ReactNode | ReactNode[]
}

function AppProvider({ children }: AppProviderProps) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 1 } }
  })

  return (
    <QueryClientProvider client={queryClient}>
      <DialogProvider>
        <ToastProvider>
          {children}
          <Toast />
        </ToastProvider>
      </DialogProvider>
    </QueryClientProvider>
  )
}
