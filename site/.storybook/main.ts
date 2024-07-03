import path from 'node:path'
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    // TODO: this is kinda hacky. The issue is that Next.js does not
    // resolve @junat/i18n at all
    config.resolve.alias['@junat/i18n'] = path.resolve(
      process.cwd(),
      '../packages/i18n/src',
    )

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
  // eslint-disable-next-line unicorn/prefer-module
  return path.dirname(require.resolve(path.join(value, 'package.json')))
}
