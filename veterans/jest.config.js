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
    '!**/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  moduleNameMapper: {
    '\\.css$': 'identity-obj-proxy',
    '\\.module\\.css$': 'identity-obj-proxy',
    '^@helpers/(.*)$': '<rootDir>/helpers/$1',
    '^@comComps/(.*)$': '<rootDir>/components/common/$1',
    '^@comps/(.*)$': '<rootDir>/components/$1',
    '^keystone/context$': '<rootDir>/keystone/context',
    '^keystone$': '<rootDir>/keystone',
  },
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
};
