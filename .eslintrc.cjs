module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    // '@typescript-eslint/recommended',  // 임시 주석처리
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // '@typescript-eslint/no-unused-vars': 'error',  // 주석처리
    // '@typescript-eslint/no-explicit-any': 'warn',  // 주석처리
  },
}
