/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  displayName: 'e2e',
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testPathIgnorePatterns: ['/node_modules/', '/__fixtures__/', '/dist/'],
  testMatch: ['**/tests/**/*.[jt]s?(x)'],
};
