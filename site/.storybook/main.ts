import path, { dirname, join } from 'path'
import type { StorybookConfig } from '@storybook/nextjs'

import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

const config = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)', '../src/**/*.mdx'],
  addons: [
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-essentials'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@storybook/addon-coverage'),
    'msw-storybook-addon',
    getAbsolutePath('@storybook/addon-styling-webpack'),
    getAbsolutePath('@storybook/addon-themes'),
  ],
  webpackFinal: async (config: any) => {
    config.resolve.plugins = [new TsconfigPathsPlugin()]
    config.module.rules.push({
      resolve: {
        fullySpecified: false,
        alias: {
          '~': path.join(process.cwd(), 'src'),
        },
      },
    })

    // File loader expects files when the svgs should be converted to components first
    const fileLoaderRule = config.module.rules.find(
      rule => rule.test && rule.test.test('.svg'),
    )
    fileLoaderRule.exclude = /\.svg$/i
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })
    return config
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },
  framework: {
    name: getAbsolutePath('@storybook/nextjs') as '@storybook/nextjs',
    options: {},
  },
  docs: {},
  staticDirs: ['./static'],
} satisfies StorybookConfig

export default config

function getAbsolutePath(value: string) {
  return dirname(require.resolve(join(value, 'package.json')))
}
