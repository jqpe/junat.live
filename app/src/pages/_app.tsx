import type { AppProps as NextAppProps } from 'next/app'
import type { PropsWithChildren, ReactNode } from 'react'

import dynamic from 'next/dynamic'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { useWakeLock } from '~/hooks/use_wake_lock'
import { LocaleProvider } from '~/i18n'
import { queryClient } from '~/lib/react_query'

import '@junat/ui/bottom-sheet.css'
import 'core-js/actual/array/to-sorted'
import '~/styles/global.css'
import '~/styles/reset.css'

import { DEFAULT_LOCALE } from '@junat/core'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: require('@Junat/i18n/en.json'),
    },
    sv: {
      translation: require('@Junat/i18n/sv.json'),
    },
    fi: {
      translation: require('@Junat/i18n/fi.json'),
    },
  },
  fallbackLng: DEFAULT_LOCALE,

  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
})

const NoScript = dynamic(() => import('~/components/no_script'))

interface AppProps extends NextAppProps {
  Component: NextAppProps['Component'] & {
    layout?: ({ children }: PropsWithChildren) => JSX.Element
  }
}

export default function App({ Component, pageProps }: AppProps) {
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
  import('~/components/toast').then(mod => mod.ToastProvider),
)
const DialogProvider = dynamic(() =>
  import('@junat/ui/components/dialog').then(mod => mod.DialogProvider),
)

const Toast = dynamic(() => import('~/components/toast').then(mod => mod.Toast))

interface AppProviderProps {
  children: ReactNode | ReactNode[]
}

function AppProvider({ children }: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider locale={DEFAULT_LOCALE}>
        <DialogProvider>
          <ToastProvider>
            {children}
            <Toast />
          </ToastProvider>
        </DialogProvider>
      </LocaleProvider>

      <ReactQueryDevtools buttonPosition="bottom-left" />
    </QueryClientProvider>
  )
}
