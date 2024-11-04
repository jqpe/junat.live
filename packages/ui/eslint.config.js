import baseConfig from '@junat/eslint/base'

export default [
  {
    ignores: ['dist/', 'coverage/', '.rollup.cache', 'storybook-static/', '.storybook/**', '*.config.*'],
  },
  ...baseConfig,
  {
    rules: {},
  },
]
