module.exports = {
  extends: [
    'plugin:unicorn/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:sonarjs/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'sonarjs'],
  rules: {
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/prefer-number-properties': ['error', { checkInfinity: false }],
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          snakeCase: true,
          camelCase: true
        }
      }
    ]
  },
  env: {
    es6: true,
    node: true,
    browser: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true
    }
  }
}
