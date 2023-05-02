"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InjectionError = exports.InjectorDisposedError = exports.TypedInjectError = void 0;
/*

                    ┏━━━━━━━━━━━━━━━━━━┓
                    ┃ TypedInjectError ┃
                    ┗━━━━━━━━━━━━━━━━━━┛
                              ▲
                              ┃
               ┏━━━━━━━━━━━━━━┻━━━━━━━━━━━━━┓
               ┃                            ┃
 ┏━━━━━━━━━━━━━┻━━━━━━━━━━┓        ┏━━━━━━━━┻━━━━━━━┓
 ┃ InjectorDisposedError  ┃        ┃ InjectionError ┃
 ┗━━━━━━━━━━━━━━━━━━━━━━━━┛        ┗━━━━━━━━━━━━━━━━┛
*/
class TypedInjectError extends Error {
}
exports.TypedInjectError = TypedInjectError;
function describeInjectAction(target) {
    if (typeof target === 'function') {
        return 'inject';
    }
    else {
        return 'resolve';
    }
}
function name(target) {
    if (typeof target === 'function') {
        if (target.toString().startsWith('class')) {
            return `[class ${target.name || '<anonymous>'}]`;
        }
        else {
            return `[function ${target.name || '<anonymous>'}]`;
        }
    }
    else {
        return `[token "${String(target)}"]`;
    }
}
class InjectorDisposedError extends TypedInjectError {
    constructor(target) {
        super(`Injector is already disposed. Please don't use it anymore. Tried to ${describeInjectAction(target)} ${name(target)}.`);
    }
}
exports.InjectorDisposedError = InjectorDisposedError;
class InjectionError extends TypedInjectError {
    constructor(path, cause) {
        super(`Could not ${describeInjectAction(path[0])} ${path.map(name).join(' -> ')}. Cause: ${cause.message}`);
        this.path = path;
        this.cause = cause;
    }
    static create(target, error) {
        if (error instanceof InjectionError) {
            return new InjectionError([target, ...error.path], error.cause);
        }
        else {
            return new InjectionError([target], error);
        }
    }
}
exports.InjectionError = InjectionError;
//# sourceMappingURL=errors.js.map