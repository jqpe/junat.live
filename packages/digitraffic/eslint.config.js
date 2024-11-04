import baseConfig from '@junat/eslint/base'

export default [
  {
    ignores: [
      'dist',
      'tests',
      'coverage',
      '.rollup.cache',
      '*.config.*',
      'mocks/**',
      'src/setup.ts',
    ],
  },
  ...baseConfig,
]
