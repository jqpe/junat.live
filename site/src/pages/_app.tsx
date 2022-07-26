import type { AppProps as NextAppProps } from 'next/app'
import type { LayoutProps } from '@typings/layout_props'
import type { ReactNode } from 'react'

import { useRouter } from 'next/router'

import { QueryClient, QueryClientProvider } from 'react-query'

import constants from 'src/constants'

import { getLocale } from '@utils/get_locale'
import useWakeLock from '@hooks/use_wake_lock'
import { ToastProvider } from '@features/toast'

interface AppProps extends NextAppProps {
  Component: NextAppProps['Component'] & {
    layout?: ({ children, layoutProps }: LayoutProps) => JSX.Element
  }
}

interface AppProviderProps {
  children: ReactNode | ReactNode[]
}

const AppProvider = ({ children }: AppProviderProps) => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  )
}

export default function MyApp({ Component, pageProps }: AppProps) {
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
          <Component {...pageProps} />
        </Component.layout>
      </AppProvider>
    )
  }

  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  )
}
