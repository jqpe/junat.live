import withPwa from 'next-pwa'
import runtimeCaching from 'next-pwa/cache.js'

/** @type {import('next').NextConfig} */
export const nextConfig = {
  reactStrictMode: true,
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
  experimental: {
    externalDir: true
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack']
    })

    config.module.rules.push({
      test: /\.webmanifest$/i,
      loader: 'json-loader'
    })

    return config
  }
}

export default withPwa({
  ...nextConfig,
  pwa: {
    runtimeCaching,
    dest: 'public',
    disable: process.env.NODE_ENV === 'development' && !process.env.PWA
  }
})
