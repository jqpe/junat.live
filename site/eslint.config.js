import baseConfig from 'eslint-config-junat.live'
import next from 'eslint-config-junat.live/next'

export default [
  {
    ignores: [
      '**/tests',
      '.next/**',
      'src/generated',
      'public/workbox*',
      'public/sw*',
      '.storybook/static',
      'coverage',
    ],
  },
  ...baseConfig,
  ...next,
  {
    rules: {
      'no-restricted-imports': ['error', 'src/features/*'],
      'unicorn/no-null': 'off',
      'unicorn/switch-case-braces': 'off',
      'unicorn/prefer-top-level-await': 'off',
    },
  },
]
