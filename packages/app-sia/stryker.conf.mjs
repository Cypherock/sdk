const config = {
  mutate: [
    'src/**/*.ts',
    '!src/**/*.test.ts',
    '!**/__fixtures__/*',
    '!**/__mocks__/*',
    '!**/__helpers__/*',
    '!src/proto/generated/**/*',
  ],
  tempDirName: '.stryker-tmp',
  packageManager: 'pnpm',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'jest',
  coverageAnalysis: 'perTest',
  plugins: ['@stryker-mutator/jest-runner'],
  disableTypeChecks: true,
  tsconfigFile: 'tsconfig.json',
  jest: {
    projectType: 'custom',
    configFile: './jest.stryker.config.js',
  },
};

export default config;
