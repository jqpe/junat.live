import baseConfig from 'eslint-config-junat.live'

export default [
  {
    ignores: ['dist', 'tests', 'coverage', '.rollup.cache'],
  },
  ...baseConfig,
]
