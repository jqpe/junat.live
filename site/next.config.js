import bundleAnalyzer from '@next/bundle-analyzer'
import nextPwa from 'next-pwa'
import { withSentryConfig } from '@sentry/nextjs'

import path from 'path'

import { LOCALES } from './src/constants/locales.js'

import runtimeCaching from './tools/sw/runtime_caching.js'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env.CI === 'true' ? 'tmp' : '.next',
  experimental: {
    // https://github.com/vercel/next.js/pull/36436
    newNextLinkBehavior: true,
    outputFileTracingRoot: path.join(process.cwd(), '..')
  },
  i18n: {
    locales: LOCALES,
    defaultLocale: 'fi'
  },
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack']
      },
      {
        test: /\.webmanifest$/i,
        loader: 'json-loader'
      }
    )

    return config
  },
  output: process.env.DOCKER === 'true' ? 'standalone' : undefined,
  outputFileTracing: true,
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

/** @type {import('next').NextConfig} */
export default withSentryConfig(withPwa(withBundleAnalyzer(nextConfig)), {
  silent: true
})
