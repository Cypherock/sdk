import * as config from '../config';
import assert from './assert';
import { PacketVersion, PacketVersionMap } from './packetVersions';

const updateCRC16 = (crcParam: number, byte: number) => {
  assert(crcParam, 'Invalid crcParam');
  assert(byte, 'Invalid byte');

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
  assert(dataBuff, 'Data buffer cannot be empty');

  let crc = 0;
  for (const i of dataBuff) {
    crc = updateCRC16(crc, i);
  }
  crc = updateCRC16(crc, 0);
  crc = updateCRC16(crc, 0);
  return crc & 0xffff;
};

export const isHex = (maybeHex: string) => {
  assert(maybeHex, 'Data cannot be empty');
  return maybeHex.length % 2 === 0 && !/[^a-fA-F0-9]/u.test(maybeHex);
};

export const hexToUint8Array = (data: string) => {
  assert(data, 'Invalid data');

  let hex = data;

  if (hex.startsWith('0x')) {
    hex = hex.slice(2);
  }

  if (hex.length <= 0) return new Uint8Array([]);

  if (!isHex(hex)) {
    throw new Error(`Invalid hex string: ${data}`);
  } else {
    const match = hex.match(/.{1,2}/g);
    if (!match) {
      throw new Error(`Invalid hex string: ${data}`);
    }
    return Uint8Array.from(match.map(byte => parseInt(byte, 16)));
  }
};

export const uint8ArrayToHex = (data: Uint8Array) => {
  assert(data, 'Invalid data');

  function i2hex(i: number) {
    return `0${i.toString(16)}`.slice(-2);
  }

  return Array.from(data).map(i2hex).join('');
};

export function padStart(str: string, targetLength: number, padString: string) {
  assert(str, 'Invalid string');
  assert(targetLength, 'Invalid targetLength');
  assert(padString, 'Invalid padString');

  let innerTargetLength = targetLength;
  let innerPadString = String(
    typeof padString !== 'undefined' ? padString : ' ',
  );

  if (str.length > targetLength) {
    return String(str);
  }

  if (innerPadString.length <= 0) {
    throw new Error('padString should not be empty');
  }

  innerTargetLength -= str.length;
  if (innerTargetLength > innerPadString.length) {
    innerPadString += innerPadString.repeat(
      innerTargetLength / innerPadString.length,
    );
  }

  return innerPadString.slice(0, innerTargetLength) + String(str);
}

export const byteUnstuffing = (
  inputBuff: Uint8Array,
  version: PacketVersion,
): string => {
  assert(inputBuff, 'Invalid inputBuff');
  assert(version, 'Invalid version');

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
  assert(inputBuff, 'Invalid inputBuff');
  assert(version, 'Invalid version');

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

/**
 * Converts the given number to hex string within the given radix.
 *
 * @param num Number to be converted
 * @param radix No of bits (only in multiples of 8)
 */
export const intToUintByte = (num: string | number, radix: number) => {
  assert(num, 'Invalid number');
  assert(radix, 'Invalid radix');

  let numCopy = Number(num);
  if (Number.isNaN(numCopy)) {
    throw new Error(`Invalid number: ${num}`);
  }
  if (radix % 8 !== 0) {
    throw new Error(`Invalid radix: ${radix}`);
  }

  if (numCopy < 0) {
    const maxNumber = parseInt(new Array(radix / 4).fill('f').join(''), 16);
    numCopy = maxNumber - Math.abs(numCopy) + 1;
  }

  const val = numCopy.toString(16);
  const noOfZeroes = radix / 4 - val.length;
  let res = '';
  if (noOfZeroes < 0) {
    throw new Error(
      `Invalid serialization of data: ${num} with radix ${radix}`,
    );
  }
  for (let i = 0; i < noOfZeroes; i += 1) {
    res += '0';
  }
  return res + val;
};

export const hexToAscii = (str1: string) => {
  assert(str1, 'Invalid string');

  let hex = str1.toString();

  if (hex.startsWith('0x')) {
    hex = hex.slice(2);
  }

  if (!isHex(hex)) {
    throw new Error(`Invalid hex string: ${hex}`);
  }

  let str = '';
  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
};
