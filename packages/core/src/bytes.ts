import * as config from './config';
import { uint8ArrayToHex } from './utils';
import { PacketVersion, PacketVersionMap } from './utils/packetVersions';

const byteUnstuffing = (
  inputBuff: Uint8Array,
  version: PacketVersion
): string => {
  let usableConfig = config.v1;

  if (version === PacketVersionMap.v2) {
    usableConfig = config.v2;
  }

  if (inputBuff.length <= 0) throw new Error('Byte unstuffing failed: 0 size');

  const size = inputBuff.length;
  const outputData: number[] = [];
  for (let i = 0; i < size; i += 1) {
    if (inputBuff[i] === 0xa3 && i < size - 1) {
      if (inputBuff[i + 1] === 0x3a) {
        outputData.push(usableConfig.constants.STUFFING_BYTE);
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

  return uint8ArrayToHex(Uint8Array.from(outputData));
};

const byteStuffing = (inputBuff: Uint8Array, version: PacketVersion) => {
  let usableConfig = config.v1;

  if (version === PacketVersionMap.v2) {
    usableConfig = config.v2;
  }

  if (inputBuff.length <= 0) throw new Error('Byte stuffing failed: 0 size');
  const outputData: number[] = [];
  inputBuff.forEach(byte => {
    if (byte === usableConfig.constants.STUFFING_BYTE) {
      outputData.push(0xa3);
      outputData.push(0x3a);
    } else if (byte === 0xa3) {
      outputData.push(0xa3);
      outputData.push(0x33);
    } else {
      outputData.push(byte);
    }
  });

  return uint8ArrayToHex(Uint8Array.from(outputData));
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
