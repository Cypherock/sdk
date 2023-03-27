const path = require('path');
const fs = require('fs/promises');
const tsort = require('./tsort');

const ignoreFiles = ['types.ts'];

const throwInvalidUsage = () => {
  console.log(
    'Invalid arguments. Usage: node extractTypes.js <ROOT_FOLDER_PATH> <TYPES_FILE_PATH>',
  );
  process.exit(1);
};

if (process.argv.length !== 4) {
  throwInvalidUsage();
}

const rootPath = process.argv[2];
const interfaceFilePath = process.argv[3];

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
let globalEnumList = {};

const rememberInterface = interfaceList => {
  globalInterfaceList = { ...globalInterfaceList, ...interfaceList };
};

const rememberEnum = enumList => {
  globalEnumList = { ...globalEnumList, ...enumList };
};

const saveInterfaces = async (parsedInterfaces, tSortEdges) => {
  const sortedKeys = tsort(tSortEdges).reverse();

  const interfaceFileData = [];
  const enumFileData = [];

  for (const key of sortedKeys) {
    interfaceFileData.push(parsedInterfaces[key].data.join('\n'));
  }

  for (const key of Object.keys(globalEnumList)) {
    enumFileData.push(globalEnumList[key].join('\n'));
  }

  const fileData =
    enumFileData.join('\n\n') + '\n\n' + interfaceFileData.join('');

  await fs.writeFile(interfaceFilePath, fileData);
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
          new RegExp(`(.*) (${innerInterfaceName})([\\s\\[;]+)(.*)`),
        );

        if (nestedInterfaceMatch) {
          isModified = true;

          const interfaceIndex = origionalInterfaceNames.findIndex(
            e => e === innerInterfaceName,
          );

          dependencies.push(interfaceNames[interfaceIndex]);
          if (interfaceName === interfaceNames[interfaceIndex]) {
            console.warn(
              `Cyclic dependency found: ${interfaceName} <=> ${interfaceNames[interfaceIndex]}`,
            );
          } else {
            tSortEdges.push([interfaceName, interfaceNames[interfaceIndex]]);
          }

          const newLine = `${nestedInterfaceMatch[1]} ${interfaceNames[interfaceIndex]}${nestedInterfaceMatch[3]}${nestedInterfaceMatch[4]}`;
          interfaceBlock.push(newLine);
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

const extractInterfacesFromFile = async fileData => {
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

const extractEnumsFromFile = async fileData => {
  const enumList = {};

  let isEnumOpen = false;
  let enumName = '';
  let enumBlock = [];
  let bracesOpened = 0;

  const enumStartRegex = /(export enum) (.*) {/;

  for (const line of fileData) {
    if (isEnumOpen) {
      const noOfOpeningBraces = countChars(line, '{');
      const noOfClosingBraces = countChars(line, '}');

      bracesOpened = bracesOpened + noOfOpeningBraces - noOfClosingBraces;
      enumBlock.push(line);

      if (bracesOpened === 0) {
        enumList[enumName] = enumBlock;
        enumName = '';
        enumBlock = [];
        isEnumOpen = false;
      }
    } else {
      const match = line.match(enumStartRegex);
      if (match) {
        isEnumOpen = true;
        enumName = `${match[2]}`;
        enumBlock.push(`${match[1]} ${enumName} {`);
        bracesOpened = 1;
      }
    }
  }

  rememberEnum(enumList);
};

const extractTypesFromFile = async filePath => {
  const fileData = (await fs.readFile(filePath)).toString().split('\n');

  await extractInterfacesFromFile(fileData);
  await extractEnumsFromFile(fileData);
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
