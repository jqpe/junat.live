import baseConfig from '@junat/eslint/base'

export default [
  {
    ignores: ['src-tauri', 'dist', 'dist-ssr', 'public', 'src/routeTree.gen.ts'],
  },
  ...baseConfig,

  {
    rules: {
      'unicorn/no-null': 'off',
      'unicorn/switch-case-braces': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/no-await-expression-member': 'off',
    },
  },
]
