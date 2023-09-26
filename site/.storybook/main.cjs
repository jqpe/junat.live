const { dirname, join } = require('path')

const path = require('node:path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  stories: ['../docs/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-mdx-gfm')
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
    name: getAbsolutePath('@storybook/nextjs'),
    options: {}
  },
  docs: {
    autodocs: false
  }
}

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, 'package.json')))
}
