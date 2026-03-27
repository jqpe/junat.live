import baseConfig from '@junat/eslint/base'

export default [
  {
    ignores: [
      'dist/',
      'coverage/',
      'storybook-static/',
      '.storybook/**',
      '*.config.*',
    ],
  },
  ...baseConfig,
  {
    rules: {},
  },
]
