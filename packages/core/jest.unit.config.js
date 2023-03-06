/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  displayName: 'unit',
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testPathIgnorePatterns: ['/node_modules/', '/__fixtures__/', '/dist/'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
};
