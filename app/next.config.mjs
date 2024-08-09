import path from 'node:path'

const isProd = process.env.NODE_ENV === 'production'

const internalHost = process.env.TAURI_DEV_HOST || 'localhost'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  images: {
    unoptimized: true,
  },
  assetPrefix: isProd ? null : `http://${internalHost}:3000`,
  // Ran as part of CI
  eslint: { ignoreDuringBuilds: true },
  // Ran as part of CI
  typescript: { ignoreBuildErrors: true },
  webpack(config) {
    config.module.rules.push({
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
    })

    // TODO: this is kinda hacky. The issue is that Next.js does not
    // resolve @junat/i18n at all
    config.resolve.alias['@junat/i18n'] = path.resolve(
      process.cwd(),
      '../packages/i18n/src',
    )

    return config
  },
}

export default nextConfig
