// @ts-check

const HOUR = 60 * 60 // * a second by Workbox
const DAY = 24 * HOUR

const ORIGIN_REGEX = /https:\/\/(?:en|sv|fi)?\.?junat\.live/

/**
 * @type {import("workbox-build").RuntimeCaching[]}
 */
const runtimeCaching = [
  // Google Fonts
  {
    urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-web-fonts',
      expiration: {
        maxEntries: 10,
        maxAgeSeconds: 365 * DAY
      }
    }
  },
  {
    urlPattern: /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'google-fonts-stylesheet',
      expiration: {
        maxAgeSeconds: 7 * DAY
      }
    }
  },
  // Images
  {
    urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-image-assets',
      expiration: {
        maxEntries: 64,
        maxAgeSeconds: DAY
      }
    }
  },
  // JavaScript
  {
    urlPattern: /\.js$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-js-assets',
      expiration: {
        maxAgeSeconds: DAY
      }
    }
  },
  // CSS
  {
    urlPattern: /\.css$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-style-assets',
      expiration: {
        maxAgeSeconds: DAY
      }
    }
  },
  // _next/data
  {
    urlPattern: /\/_next\/data\/[^\/]+\/.+\.json$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'next-data',
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: DAY
      }
    }
  },
  // .json xml csv
  {
    urlPattern: /\.(?:json|xml|csv)$/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'static-data-assets',
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: DAY
      }
    }
  },
  // Digitraffic metadata
  {
    urlPattern: /https:\/\/rata\.digitraffic\.fi\/api\/\w+\/metadata\/\w*/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'digitraffic-metadata',
      expiration: {
        maxAgeSeconds: 15 * DAY
      }
    }
  },
  // API routes
  {
    urlPattern: ({ url }) => {
      const isSameOrigin = ORIGIN_REGEX.test(url.origin)
      if (!isSameOrigin) return false
      const pathname = url.pathname

      return pathname.startsWith('/api/')
    },
    handler: 'NetworkFirst',
    method: 'GET',
    options: {
      cacheName: 'apis',
      expiration: {
        maxEntries: 16,
        maxAgeSeconds: DAY
      },
      networkTimeoutSeconds: 10
    }
  },
  // All other requests from the same origin
  {
    urlPattern: ({ url }) => {
      const isSameOrigin = ORIGIN_REGEX.test(url.origin)
      if (!isSameOrigin) return false
      const pathname = url.pathname

      return !pathname.startsWith('/api/')
    },
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'same-origin-other',
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: DAY,
        purgeOnQuotaError: true
      }
    }
  },
  // cross-origin requests
  // NOTE: cross-origin responses to requests made without CORS enabled use at least three orders of magnitude of storage quota
  // https://developer.chrome.com/docs/workbox/understanding-storage-quota/#beware-of-opaque-responses
  {
    urlPattern: ({ url }) => {
      const isSameOrigin = self.origin === url.origin
      return !isSameOrigin
    },
    handler: 'NetworkFirst',
    options: {
      cacheName: 'cross-origin',
      expiration: {
        maxAgeSeconds: HOUR,
        purgeOnQuotaError: true
      },
      networkTimeoutSeconds: 10
    }
  }
]

export default runtimeCaching
