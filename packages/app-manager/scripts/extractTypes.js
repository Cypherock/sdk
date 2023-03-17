const path = require('path');
const fs = require('fs/promises');
const tsort = require('./tsort');

const ignoreFiles = ['types.ts'];

const rootPath = path.join(__dirname, '..', 'src', 'proto', 'generated');
const interfaceFilePath = path.join(
  __dirname,
  '..',
  'src',
  'proto',
  'generated',
  'types.ts',
);

const countChars = (str, c) => {
  let count = 0;
  for (const ch of str) {
    if (ch === c) {
      count++;
    }
  }

  return count;
};

let globalInterfaceList = {};

const rememberInterface = interfaceList => {
  globalInterfaceList = { ...globalInterfaceList, ...interfaceList };
};

const saveInterfaces = async (parsedInterfaces, tSortEdges) => {
  const sortedKeys = tsort(tSortEdges).reverse();

  const interfaceFileData = [];

  for (const key of sortedKeys) {
    interfaceFileData.push(parsedInterfaces[key].data.join('\n'));
  }

  await fs.writeFile(interfaceFilePath, interfaceFileData.join(''));
};

const parseInterfaces = async () => {
  const parsedInterfaces = {};

  const interfaceNames = Object.keys(globalInterfaceList);
  const origionalInterfaceNames = interfaceNames.map(elem => elem.slice(1));

  let interfaceBlock = [];
  const tSortEdges = [];

  for (const interfaceName of interfaceNames) {
    const lines = globalInterfaceList[interfaceName];
    interfaceBlock.push(lines[0]);
    const dependencies = [];

    for (let i = 1; i < lines.length - 1; i += 1) {
      const line = lines[i];

      let isModified = false;

      for (const innerInterfaceName of origionalInterfaceNames) {
        const nestedInterfaceMatch = line.match(
          new RegExp(`(.*)(${innerInterfaceName})(.*)`),
        );
        if (nestedInterfaceMatch) {
          isModified = true;

          const interfaceIndex = origionalInterfaceNames.findIndex(
            e => e === innerInterfaceName,
          );

          dependencies.push(interfaceNames[interfaceIndex]);
          tSortEdges.push([interfaceName, interfaceNames[interfaceIndex]]);

          interfaceBlock.push(
            `${nestedInterfaceMatch[1]}${interfaceNames[interfaceIndex]}${nestedInterfaceMatch[3]}`,
          );
        }
      }

      if (!isModified) {
        interfaceBlock.push(line);
      }
    }

    interfaceBlock.push(lines[lines.length - 1]);
    interfaceBlock.push('\n');

    parsedInterfaces[interfaceName] = {};
    parsedInterfaces[interfaceName].data = interfaceBlock;
    parsedInterfaces[interfaceName].dependencies = dependencies;

    if (interfaceBlock.length <= 3) {
      interfaceBlock.unshift(
        '// eslint-disable-next-line @typescript-eslint/no-empty-interface',
      );
    }

    interfaceBlock = [];
  }

  await saveInterfaces(parsedInterfaces, tSortEdges);
};

const extractTypesFromFile = async filePath => {
  const fileData = (await fs.readFile(filePath)).toString().split('\n');

  const interfaceList = {};

  let isInterfaceOpen = false;
  let interfaceName = '';
  let interfaceBlock = [];
  let bracesOpened = 0;

  const interfaceStartRegex = /(export interface) (.*) {/;

  for (const line of fileData) {
    if (isInterfaceOpen) {
      const noOfOpeningBraces = countChars(line, '{');
      const noOfClosingBraces = countChars(line, '}');

      bracesOpened = bracesOpened + noOfOpeningBraces - noOfClosingBraces;
      interfaceBlock.push(line);

      if (bracesOpened === 0) {
        interfaceList[interfaceName] = interfaceBlock;
        interfaceName = '';
        interfaceBlock = [];
        isInterfaceOpen = false;
      }
    } else {
      const match = line.match(interfaceStartRegex);
      if (match) {
        isInterfaceOpen = true;
        interfaceName = `I${match[2]}`;
        interfaceBlock.push(`${match[1]} ${interfaceName} {`);
        bracesOpened = 1;
      }
    }
  }

  rememberInterface(interfaceList);
};

const extractTypes = async rootPath => {
  const files = await fs.readdir(rootPath);

  for (const file of files) {
    const filePath = path.join(rootPath, file);

    const fileInfo = await fs.stat(filePath);

    if (ignoreFiles.includes(file)) {
      continue;
    }

    if (fileInfo.isDirectory()) {
      await extractTypes(path.join(filePath));
      continue;
    }

    if (!fileInfo.isFile() || !filePath.endsWith('.ts')) {
      continue;
    }

    await extractTypesFromFile(filePath);
  }
};

const run = async () => {
  await extractTypes(rootPath);
  await parseInterfaces();
};

run();
