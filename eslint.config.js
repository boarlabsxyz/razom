import playwright from 'eslint-plugin-playwright';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    ...playwright.configs['flat/recommended'],
    files: ['e2e/**'],
    extends: [
      'eslint:recommended',
      'plugin:prettier/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@eslint-plugin-playwright/recommended',
    ],
    plugins: ['prettier'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'prettier/prettier': 'error',
      'comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'never',
        },
      ],
    },
    eslintConfigPrettier,
  },
];
