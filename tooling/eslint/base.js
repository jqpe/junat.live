import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin-js'
import prettier from 'eslint-config-prettier'
import sonarjs from 'eslint-plugin-sonarjs'
import unicorn from 'eslint-plugin-unicorn'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type {Awaited<import('typescript-eslint').Config>} */
export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  unicorn.configs['flat/recommended'],
  sonarjs.configs.recommended,
  prettier,
  {
    plugins: {
      '@stylistic/js': stylistic,
    },
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

      // Enforce className length. For longer strings use `cx` for `cva` instead
      '@stylistic/js/max-len': [
        'error',
        {
          code: 100,
          ignorePattern: '^(?!.*className=).*$',
        },
      ],

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
