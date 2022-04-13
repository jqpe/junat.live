/** @type {import('next').NextConfig} */
const nextConfig = {
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
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack']
    })

    return config
  }
}

export default nextConfig
