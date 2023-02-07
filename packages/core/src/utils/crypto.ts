import * as config from '../config';
import { PacketVersion, PacketVersionMap } from './packetVersions';

const updateCRC16 = (crcParam: number, byte: number) => {
  let input = byte | 0x100;
  let crc = crcParam;
  do {
    crc <<= 1;
    input <<= 1;
    if (input & 0x100) crc += 1;
    if (crc & 0x10000) crc ^= 0x1021;
  } while (!(input & 0x10000));
  return crc & 0xffff;
};

export const crc16 = (dataBuff: Uint8Array) => {
  let crc = 0;
  for (let index = 0; index < dataBuff.length; index += 1) {
    const i = dataBuff[index];
    crc = updateCRC16(crc, i);
  }
  crc = updateCRC16(crc, 0);
  crc = updateCRC16(crc, 0);
  return crc & 0xffff;
};


export const hexToUint8Array = (data: string) => {
  const isHex = (maybeHex: string) =>
    maybeHex.length !== 0 &&
    maybeHex.length % 2 === 0 &&
    !/[^a-fA-F0-9]/u.test(maybeHex);

  if (!isHex(data)) {
    throw new Error(`Invalid hex string: ${data}`);
  } else {
    const match = data.match(/.{1,2}/g);
    if (!match) {
      throw new Error('Invalid hex string');
    }
    return Uint8Array.from(match.map(byte => parseInt(byte, 16)));
  }
};

export const uint8ArrayToHex = (data: Uint8Array) => {
  function i2hex(i: number) {
    return `0${i.toString(16)}`.slice(-2);
  }

  return Array.from(data).map(i2hex).join('');
};

export function padStart(str: string, targetLength: number, padString: string) {
  let innerTargetLength = targetLength;
  let innerPadString = String(
    typeof padString !== 'undefined' ? padString : ' '
  );

  if (str.length > targetLength) {
    return String(str);
  }

  innerTargetLength -= str.length;
  if (innerTargetLength > innerPadString.length) {
    innerPadString += innerPadString.repeat(
      innerTargetLength / innerPadString.length
    );
  }

  return innerPadString.slice(0, innerTargetLength) + String(str);
}

export const byteUnstuffing = (
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

export const byteStuffing = (inputBuff: Uint8Array, version: PacketVersion) => {
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

export const intToUintByte = (ele: string | number, radix: number) => {
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

export const hexToAscii = (str1: string) => {
  const hex = str1.toString();
  let str = '';
  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
};
