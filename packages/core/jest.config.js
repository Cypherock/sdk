module.exports = {
  collectCoverage: true,
  projects: ['<rootDir>/jest.unit.config.js', '<rootDir>/jest.e2e.config.js'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!src/**/__fixtures__/*',
    '!src/encoders/proto/generated/*',
  ],
  testTimeout: 10000,
};
