import baseConfig from '@junat/eslint/base'

export default [
  {
    ignores: ['dist/', 'coverage/', '*.config.*', "tests/**"],
  },
  ...baseConfig,
  {
    rules: {},
  },
]
