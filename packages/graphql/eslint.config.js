import baseConfig from '@junat/eslint/base'

export default [
  {
    ignores: ['dist/', 'coverage/', '.rollup.cache', 'src/generated/'],
  },
  ...baseConfig,
  {
    rules: {},
  },
]
