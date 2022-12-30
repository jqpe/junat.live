const path = require('node:path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  webpackFinal: async config => {
    config.resolve.plugins = [new TsconfigPathsPlugin()]
    config.module.rules.push({
      resolve: {
        fullySpecified: false,
        alias: {
          '~': path.join(process.cwd(), 'src')
        }
      }
    })

    // File loader expects files when the svgs should be converted to components first
    const fileLoaderRule = config.module.rules.find(
      rule => rule.test && rule.test.test('.svg')
    )
    fileLoaderRule.exclude = /\.svg$/i
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack']
    })
    return config
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript'
  },
  framework: {
    name: '@storybook/nextjs',
    options: {}
  }
}
