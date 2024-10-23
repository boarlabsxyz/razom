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
    '**/*.ts',
    '!node_modules/**',
    '!.keystone/**',
    '!schema.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  moduleNameMapper: {
    '\\.css$': 'jest-transform-stub',
    '\\.module\\.css$': 'jest-transform-stub',
  },
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
};
