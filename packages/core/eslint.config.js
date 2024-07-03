import baseConfig from 'eslint-config-junat.live'

export default [
  {
    ignores: ['dist/', 'coverage/', '.rollup.cache'],
  },
  ...baseConfig,
  {
    rules: {
      'unicorn/prefer-module': 'off',
    },
  },
]
