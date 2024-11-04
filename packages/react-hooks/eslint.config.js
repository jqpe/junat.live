import baseConfig from '@junat/eslint/base'

export default [
  {
    ignores: ['dist/', 'coverage/', 'tests/', '*.config.*', 'test_setup.ts'],
  },
  ...baseConfig,
  {
    rules: {
      'unicorn/prefer-global-this': 'off'
    },
  },
]
