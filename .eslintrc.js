module.exports = {
  env: {
    es2020: true,
    node: true
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'standard',
    'plugin:prettierx/standardx'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'prettierx'],
  rules: {}
}
