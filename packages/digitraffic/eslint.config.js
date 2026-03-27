import baseConfig from '@junat/eslint/base'

export default [
  {
    ignores: [
      'dist',
      'tests',
      'coverage',
      '*.config.*',
      'mocks/**',
      'src/setup.ts',
    ],
  },
  ...baseConfig,
]
