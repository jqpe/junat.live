import baseConfig from '@junat/eslint/base'

export default [
  {
    ignores: ['dist/', 'coverage/', '.rollup.cache', 'test/**', '*.config.*'],
  },
  ...baseConfig,
  {
    rules: {
      'unicorn/prefer-module': 'off',
    },
  },
]
