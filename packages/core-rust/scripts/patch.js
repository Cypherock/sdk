const path = require('path');
const { promises: fs } = require('fs');

const run = async () => {
  const filePath = path.join(__dirname, '..', 'src', 'generated', 'core.js');
  const file = await fs.readFile(filePath);
  const contents = file.toString();

  const res = contents.replace(
    new RegExp('(imports)\\.(.*)\\.(.*)', 'g'),
    '$1.$2'
  );

  await fs.writeFile(filePath, res);
};

run();
