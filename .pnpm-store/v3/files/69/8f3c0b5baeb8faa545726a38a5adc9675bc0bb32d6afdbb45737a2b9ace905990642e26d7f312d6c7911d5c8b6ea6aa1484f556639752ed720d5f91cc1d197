import ts from 'typescript';
import { Mutant, StrykerOptions } from '@stryker-mutator/api/core';
import { Logger } from '@stryker-mutator/api/logging';
import { HybridFileSystem } from './fs/index.js';
import { TSFileNode } from './grouping/ts-file-node.js';
export interface ITypescriptCompiler {
    init(): Promise<ts.Diagnostic[]>;
    check(mutants: Mutant[]): Promise<ts.Diagnostic[]>;
}
export interface IFileRelationCreator {
    get nodes(): Map<string, TSFileNode>;
}
export type SourceFiles = Map<string, {
    fileName: string;
    imports: Set<string>;
}>;
export declare class TypescriptCompiler implements ITypescriptCompiler, IFileRelationCreator {
    private readonly log;
    private readonly options;
    private readonly fs;
    static inject: ["logger", "options", "fs"];
    private readonly allTSConfigFiles;
    private readonly tsconfigFile;
    private currentTask;
    private currentErrors;
    private readonly sourceFiles;
    private readonly _nodes;
    private lastMutants;
    constructor(log: Logger, options: StrykerOptions, fs: HybridFileSystem);
    init(): Promise<ts.Diagnostic[]>;
    check(mutants: Mutant[]): Promise<ts.Diagnostic[]>;
    get nodes(): Map<string, TSFileNode>;
    /**
     * Resolves TS input file based on a dependency of a input file
     * @param dependencyFileName The dependency file name. With TS project references this can be a declaration file
     * @returns TS source file if found (fallbacks to input filename)
     */
    private resolveTSInputFile;
    private adjustTSConfigFile;
    private guardTSConfigFileExists;
    private fileNameIsBuildInfo;
}
//# sourceMappingURL=typescript-compiler.d.ts.map