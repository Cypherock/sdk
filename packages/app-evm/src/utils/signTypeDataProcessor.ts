import type { TypedData as EIP712TypedData } from 'eip-712';
import BigNumber from 'bignumber.js';
import {
  Eip712DataType,
  SignTypedDataNode,
  SignTypedDataStruct,
} from '../proto/generated/evm/sign_msg';
import { getEip712Lib } from './eip712';

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
      const { getTypeHash } = getEip712Lib();
      const childKeys = Object.keys(dataObject);
      signedTypeDataNode.typeHash = getTypeHash(jsonData, dataType);
      signedTypeDataNode.children = childKeys.map((x: any) =>
        dataNode(
          x,
          dataObject[x],
          structTypes[dataType][x].type,
          structTypes[dataType][x].isArray
            ? structTypes[dataType][x].structType
            : undefined,
        ),
      );
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
