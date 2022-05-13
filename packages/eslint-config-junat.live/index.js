module.exports = {
  extends: [
    'plugin:unicorn/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'unicorn/prevent-abbreviations': 'off',
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
  }
}
