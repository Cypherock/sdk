import { normalizeWhitespaces, propertyPath } from '@stryker-mutator/util';
import { ProjectFile } from './project-file.js';
/**
 * Represents the project that is under test by Stryker users.
 * This represents the files in the current working directory.
 * Each file can be read into memory when needed (via `readContent`)
 */
export class Project {
    constructor(fs, fileDescriptions, incrementalReport) {
        this.fileDescriptions = fileDescriptions;
        this.incrementalReport = incrementalReport;
        this.files = new Map();
        this.filesToMutate = new Map();
        Object.entries(fileDescriptions).forEach(([name, desc]) => {
            const file = new ProjectFile(fs, name, desc.mutate);
            this.files.set(name, file);
            if (desc.mutate) {
                this.filesToMutate.set(name, file);
            }
        });
    }
    get isEmpty() {
        return this.files.size === 0;
    }
    logFiles(log, ignoreRules, force) {
        var _a;
        if (this.isEmpty) {
            log.warn(normalizeWhitespaces(`No files found in directory ${process.cwd()} using ignore rules: ${JSON.stringify(ignoreRules)}. 
      Make sure you run Stryker from the root directory of your project with the correct "${propertyPath()('ignorePatterns')}".`));
        }
        else {
            if (this.filesToMutate.size) {
                const incrementalInfo = this.incrementalReport
                    ? ` using incremental report with ${Object.values(this.incrementalReport.files).reduce((total, { mutants }) => total + mutants.length, 0)} mutant(s), and ${Object.values((_a = this.incrementalReport.testFiles) !== null && _a !== void 0 ? _a : {}).reduce((total, { tests }) => total + tests.length, 0)} test(s)${force ? '. Force mode is activated, all mutants will be retested' : ''}`
                    : '';
                log.info(`Found ${this.filesToMutate.size} of ${this.files.size} file(s) to be mutated${incrementalInfo}.`);
            }
            else {
                log.warn(normalizeWhitespaces(`No files marked to be mutated, Stryker will perform a dry-run without actually mutating anything.
        You can configure the \`mutate\` property in your config file (or use \`--mutate\` via command line).`));
            }
            if (log.isDebugEnabled()) {
                log.debug(`All input files: ${JSON.stringify([...this.files.keys()], null, 2)}`);
                log.debug(`Files to mutate: ${JSON.stringify([...this.filesToMutate.keys()], null, 2)}`);
            }
        }
    }
}
//# sourceMappingURL=project.js.map