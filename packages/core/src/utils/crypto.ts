import { assert, uint8ArrayToHex } from '@cypherock/sdk-utils';
import * as config from '../config';
import { PacketVersion, PacketVersionMap } from './packetVersions';

export const byteUnstuffing = (
  inputBuff: Uint8Array,
  version: PacketVersion,
): string => {
  assert(inputBuff, 'Invalid inputBuff');
  assert(version, 'Invalid version');

  assert(inputBuff.length > 0, 'Byte unstuffing failed: 0 size');

  let usableConfig = config.v1;

  if (version === PacketVersionMap.v2) {
    usableConfig = config.v2;
  }

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

  assert(
    inputBuff.length > 0,
    `Byte stuffing failed: ${inputBuff.length} size`,
  );

  let usableConfig = config.v1;

  if (version === PacketVersionMap.v2) {
    usableConfig = config.v2;
  }

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
