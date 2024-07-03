import baseConfig from '@junat/eslint/base'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['.expo/**', 'expo-plugins/**', 'expo-env.d.ts'],
  },
  ...baseConfig,
  {
    rules: {
      'unicorn/prefer-module': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/naming-convention': 'off',
    },
  },
]
