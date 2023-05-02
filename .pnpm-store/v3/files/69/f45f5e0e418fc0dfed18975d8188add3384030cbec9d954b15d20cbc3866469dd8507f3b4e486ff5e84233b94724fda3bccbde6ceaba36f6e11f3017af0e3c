import { createRequire } from 'module';
/**
 * Require a module from the current working directory (or a different base dir)
 * @see https://nodejs.org/api/modules.html#modules_require_resolve_paths_request
 */
export function requireResolve(id, from = process.cwd()) {
    const require = createRequire(import.meta.url);
    return require(require.resolve(id, { paths: [from] }));
}
//# sourceMappingURL=require-resolve.js.map