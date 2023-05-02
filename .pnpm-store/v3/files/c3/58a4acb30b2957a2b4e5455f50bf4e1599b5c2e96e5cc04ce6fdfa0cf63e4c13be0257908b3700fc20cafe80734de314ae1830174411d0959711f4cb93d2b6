import inquirer from 'inquirer';
const guideUrl = 'https://stryker-mutator.io/docs/stryker-js/guides/vuejs';
/**
 * More information can be found in the Stryker handbook:
 * https://stryker-mutator.io/docs/stryker-js/guides/vuejs
 */
export class VueJsPreset {
    constructor() {
        this.name = 'vue-cli';
        this.jestConf = {
            testRunner: 'jest',
            mutator: {
                plugins: [],
            },
            jest: {
            // config: require('path/to/your/custom/jestConfig.js')
            },
            reporters: ['progress', 'clear-text', 'html'],
            coverageAnalysis: 'off',
        };
        this.mochaConf = {
            testRunner: 'mocha',
            mutator: {
                plugins: [],
            },
            mochaOptions: {
                require: ['@vue/cli-plugin-unit-mocha/setup.js'],
                spec: ['dist/js/chunk-vendors.js', 'dist/js/tests.js'],
            },
            buildCommand: 'webpack --config webpack.config.stryker.js',
            reporters: ['progress', 'clear-text', 'html'],
            coverageAnalysis: 'perTest',
        };
    }
    async createConfig() {
        const testRunnerChoices = ['mocha', 'jest'];
        const testRunnerAnswers = await inquirer.prompt({
            choices: testRunnerChoices,
            message: 'Which test runner do you want to use?',
            name: 'testRunner',
            type: 'list',
        });
        const chosenTestRunner = testRunnerAnswers.testRunner;
        return {
            config: this.getConfig(chosenTestRunner),
            dependencies: this.createDependencies(chosenTestRunner),
            guideUrl,
            additionalConfigFiles: this.getAdditionalConfigFiles(chosenTestRunner),
        };
    }
    getConfig(testRunner) {
        if (testRunner === 'mocha') {
            return this.mochaConf;
        }
        else if (testRunner === 'jest') {
            return this.jestConf;
        }
        else {
            throw new Error(`Invalid test runner chosen: ${testRunner}`);
        }
    }
    getAdditionalConfigFiles(testRunner) {
        if (testRunner === 'mocha') {
            return {
                'webpack.config.stryker.js': `
const glob = require('glob');

// Set env
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.VUE_CLI_BABEL_TARGET_NODE = 'true';
process.env.VUE_CLI_TRANSPILE_BABEL_RUNTIME = 'true';

// Load webpack config
const conf = require('@vue/cli-service/webpack.config.js');

// Override the entry files
conf.entry = {
  // Choose your test files here:
  tests: glob.sync('{test,tests}/**/*+(spec).js').map((fileName) => \`./\${fileName}\`),
};

module.exports = conf;
`,
            };
        }
        return;
    }
    createDependencies(testRunner) {
        const dependencies = [];
        dependencies.push(...this.getTestRunnerDependency(testRunner));
        return dependencies;
    }
    getTestRunnerDependency(testRunner) {
        if (testRunner === 'mocha') {
            return ['@stryker-mutator/mocha-runner', 'glob', 'webpack-cli'];
        }
        else if (testRunner === 'jest') {
            return ['@stryker-mutator/jest-runner'];
        }
        else {
            throw new Error(`Invalid test runner chosen: ${testRunner}`);
        }
    }
}
//# sourceMappingURL=vue-js-preset.js.map