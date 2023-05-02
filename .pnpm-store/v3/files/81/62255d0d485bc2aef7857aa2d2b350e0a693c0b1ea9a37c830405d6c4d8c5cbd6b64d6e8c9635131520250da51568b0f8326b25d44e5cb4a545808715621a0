import ts from 'typescript';
import { Mutant } from '@stryker-mutator/api/core';
export declare class ScriptFile {
    content: string;
    fileName: string;
    modifiedTime: Date;
    private readonly originalContent;
    private sourceFile;
    constructor(content: string, fileName: string, modifiedTime?: Date);
    write(content: string): void;
    watcher: ts.FileWatcherCallback | undefined;
    mutate(mutant: Pick<Mutant, 'location' | 'replacement'>): void;
    private getOffset;
    resetMutant(): void;
    private guardMutationIsWatched;
    private touch;
}
//# sourceMappingURL=script-file.d.ts.map