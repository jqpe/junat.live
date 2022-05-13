module.exports = {
  extends: ['next', 'prettier', 'plugin:unicorn/recommended'],
  rules: {
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/prefer-number-properties': ['error', { checkInfinity: false }]
  }
}
