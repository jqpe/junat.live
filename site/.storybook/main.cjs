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
      resolve: { fullySpecified: false }
    })
    return config
  },
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript'
  },
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5'
  }
}
