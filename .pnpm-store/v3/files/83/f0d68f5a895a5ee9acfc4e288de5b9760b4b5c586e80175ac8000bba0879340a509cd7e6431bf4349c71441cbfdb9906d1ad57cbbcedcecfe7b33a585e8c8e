import { Logger } from '@stryker-mutator/api/logging';
import { RestClient } from 'typed-rest-client/RestClient';
import { PackageInfo } from './package-info.js';
import { PromptOption } from './prompt-option.js';
export interface NpmPackage {
    name: string;
    homepage?: string;
    initStrykerConfig?: Record<string, unknown>;
}
export declare class NpmClient {
    private readonly log;
    private readonly searchClient;
    private readonly packageClient;
    static inject: ["logger", "restClientNpmSearch", "restClientNpm"];
    constructor(log: Logger, searchClient: RestClient, packageClient: RestClient);
    getTestRunnerOptions(): Promise<PromptOption[]>;
    getTestReporterOptions(): Promise<PromptOption[]>;
    getAdditionalConfig(pkgInfo: PackageInfo): Promise<NpmPackage>;
    private search;
}
//# sourceMappingURL=npm-client.d.ts.map