import { constants } from './config';
import { PacketVersion, PacketVersionMap } from './utils/versions';

const byteUnstuffing = (inputBuff: Buffer, version: PacketVersion): Buffer => {
  let usableConstants = constants.v1;

  if (version === PacketVersionMap.v2) {
    usableConstants = constants.v2;
  }

  if (inputBuff.length <= 0) throw new Error('Byte unstuffing failed: 0 size');

  const size = inputBuff.length;
  const outputData: any = [];
  for (let i = 0; i < size; i += 1) {
    if (inputBuff[i] === 0xa3 && i < size - 1) {
      if (inputBuff[i + 1] === 0x3a) {
        outputData.push(usableConstants.STUFFING_BYTE);
        i += 1;
      } else if (inputBuff[i + 1] === 0x33) {
        outputData.push(0xa3);
        i += 1;
      } else {
        outputData.push(inputBuff[i]);
      }
    } else {
      outputData.push(inputBuff[i]);
    }
  }
  return Buffer.from(outputData, 'hex');
};

const byteStuffing = (inputBuff: Buffer, version: PacketVersion) => {
  let usableConstants = constants.v1;

  if (version === PacketVersionMap.v2) {
    usableConstants = constants.v2;
  }

  if (inputBuff.length <= 0) throw new Error('Byte stuffing failed: 0 size');
  const outputData: any = [];
  inputBuff.forEach(byte => {
    if (byte === usableConstants.STUFFING_BYTE) {
      outputData.push(0xa3);
      outputData.push(0x3a);
    } else if (byte === 0xa3) {
      outputData.push(0xa3);
      outputData.push(0x33);
    } else {
      outputData.push(byte);
    }
  });
  return Buffer.from(outputData, 'hex');
};

const intToUintByte = (ele: any, radix: number) => {
  let num = Number(ele);
  if (Number.isNaN(num)) {
    throw new Error('Invalid number');
  }

  if (num < 0) {
    const maxNumber = parseInt(new Array(radix / 4).fill('f').join(''), 16);
    num = maxNumber - Math.abs(num) + 1;
  }

  const val = num.toString(16);
  const noOfZeroes = radix / 4 - val.length;
  let res = '';
  if (noOfZeroes < 0) {
    throw new Error(
      `Invalid serialization of data: ${ele} with radix ${radix}`
    );
  }
  for (let i = 0; i < noOfZeroes; i += 1) {
    res += '0';
  }
  return res + val;
};

const hexToAscii = (str1: any) => {
  const hex = str1.toString();
  let str = '';
  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
};

export { byteStuffing, byteUnstuffing, intToUintByte, hexToAscii };
