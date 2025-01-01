import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'

import { defaultCache } from '@serwist/next/worker'
import {
  CacheFirst,
  ExpirationPlugin,
  Serwist,
  StaleWhileRevalidate,
} from 'serwist'

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: ServiceWorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ url }) =>
        url.href === 'https://analytics.junat.live/script.js',
      handler: new StaleWhileRevalidate({
        cacheName: 'analytics',
        plugins: [
          new ExpirationPlugin({
            maxAgeSeconds: 24 * 60 * 60, // day
          }),
        ],
      }),
    },
    {
      matcher: ({ url }) =>
        url.host === 'rata.digitraffic.fi' && url.pathname.includes('metadata'),
      handler: new CacheFirst({
        cacheName: 'metadata',
        plugins: [
          new ExpirationPlugin({
            maxAgeFrom: 'last-used',
            purgeOnQuotaError: true,
            maxAgeSeconds: 7 * 24 * 60 * 60, // week
          }),
        ],
      }),
    },
    ...defaultCache,
  ],
})

serwist.addEventListeners()
