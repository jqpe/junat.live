import baseConfig from '@junat/eslint/base'

export default [
  {
    ignores: ['dist/', 'coverage/', '.rollup.cache', '*.config.*', "tests/**"],
  },
  ...baseConfig,
  {
    rules: {},
  },
]
