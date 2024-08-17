import baseConfig from '@junat/eslint/base'

export default [
  {
    ignores: ['dist/', 'coverage/', '.tsup'],
  },
  ...baseConfig,
  {
    rules: {
      'unicorn/prefer-module': 'off',
    },
  },
]
