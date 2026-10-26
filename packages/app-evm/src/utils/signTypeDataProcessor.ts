import type { TypedData as EIP712TypedData } from 'eip-712';
import { hexToUint8Array } from '@cypherock/sdk-utils';
import BigNumber from 'bignumber.js';
import {
  Eip712DataType,
  SignTypedDataNode,
  SignTypedDataStruct,
} from '../proto/generated/evm/sign_msg';
import { getEthersLib } from './ethers';

type EIP712Types = EIP712TypedData['types'];

// 'Order[2][3]' -> 'Order'; only array suffixes are stripped because type
// names may not be valid identifiers (e.g. 'HyperliquidTransaction:ApproveAgent')
// and must match `types` keys verbatim
const getBaseTypeName = (fieldType: string): string =>
  fieldType.replace(/(\[\d*\])+$/, '');

const collectStructDependencies = (
  types: EIP712Types,
  typeName: string,
  found: Set<string> = new Set(),
): Set<string> => {
  if (found.has(typeName) || !types[typeName]) return found;

  found.add(typeName);
  types[typeName].forEach(field => {
    collectStructDependencies(types, getBaseTypeName(field.type), found);
  });

  return found;
};

const encodeStructType = (types: EIP712Types, typeName: string): string => {
  if (!types[typeName]) {
    throw new Error(
      `EIP-712 type '${typeName}' is not defined in the 'types' object`,
    );
  }

  const [primary, ...dependencies] = Array.from(
    collectStructDependencies(types, typeName),
  );

  return [primary, ...dependencies.sort()]
    .map(
      name =>
        `${name}(${types[name]
          .map(field => `${field.type} ${field.name}`)
          .join(',')})`,
    )
    .join('');
};

const getStructTypeHash = (
  types: EIP712Types,
  typeName: string,
): Uint8Array => {
  const ethers = getEthersLib();

  return hexToUint8Array(
    ethers.keccak256(ethers.toUtf8Bytes(encodeStructType(types, typeName))),
  );
};

const preprocessTypeData = (dataTypes: any) => {
  const formattedTypes: any = {};
  Object.keys(dataTypes.types).forEach((x: any) => {
    const data: any = {};
    dataTypes.types[x].forEach((y: any) => {
      data[y.name] = {
        type: y.type.split('[')[0],
        structType: y.type,
        isArray: y.type.indexOf('[') !== -1,
      };
    });
    formattedTypes[x] = data;
  });
  return formattedTypes;
};

const encodeNumber = (num: string, numBytes: number): Buffer => {
  const byteList: number[] = [];
  let currNum = new BigNumber(num);
  for (let i = 0; i < numBytes; i += 1) {
    const byte = currNum.mod(256).toNumber();
    byteList.unshift(byte);
    currNum = new BigNumber(
      currNum.dividedBy(256).toFixed(0, BigNumber.ROUND_FLOOR),
    );
  }
  while (byteList.length < numBytes) {
    byteList.unshift(0);
  }
  return Buffer.from(byteList);
};

const eip712DataTypeFromString = (dataType: string, data: any): any => {
  if (dataType.toLowerCase() === 'struct') {
    return {
      size: Object.keys(data).length,
      type: Eip712DataType.EIP_712_DATA_TYPE_STRUCT,
      encodedData: undefined,
    };
  }
  switch (dataType.toLowerCase().slice(0, 3)) {
    case 'str':
      return {
        size: data.length,
        type: Eip712DataType.EIP_712_DATA_TYPE_STRING,
        encodedData: Buffer.from(data),
      };
    case 'arr':
      return {
        size: data.length,
        type: Eip712DataType.EIP_712_DATA_TYPE_ARRAY,
        encodedData: undefined,
      };
    case 'boo':
      return {
        size: 1,
        type: Eip712DataType.EIP_712_DATA_TYPE_BOOL,
        encodedData: new BigNumber(
          data.toString().toLowerCase() === 'true' ? 1 : 0,
        ),
      };
    case 'byt':
      return {
        size: Buffer.from((data as string).slice(2), 'hex').length,
        type: Eip712DataType.EIP_712_DATA_TYPE_BYTES,
        encodedData: Buffer.from((data as string).slice(2), 'hex'),
      };
    case 'add':
      return {
        size: Buffer.from((data as string).slice(2), 'hex').length,
        type: Eip712DataType.EIP_712_DATA_TYPE_ADDRESS,
        encodedData: Buffer.from((data as string).slice(2), 'hex'),
      };
    case 'int':
      return {
        size: +dataType.toLowerCase().replace('int', '') / 8,
        type: Eip712DataType.EIP_712_DATA_TYPE_INT,
        encodedData: encodeNumber(
          data,
          +dataType.toLowerCase().replace('int', '') / 8,
        ),
      };
    case 'uin':
      return {
        size: +dataType.toLowerCase().replace('uint', '') / 8,
        type: Eip712DataType.EIP_712_DATA_TYPE_UINT,
        encodedData: encodeNumber(
          data,
          +dataType.toLowerCase().replace('uint', '') / 8,
        ),
      };
    default:
      return Eip712DataType.UNRECOGNIZED;
  }
};

const eip712JsonToStruct = (
  jsonPayload: EIP712TypedData,
): SignTypedDataStruct => {
  const jsonData = structuredClone(jsonPayload);
  const structTypes = preprocessTypeData(jsonData);
  const dataNode = (
    name: string,
    dataObject: any,
    dataType: string,
    arrayType: string | null = null,
  ): SignTypedDataNode => {
    let nodeType = dataType;
    if (arrayType) {
      nodeType = 'array';
    } else if (structTypes[dataType]) {
      nodeType = 'struct';
    }
    const { size, type, encodedData } = eip712DataTypeFromString(
      nodeType,
      dataObject,
    );
    const signedTypeDataNode: SignTypedDataNode = {
      name,
      type,
      size,
      structName: arrayType ?? dataType,
      children: [],
    };
    if (structTypes[dataType] && arrayType) {
      signedTypeDataNode.children = dataObject.map((x: any, i: number) =>
        dataNode(i.toString(), x, dataType, undefined),
      );
    } else if (structTypes[dataType]) {
      // EIP-712 hashes struct fields in declaration order; keys present in
      // the message but not declared in `types` are excluded from the digest
      const declaredFields = Object.keys(structTypes[dataType]);
      signedTypeDataNode.typeHash = getStructTypeHash(jsonData.types, dataType);
      signedTypeDataNode.size = declaredFields.length;
      signedTypeDataNode.children = declaredFields.map((x: string) => {
        if (dataObject[x] === undefined) {
          throw new Error(
            `EIP-712 message is missing field '${x}' of type '${dataType}'`,
          );
        }
        return dataNode(
          x,
          dataObject[x],
          structTypes[dataType][x].type,
          structTypes[dataType][x].isArray
            ? structTypes[dataType][x].structType
            : undefined,
        );
      });
    } else {
      signedTypeDataNode.data = encodedData;
    }

    return signedTypeDataNode as SignTypedDataNode;
  };

  return {
    domain: dataNode('domain', jsonData.domain, 'EIP712Domain'),
    message: dataNode('message', jsonData.message, jsonData.primaryType),
  };
};

export type { EIP712TypedData };

export { eip712JsonToStruct };
