import { toPosixFileName } from '../tsconfig-helpers.js';
// This class exist so we can have a two way dependency graph.
// the two way dependency graph is used to search for mutants related to typescript errors
export class TSFileNode {
    constructor(fileName, parents, children) {
        this.fileName = fileName;
        this.parents = parents;
        this.children = children;
    }
    getAllParentReferencesIncludingSelf(allParentReferences = new Set()) {
        allParentReferences.add(this);
        this.parents.forEach((parent) => {
            if (!allParentReferences.has(parent)) {
                parent.getAllParentReferencesIncludingSelf(allParentReferences);
            }
        });
        return allParentReferences;
    }
    getAllChildReferencesIncludingSelf(allChildReferences = new Set()) {
        allChildReferences.add(this);
        this.children.forEach((child) => {
            if (!allChildReferences.has(child)) {
                child.getAllChildReferencesIncludingSelf(allChildReferences);
            }
        });
        return allChildReferences;
    }
    getMutantsWithReferenceToChildrenOrSelf(mutants, nodesChecked = []) {
        if (nodesChecked.includes(this.fileName)) {
            return [];
        }
        nodesChecked.push(this.fileName);
        const relatedMutants = mutants.filter((m) => toPosixFileName(m.fileName) == this.fileName);
        const childResult = this.children.flatMap((c) => c.getMutantsWithReferenceToChildrenOrSelf(mutants, nodesChecked));
        return [...relatedMutants, ...childResult];
    }
}
//# sourceMappingURL=ts-file-node.js.map