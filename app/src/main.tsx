import { StrictMode } from 'react'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import i18n from 'i18next'
import ReactDOM from 'react-dom/client'
import { initReactI18next } from 'react-i18next'

import { DEFAULT_LOCALE } from '@junat/core'

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

const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}
