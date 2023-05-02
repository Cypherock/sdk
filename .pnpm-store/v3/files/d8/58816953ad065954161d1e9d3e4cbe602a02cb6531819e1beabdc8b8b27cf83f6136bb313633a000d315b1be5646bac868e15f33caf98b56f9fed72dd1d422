import { Preset } from './presets/preset.js';
import { PromptOption } from './prompt-option.js';
export interface PromptResult {
    additionalNpmDependencies: string[];
    additionalConfig: Record<string, unknown>;
}
export declare class StrykerInquirer {
    promptPresets(options: Preset[]): Promise<Preset | undefined>;
    promptTestRunners(options: PromptOption[]): Promise<PromptOption>;
    promptBuildCommand(skip: boolean): Promise<PromptOption>;
    promptReporters(options: PromptOption[]): Promise<PromptOption[]>;
    promptPackageManager(options: PromptOption[]): Promise<PromptOption>;
    promptJsonConfigType(): Promise<boolean>;
}
//# sourceMappingURL=stryker-inquirer.d.ts.map