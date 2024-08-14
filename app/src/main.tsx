import { StrictMode } from 'react'
import { Toast, ToastProvider } from '@radix-ui/react-toast'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import i18n from 'i18next'
import ReactDOM from 'react-dom/client'
import { initReactI18next } from 'react-i18next'

import { DEFAULT_LOCALE } from '@junat/core'
import { DialogProvider } from '@junat/ui/components/dialog'

import { useWakeLock } from '~/hooks/use_wake_lock'
import { queryClient } from '~/lib/react_query'
import { routeTree } from './routeTree.gen'

import '@junat/ui/bottom-sheet.css'
import 'core-js/actual/array/to-sorted'
import '~/styles/global.css'
import '~/styles/reset.css'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: (await import('@junat/i18n/en.json')).default,
    },
    sv: {
      translation: (await import('@junat/i18n/sv.json')).default,
    },
    fi: {
      translation: (await import('@junat/i18n/fi.json')).default,
    },
  },
  fallbackLng: DEFAULT_LOCALE,

  interpolation: {
    escapeValue: false,
  },
})

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function AppProvider() {
  void useWakeLock()

  return (
    <QueryClientProvider client={queryClient}>
      <DialogProvider>
        <ToastProvider>
          <RouterProvider router={router} />

          <Toast />
        </ToastProvider>
      </DialogProvider>

      <ReactQueryDevtools buttonPosition="bottom-left" />
    </QueryClientProvider>
  )
}

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <AppProvider />
    </StrictMode>,
  )
}
