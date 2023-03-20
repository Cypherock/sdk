module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/__fixtures__/*',
    '!src/proto/generated/**/*',
  ],
  testTimeout: 500,
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testPathIgnorePatterns: ['/node_modules/', '/__fixtures__/', '/dist/'],
  testMatch: [
    '**/tests/**/*.[jt]s?(x)',
    '**/__tests__/**/*.[jt]s?(x)',
    '!**/__mocks__/**/*.[jt]s?(x)',
    '!**/__helpers__/**/*.[jt]s?(x)',
    '!**/.stryker-tmp/**/*.[jt]s?(x)',
  ],
  coverageThreshold: {
    global: {
      statements: 100,
      lines: 100,
      branches: 100,
      functions: 100,
    },
  },
  modulePathIgnorePatterns: ['<rootDir>/.stryker-tmp'],
};
