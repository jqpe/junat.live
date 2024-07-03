import baseConfig from '@junat/eslint/base'
import nextConfig from '@junat/eslint/next'

export default [
  {
    ignores: [
      '**/tests',
      '.next/**',
      "next-env.d.ts",
      'src/generated',
      'public/workbox*',
      'public/sw*',
      '.storybook/static',
      'coverage',
    ],
  },
  ...baseConfig,
  ...nextConfig,
  {
    rules: {
      'no-restricted-imports': ['error', 'src/features/*'],
      'unicorn/no-null': 'off',
      'unicorn/switch-case-braces': 'off',
      'unicorn/prefer-top-level-await': 'off',
    },
  },
]
