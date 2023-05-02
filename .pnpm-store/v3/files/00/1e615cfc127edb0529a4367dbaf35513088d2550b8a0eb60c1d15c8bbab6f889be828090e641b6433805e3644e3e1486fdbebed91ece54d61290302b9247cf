import ts from 'typescript';
export class ScriptFile {
    constructor(content, fileName, modifiedTime = new Date()) {
        this.content = content;
        this.fileName = fileName;
        this.modifiedTime = modifiedTime;
        this.originalContent = content;
    }
    write(content) {
        this.content = content;
        this.touch();
    }
    mutate(mutant) {
        this.guardMutationIsWatched();
        const start = this.getOffset(mutant.location.start);
        const end = this.getOffset(mutant.location.end);
        this.content = `${this.originalContent.substr(0, start)}${mutant.replacement}${this.originalContent.substr(end)}`;
        this.touch();
    }
    getOffset(pos) {
        if (!this.sourceFile) {
            this.sourceFile = ts.createSourceFile(this.fileName, this.content, ts.ScriptTarget.Latest, false, undefined);
        }
        return this.sourceFile.getPositionOfLineAndCharacter(pos.line, pos.column);
    }
    resetMutant() {
        this.guardMutationIsWatched();
        this.content = this.originalContent;
        this.touch();
    }
    guardMutationIsWatched() {
        if (!this.watcher) {
            throw new Error(`Tried to check file "${this.fileName}" (which is part of your typescript project), but no watcher is registered for it. Changes would go unnoticed. This probably means that you need to expand the files that are included in your project.`);
        }
    }
    touch() {
        var _a;
        this.modifiedTime = new Date();
        (_a = this.watcher) === null || _a === void 0 ? void 0 : _a.call(this, this.fileName, ts.FileWatcherEventKind.Changed);
    }
}
//# sourceMappingURL=script-file.js.map