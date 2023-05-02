import { Logger } from '@stryker-mutator/api/logging';
import { NpmClient } from './npm-client.js';
import { Preset } from './presets/preset.js';
import { StrykerConfigWriter } from './stryker-config-writer.js';
import { StrykerInquirer } from './stryker-inquirer.js';
import { GitignoreWriter } from './gitignore-writer.js';
export declare class StrykerInitializer {
    private readonly log;
    private readonly out;
    private readonly client;
    private readonly strykerPresets;
    private readonly configWriter;
    private readonly gitignoreWriter;
    private readonly inquirer;
    static inject: ["logger", "out", "npmClient", "strykerPresets", "configWriter", "gitignoreWriter", "inquirer"];
    constructor(log: Logger, out: typeof console.log, client: NpmClient, strykerPresets: Preset[], configWriter: StrykerConfigWriter, gitignoreWriter: GitignoreWriter, inquirer: StrykerInquirer);
    /**
     * Runs the initializer will prompt the user for questions about his setup. After that, install plugins and configure Stryker.
     * @function
     */
    initialize(): Promise<void>;
    /**
     * The typed rest client works only with the specific HTTP_PROXY and HTTPS_PROXY env settings.
     * Let's make sure they are available.
     */
    private patchProxies;
    private selectPreset;
    private initiatePreset;
    private initiateCustom;
    private selectTestRunner;
    private getBuildCommand;
    private selectReporters;
    private selectPackageManager;
    private selectJsonConfigType;
    private getSelectedNpmDependencies;
    /**
     * Install the npm packages
     * @function
     */
    private installNpmDependencies;
    private getInstallCommand;
    private fetchAdditionalConfig;
}
//# sourceMappingURL=stryker-initializer.d.ts.map