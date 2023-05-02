import { Checker, CheckResult } from '@stryker-mutator/api/check';
import { PluginContext, Injector } from '@stryker-mutator/api/plugin';
import { Logger } from '@stryker-mutator/api/logging';
import { Mutant, StrykerOptions } from '@stryker-mutator/api/core';
import { TypescriptCompiler } from './typescript-compiler.js';
export declare function create(injector: Injector<PluginContext>): TypescriptChecker;
export declare namespace create {
    var inject: ["$injector"];
}
/**
 * An in-memory type checker implementation which validates type errors of mutants.
 */
export declare class TypescriptChecker implements Checker {
    private readonly logger;
    private readonly tsCompiler;
    /**
     * Keep track of all tsconfig files which are read during compilation (for project references)
     */
    static inject: ["logger", "options", "tsCompiler"];
    private readonly options;
    constructor(logger: Logger, options: StrykerOptions, tsCompiler: TypescriptCompiler);
    /**
     * Starts the typescript compiler and does a dry run
     */
    init(): Promise<void>;
    /**
     * Checks whether or not a mutant results in a compile error.
     * Will simply pass through if the file mutated isn't part of the typescript project
     * @param mutants The mutants to check
     */
    check(mutants: Mutant[]): Promise<Record<string, CheckResult>>;
    /**
     * Creates groups of the mutants.
     * These groups will get send to the check method.
     * @param mutants All the mutants to group.
     */
    group(mutants: Mutant[]): Promise<string[][]>;
    private checkErrors;
    private createErrorText;
}
//# sourceMappingURL=typescript-checker.d.ts.map