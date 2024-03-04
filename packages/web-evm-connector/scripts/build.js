const esbuild = require('esbuild');
const { createBuildSettings } = require('./settings.js');

const settings = createBuildSettings({ minify: true });

esbuild
  .build({
    ...settings,
  })
  .then(console.log);
