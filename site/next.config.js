import bundleAnalyzer from '@next/bundle-analyzer'
import withPwa from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pwa: {
    dest: 'public'
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
