import { InjectionTarget } from './api/InjectionTarget';
export declare abstract class TypedInjectError extends Error {
}
export declare class InjectorDisposedError extends TypedInjectError {
    constructor(target: InjectionTarget);
}
export declare class InjectionError extends TypedInjectError {
    readonly path: InjectionTarget[];
    readonly cause: Error;
    constructor(path: InjectionTarget[], cause: Error);
    static create(target: InjectionTarget, error: Error): InjectionError;
}
//# sourceMappingURL=errors.d.ts.map