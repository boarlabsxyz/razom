import playwright from 'eslint-plugin-playwright';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    ...playwright.configs['flat/recommended'],
    files: ['veterans/e2e/**/*.ts'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@eslint-plugin-playwright/recommended',
      'plugin:prettier/recommended',
    ],
    plugins: ['prettier'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'prettier/prettier': 'error',
    },
    ...eslintConfigPrettier,
  },
];
