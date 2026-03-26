import baseConfig from '@junat/eslint/base'

export default [
  {
    ignores: [
      'dist',
      'tests',
      'coverage',
      '*.config.*',
      'src/{mqtt,}*setup.ts',
    ],
  },
  ...baseConfig,
]
