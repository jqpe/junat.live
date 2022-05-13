module.exports = {
  extends: ['next', 'prettier', 'plugin:unicorn/recommended'],
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
