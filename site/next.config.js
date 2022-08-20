import bundleAnalyzer from '@next/bundle-analyzer'
import withPwa from 'next-pwa'

import runtimeCaching from './tools/sw/runtime_caching.js'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pwa: {
    dest: 'public',
    // Don't precache images, see https://developer.chrome.com/docs/workbox/precaching-dos-and-donts/#dont-precache-responsive-images-or-favicons
    // Runtime caching should cache images the user actually needs (only applies to public directory root for platform assets)
    publicExcludes: ['!*.{png,ico,svg}'],
    runtimeCaching,
    dynamicStartUrl: false
  },
  reactStrictMode: true,
  distDir: process.env.CI === 'true' ? 'tmp' : '.next',
  experimental: {
    // https://github.com/vercel/next.js/pull/36436
    newNextLinkBehavior: true
  },
  i18n: {
    locales: ['fi', 'sv', 'en'],
    defaultLocale: 'fi',
    domains: [
      {
        domain: 'junat.live',
        defaultLocale: 'fi'
      },
      {
        domain: 'sv.junat.live',
        defaultLocale: 'sv'
      },
      {
        domain: 'en.junat.live',
        defaultLocale: 'en'
      }
    ]
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
  eslint: {
    dirs: [
      'src/components',
      'src/hooks',
      'src/layouts',
      'src/pages',
      'src/services',
      'src/utils'
    ]
  }
}

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true'
})

export default withPwa(withBundleAnalyzer(nextConfig))
