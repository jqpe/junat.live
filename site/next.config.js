import bundleAnalyzer from '@next/bundle-analyzer'
import nextPwa from '@ducanh2912/next-pwa'
import { withSentryConfig } from '@sentry/nextjs'

import path from 'path'

import { LOCALES } from './src/constants/locales.js'

import runtimeCaching from './scripts/runtime_caching.js'

/** @type {import('next').NextConfig} */
export const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingRoot: path.join(process.cwd(), '..')
  },
  i18n: {
    locales: LOCALES,
    defaultLocale: 'fi'
  },
  async rewrites() {
    return [
      {
        source: '/juna/:trainNumber',
        destination: '/train/latest/:trainNumber'
      },
      {
        source: '/juna/:date/:trainNumber',
        destination: '/train/:date/:trainNumber'
      },

      {
        source: '/tog/:trainNumber',
        destination: '/train/latest/:trainNumber'
      },
      {
        source: '/tog/:date/:trainNumber',
        destination: '/train/:date/:trainNumber'
      },

      {
        source: '/train/:trainNumber',
        destination: '/train/latest/:trainNumber'
      },

      {
        source: '/asetukset',
        destination: '/settings'
      },
      {
        source: '/installningar',
        destination: '/settings'
      }
    ]
  },

  async headers() {
    if (process.env.NODE_ENV !== 'production') {
      return []
    }

    const { origin: sentry } = new URL(process.env.NEXT_PUBLIC_SENTRY_DSN)

    // src/pages/_document.tsx
    const darkModeHash = 'sha256-4NWSlO94GLKe5BAmembyohnDf+QxL+yGz0g5/xutdF4='

    const csp = [
      "default-src 'self'",
      "object-src 'none'",
      "form-action 'self'",
      `script-src 'self' analytics.junat.live '${darkModeHash}'`,
      `connect-src 'self' ${sentry} analytics.junat.live wss://rata.digitraffic.fi *.digitraffic.fi`,
      "font-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      // Sentry uses blob for their service worker: https://docs.sentry.io/platforms/javascript/session-replay/#content-security-policy-csp
      // Safari <= 15.4 does not support the worker-src directive so child-src (which is iframe+worker) is used as a fallback. Since we don't used iframes set it to none explitly.
      // ---
      "frame-src 'none'",
      "child-src 'self' blob:",
      "worker-src 'self' blob:",
      // ---
      "img-src 'self'",
      "manifest-src 'self'"
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
            value: csp
          }
        ]
      }
    ]
  },
  poweredByHeader: false,

  webpack(config, { isServer, webpack }) {
    config.module.rules.push(
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: { overrides: { removeViewBox: false } }
                  }
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.webmanifest$/i,
        loader: 'json-loader'
      }
    )

    if (isServer) {
      config.externals.push('utf-8-validate')
      config.externals.push('bufferutil')
    }

    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new webpack.DefinePlugin({
          __SENTRY_DEBUG__: false,
          __SENTRY_TRACING__: false
        })
      )
    }

    return config
  },
  output: process.env.DOCKER === 'true' ? 'standalone' : undefined,
  outputFileTracing: true,
  productionBrowserSourceMaps: true,
  eslint: {
    dirs: [
      'src/components',
      'src/hooks',
      'src/layouts',
      'src/pages',
      'src/services',
      'src/utils'
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp']
  },

  sentry: {
    hideSourceMaps: false
  }
}

const withPwa = nextPwa({
  dest: 'public',
  // Don't precache images, see https://developer.chrome.com/docs/workbox/precaching-dos-and-donts/#dont-precache-responsive-images-or-favicons
  // Runtime caching should cache images the user actually needs (only applies to public directory root for platform assets)
  publicExcludes: ['!*.{png,ico,svg}'],
  runtimeCaching,
  disable: process.env.NODE_ENV !== 'production'
})

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

export default withSentryConfig(withPwa(withBundleAnalyzer(nextConfig)), {
  silent: true
})
