// SDK: src/utils/address.ts - FIXED VERSION
import { uint8ArrayToHex } from '@cypherock/sdk-utils';

// Base32 alphabet used by Stellar
const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

// CRC16-XMODEM implementation
function crc16(data: Buffer): number {
  let crc = 0x0000;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i] << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  return crc & 0xffff;
}

// Base32 encoding function
function base32Encode(data: Buffer): string {
  let result = '';
  let bits = 0;
  let value = 0;

  for (let i = 0; i < data.length; i++) {
    value = (value << 8) | data[i];
    bits += 8;

    while (bits >= 5) {
      bits -= 5;
      result += BASE32_ALPHABET[(value >>> bits) & 31];
    }
  }

  if (bits > 0) {
    result += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return result;
}

// Your working address derivation logic
function deriveAddressFromHex(publicKey: string): string {
  // If it's already a Stellar address, return it
  if (publicKey.startsWith('G') && publicKey.length === 56) {
    return publicKey;
  }

  try {
    // Convert hex to Buffer
    const pubKeyBuffer = Buffer.from(publicKey, 'hex');

    // Create payload with version byte (0x30 = 6 << 3 for account ID) + public key
    const payload = Buffer.alloc(33);
    payload[0] = 6 << 3; // Version byte for Account ID
    pubKeyBuffer.copy(payload, 1);

    // Calculate checksum
    const checksum = crc16(payload);

    // Create final buffer with payload + checksum
    const finalBuffer = Buffer.alloc(35);
    payload.copy(finalBuffer, 0);
    finalBuffer[33] = checksum & 0xff;
    finalBuffer[34] = (checksum >> 8) & 0xff;

    // Encode with base32
    const address = base32Encode(finalBuffer);

    return address;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to derive Stellar address: ${error.message}`);
    } else {
      throw new Error('Failed to derive Stellar address: Unknown error');
    }
  }
}

export const getAddressFromPublicKey = (publicKey: string | Uint8Array) => {
  let hexKey: string;

  // Convert input to hex string
  if (typeof publicKey === 'string') {
    hexKey = publicKey;
  } else {
    hexKey = uint8ArrayToHex(publicKey);
  }

  // Use the same derivation logic as CySync
  return deriveAddressFromHex(hexKey);
};
