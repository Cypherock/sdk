import os from 'os';
const guideUrl = 'https://stryker-mutator.io/docs/stryker-js/guides/angular';
export class AngularPreset {
    constructor() {
        this.name = 'angular-cli';
        // Please keep config in sync with handbook
        this.dependencies = ['@stryker-mutator/karma-runner'];
        this.config = {
            mutate: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/test.ts', '!src/environments/*.ts'],
            testRunner: 'karma',
            karma: {
                configFile: 'karma.conf.js',
                projectType: 'angular-cli',
                config: {
                    browsers: ['ChromeHeadless'],
                },
            },
            reporters: ['progress', 'clear-text', 'html'],
            concurrency: Math.floor(os.cpus().length / 2),
            // eslint-disable-next-line camelcase
            concurrency_comment: 'Recommended to use about half of your available cores when running stryker with angular',
            coverageAnalysis: 'perTest',
        };
    }
    async createConfig() {
        return { config: this.config, guideUrl, dependencies: this.dependencies };
    }
}
//# sourceMappingURL=angular-preset.js.map