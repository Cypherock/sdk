"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutantModel = void 0;
function assertSourceFileDefined(sourceFile) {
    if (sourceFile === undefined) {
        throw new Error('mutant.sourceFile was not defined');
    }
}
/**
 * Represent a model of a mutant that contains its test relationship
 */
class MutantModel {
    constructor(input) {
        this.coveredBy = input.coveredBy;
        this.description = input.description;
        this.duration = input.duration;
        this.id = input.id;
        this.killedBy = input.killedBy;
        this.location = input.location;
        this.mutatorName = input.mutatorName;
        this.replacement = input.replacement;
        this.static = input.static;
        this.status = input.status;
        this.statusReason = input.statusReason;
        this.testsCompleted = input.testsCompleted;
    }
    addCoveredBy(test) {
        if (!this.coveredByTests) {
            this.coveredByTests = [];
        }
        this.coveredByTests.push(test);
    }
    addKilledBy(test) {
        if (!this.killedByTests) {
            this.killedByTests = [];
        }
        this.killedByTests.push(test);
    }
    /**
     * Retrieves the lines of code with the mutant applied to it, to be shown in a diff view.
     */
    getMutatedLines() {
        assertSourceFileDefined(this.sourceFile);
        return this.sourceFile.getMutationLines(this);
    }
    /**
     * Retrieves the original source lines for this mutant, to be shown in a diff view.
     */
    getOriginalLines() {
        assertSourceFileDefined(this.sourceFile);
        return this.sourceFile.getLines(this.location);
    }
    /**
     * Helper property to retrieve the source file name
     * @throws When the `sourceFile` is not defined.
     */
    get fileName() {
        assertSourceFileDefined(this.sourceFile);
        return this.sourceFile.name;
    }
}
exports.MutantModel = MutantModel;
//# sourceMappingURL=mutant-model.js.map