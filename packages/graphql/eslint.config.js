import baseConfig from '@junat/eslint/base'

export default [
  {
    ignores: [
      'dist/',
      'coverage/',
      'src/*/generated/',
      'codegen.ts',
      '*.config.*',
    ],
  },
  ...baseConfig,
  {
    rules: {},
  },
]
