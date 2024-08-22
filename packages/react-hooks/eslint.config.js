import baseConfig from '@junat/eslint/base'

export default [
  {
    ignores: ['dist/', 'coverage/', 'tests/'],
  },
  ...baseConfig,
  {
    rules: {},
  },
]
