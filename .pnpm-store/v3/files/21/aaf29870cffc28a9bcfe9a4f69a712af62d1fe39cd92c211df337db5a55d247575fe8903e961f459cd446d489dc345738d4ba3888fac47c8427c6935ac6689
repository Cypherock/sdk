import ts from 'typescript';
import { Logger } from '@stryker-mutator/api/logging';
import { ScriptFile } from './script-file.js';
/**
 * A very simple hybrid file system.
 * * Readonly from disk
 * * Writes in-memory
 * * Hard caching
 * * Ability to mutate one file
 */
export declare class HybridFileSystem {
    private readonly log;
    private readonly files;
    static inject: ["logger"];
    constructor(log: Logger);
    writeFile(fileName: string, data: string): void;
    watchFile(fileName: string, watcher: ts.FileWatcherCallback): void;
    getFile(fileName: string): ScriptFile | undefined;
    existsInMemory(fileName: string): boolean;
}
//# sourceMappingURL=hybrid-file-system.d.ts.map