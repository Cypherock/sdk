function createBuildSettings(options) {
  return {
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.js',
    bundle: true,
    plugins: [],
    platform: 'browser',
    format: 'esm',
    minify: true,
    treeShaking: true,
    ...options,
  };
}

module.exports = { createBuildSettings };
