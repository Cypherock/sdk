"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestModel = exports.TestStatus = void 0;
function assertSourceFileDefined(sourceFile) {
    if (sourceFile === undefined) {
        throw new Error('test.sourceFile was not defined');
    }
}
function assertLocationDefined(location) {
    if (location === undefined) {
        throw new Error('test.location was not defined');
    }
}
var TestStatus;
(function (TestStatus) {
    TestStatus["Killing"] = "Killing";
    TestStatus["Covering"] = "Covering";
    TestStatus["NotCovering"] = "NotCovering";
})(TestStatus = exports.TestStatus || (exports.TestStatus = {}));
class TestModel {
    addCovered(mutant) {
        if (!this.coveredMutants) {
            this.coveredMutants = [];
        }
        this.coveredMutants.push(mutant);
    }
    addKilled(mutant) {
        if (!this.killedMutants) {
            this.killedMutants = [];
        }
        this.killedMutants.push(mutant);
    }
    constructor(input) {
        Object.entries(input).forEach(([key, value]) => {
            // @ts-expect-error dynamic assignment so we won't forget to add new properties
            this[key] = value;
        });
    }
    /**
     * Retrieves the original source lines where this test is defined.
     * @throws if source file or location is not defined
     */
    getLines() {
        assertSourceFileDefined(this.sourceFile);
        assertLocationDefined(this.location);
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
    get status() {
        if (this.killedMutants?.length) {
            return TestStatus.Killing;
        }
        else if (this.coveredMutants?.length) {
            return TestStatus.Covering;
        }
        else {
            return TestStatus.NotCovering;
        }
    }
}
exports.TestModel = TestModel;
//# sourceMappingURL=test-model.js.map