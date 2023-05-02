"use strict";
const messaging_js_1 = require("./messaging.js");
const import_jest_environment_js_1 = require("./import-jest-environment.js");
const mixin_jest_environment_js_1 = require("./mixin-jest-environment.js");
module.exports = function jestEnvironmentGeneric(...args) {
    const JestEnvironmentImpl = (0, import_jest_environment_js_1.loadJestEnvironment)(messaging_js_1.state.jestEnvironment);
    const StrykerAwareJestEnvironment = (0, mixin_jest_environment_js_1.mixinJestEnvironment)(JestEnvironmentImpl);
    return new StrykerAwareJestEnvironment(...args);
};
//# sourceMappingURL=jest-environment-generic.js.map