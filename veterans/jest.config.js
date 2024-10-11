/** @type {import('ts-jest').JestConfigWithTsJest} **/
// eslint-disable-next-line no-undef
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
  collectCoverage: true,
  collectCoverageFrom: ['**/*.ts', '!node_modules/**', '!.keystone/**', '!schema.ts'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
};
