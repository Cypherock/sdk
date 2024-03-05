const esbuild = require('esbuild');
const fs = require('node:fs');
const { createBuildSettings } = require('./settings.js');

const run = async () => {
  const settings = createBuildSettings({ minify: true, metafile: true });
  const result = await esbuild.build(settings);
  const mode = process.env.npm_config_mode;

  if (mode === 'write') {
    fs.writeFileSync('build-meta.json', JSON.stringify(result.metafile));
  } else {
    esbuild
      .analyzeMetafile(result.metafile, {
        verbose: false,
      })
      .then(console.log);
  }
};

run();
