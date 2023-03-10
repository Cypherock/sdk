module.exports = {
  collectCoverage: true,
  projects: ['<rootDir>/jest.unit.config.js', '<rootDir>/jest.e2e.config.js'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/__fixtures__/*',
  ],
  testTimeout: 10000,
};
