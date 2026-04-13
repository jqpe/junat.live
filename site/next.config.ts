import type { NextConfig } from 'next'

import bundleAnalyzer from '@next/bundle-analyzer'
import { withSentryConfig } from '@sentry/nextjs'
import withSerwistInit from '@serwist/next'

import { LOCALES } from '@junat/core/constants'

export const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@junat/react-hooks', 'nuqs'],
  i18n: {
    locales: [...LOCALES],
    defaultLocale: 'fi',
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: { overrides: { removeViewBox: false } },
                  },
                ],
              },
            },
          },
        ],
        as: '*.js',
      },
    },
  },
  async redirects() {
    return [
      {
        source: '/etseri_elainpuisto_zoo',
        destination: '/ahtari_zoo',
        permanent: true,
      },
      {
        source: '/elainpuisto_zoo',
        destination: '/ahtari_zoo',
        permanent: true,
      },
      {
        source: '/ahtari_elainpuisto_zoo',
        destination: '/ahtari_zoo',
        permanent: true,
      },
    ]
  },
  // Ran as part of CI
  typescript: { ignoreBuildErrors: true },
  async rewrites() {
    const LATEST_TRAIN = '/train/latest/:trainNumber'

    return [
      {
        source: '/juna/:trainNumber',
        destination: LATEST_TRAIN,
      },
      {
        source: '/juna/:date/:trainNumber',
        destination: '/train/:date/:trainNumber',
      },

      {
        source: '/tog/:trainNumber',
        destination: LATEST_TRAIN,
      },
      {
        source: '/tog/:date/:trainNumber',
        destination: '/train/:date/:trainNumber',
      },

      {
        source: '/train/:trainNumber',
        destination: LATEST_TRAIN,
      },

      {
        source: '/asetukset',
        destination: '/settings',
      },
      {
        source: '/installningar',
        destination: '/settings',
      },
      {
        source: '/kartta',
        destination: '/map',
      },
    ]
  },

  async headers() {
    if (process.env.NODE_ENV !== 'production') {
      return []
    }

    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
      throw new TypeError('`NEXT_PUBLIC_SENTRY_DSN` is not defined')
    }

    const { origin: sentry } = new URL(process.env.NEXT_PUBLIC_SENTRY_DSN)

    // src/pages/_document.tsx
    const darkModeHash = 'sha256-4NWSlO94GLKe5BAmembyohnDf+QxL+yGz0g5/xutdF4='
    const analyticsBeforeSendHash =
      'sha256-3Afy1H5CDl+EzA1zpqlWcbN3GiAOjwu0f7905sIlT6s='

    const csp = [
      "default-src 'self'",
      "object-src 'none'",
      "form-action 'self'",
      `script-src 'self' analytics.junat.live '${darkModeHash}' '${analyticsBeforeSendHash}'`,
      `connect-src 'self' ${sentry} analytics.junat.live wss://rata.digitraffic.fi *.digitraffic.fi *.digitransit.fi opendata.fmi.fi protomaps.github.io`,
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      // Sentry uses blob for their service worker: https://docs.sentry.io/platforms/javascript/session-replay/#content-security-policy-csp
      // Safari <= 15.4 does not support the worker-src directive so child-src (which is iframe+worker) is used as a fallback. Since we don't used iframes set it to none explitly.
      // ---
      "frame-src 'none'",
      "child-src 'self' blob:",
      "worker-src 'self' blob:",
      // ---
      "img-src 'self' blob: data:",
      "manifest-src 'self'",
    ].join(';')

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
        ],
      },
    ]
  },
  poweredByHeader: false,
  output: process.env.DOCKER === 'true' ? 'standalone' : undefined,
  productionBrowserSourceMaps: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
} satisfies NextConfig

const withSerwist = withSerwistInit({
  disable: process.env.NODE_ENV === 'development',
  swDest: 'public/sw.js',
  swSrc: 'src/service_worker.ts',
  exclude: [
    /dynamic-css-manifest.\json/,
    /\.map$/,
    /^manifest.*\.js$/,
    /\.pmtiles$/,
  ],
})

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withSentryConfig(withSerwist(withBundleAnalyzer(nextConfig)), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  telemetry: false
})
