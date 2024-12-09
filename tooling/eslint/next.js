import nextPlugin from '@next/eslint-plugin-next'
import reactCompiler from 'eslint-plugin-react-compiler'

/** @type {Awaited<import('typescript-eslint').Config>} */
export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@next/next': nextPlugin,
      'react-compiler': reactCompiler,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      // TypeError: context.getAncestors is not a function
      '@next/next/no-duplicate-head': 'off',
      '@next/next/no-page-custom-font': 'off',
      'react-compiler/react-compiler': 'error',
    },
  },
  {
    files: ['**/*.stories.tsx', '**/*.stories.ts'],
    rules: {
      'react-compiler/react-compiler': 'off',
    },
  },
]
