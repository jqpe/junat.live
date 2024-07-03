import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import sonarjs from 'eslint-plugin-sonarjs'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default tseslint.config(
  ...tseslint.configs.recommended,
  unicorn.configs['flat/recommended'],
  sonarjs.configs.recommended,
  ...compat.extends('plugin:sonar/recommended', 'prettier'),
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },

      ecmaVersion: 6,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          modules: true,
        },
      },
    },

    rules: {
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-array-reduce': 'off',

      'unicorn/prefer-number-properties': [
        'error',
        {
          checkInfinity: false,
        },
      ],

      'unicorn/filename-case': [
        'error',
        {
          cases: {
            snakeCase: true,
            camelCase: true,
          },
        },
      ],

      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['variableLike'],
          format: ['strictCamelCase', 'UPPER_CASE'],
        },
        {
          selector: ['parameter'],
          format: ['strictCamelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'memberLike',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
      ],
    },
  },
  {
    files: ['**/*.tsx'],

    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['function'],
          format: ['strictCamelCase', 'PascalCase'],
        },
      ],
    },
  },
)
