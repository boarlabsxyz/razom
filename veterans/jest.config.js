/** @type {import('ts-jest').JestConfigWithTsJest} **/
// eslint-disable-next-line no-undef
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
      },
    ],
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{ts,tsx,js,jsx}',
    '!**/layout.tsx',
    '!node_modules/**',
    '!.next/**',
    '!.keystone/**',
    '!keystone.ts',
    '!auth.ts',
    '!coverage/**',
    '!e2e/**',
    '!schema.ts',
    '!jest.config.js',
    '!playwright.config.ts',
    '!next-env.d.ts',
    '!global.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  moduleNameMapper: {
    '\\.css$': 'jest-transform-stub',
    '\\.module\\.css$': 'jest-transform-stub',
  },
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
};
