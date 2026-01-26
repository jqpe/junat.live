import path from 'node:path'
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
  eslint: { ignoreDuringBuilds: true },
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

    const csp = [
      "default-src 'self'",
      "object-src 'none'",
      "form-action 'self'",
      `script-src 'self' analytics.junat.live '${darkModeHash}'`,
      `connect-src 'self' ${sentry} analytics.junat.live wss://rata.digitraffic.fi *.digitraffic.fi *.digitransit.fi opendata.fmi.fi`,
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
                    params: { overrides: { removeViewBox: false } },
                  },
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.webmanifest$/i,
        loader: 'json-loader',
      },
    )

    // TODO: this is kinda hacky. The issue is that Next.js does not
    // resolve @junat/i18n at all
    config.resolve.alias['@junat/i18n'] = path.resolve(
      process.cwd(),
      '../packages/i18n/src',
    )

    if (isServer) {
      config.externals.push('utf-8-validate', 'bufferutil')
    }

    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new webpack.DefinePlugin({
          __SENTRY_DEBUG__: false,
          __SENTRY_TRACING__: false,
        }),
      )
    }

    return config
  },
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
  exclude: [/dynamic-css-manifest.\json/, /\.map$/, /^manifest.*\.js$/],
})

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withSerwist(
  withSentryConfig(withBundleAnalyzer(nextConfig), {
    silent: false,
    telemetry: false,
    sourcemaps: {
      deleteSourcemapsAfterUpload: true,
    },
  }),
)
