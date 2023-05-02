"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadJestEnvironment = void 0;
const messaging_js_1 = require("./messaging.js");
function loadJestEnvironment(name) {
    var _a;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const jestEnvironmentModule = require(require.resolve(name, { paths: [messaging_js_1.state.resolveFromDirectory] }));
    return (_a = jestEnvironmentModule.default) !== null && _a !== void 0 ? _a : jestEnvironmentModule;
}
exports.loadJestEnvironment = loadJestEnvironment;
//# sourceMappingURL=import-jest-environment.js.map