import { describe, expect, test } from '@jest/globals';
import { byteStuffing, byteUnstuffing } from '../crypto';
import { PacketVersionMap } from '../packetVersions';

describe('Crypto Util', () => {
  describe('byteStuffing', () => {
    test('should return valid results for v1', () => {
      const testCases = [
        {
          raw: new Uint8Array([18, 165, 27, 22, 18, 174]),
          stuffed: '12a51b1612ae',
        },
        {
          raw: new Uint8Array([18, 170, 27, 22, 18, 170]),
          stuffed: '12a33a1b1612a33a',
        },
        {
          raw: new Uint8Array([18, 170, 27, 163, 18, 170]),
          stuffed: '12a33a1ba33312a33a',
        },
      ];

      for (const testCase of testCases) {
        const result = byteStuffing(testCase.raw, PacketVersionMap.v1);
        expect(result).toEqual(testCase.stuffed);
      }
    });

    test('should return valid results for v2', () => {
      const testCases = [
        {
          raw: new Uint8Array([18, 165, 27, 22, 18, 174]),
          stuffed: '12a51b1612ae',
        },
        {
          raw: new Uint8Array([18, 90, 27, 22, 18, 90]),
          stuffed: '12a33a1b1612a33a',
        },
        {
          raw: new Uint8Array([18, 90, 27, 163, 18, 90]),
          stuffed: '12a33a1ba33312a33a',
        },
      ];

      for (const testCase of testCases) {
        const result = byteStuffing(testCase.raw, PacketVersionMap.v2);
        expect(result).toEqual(testCase.stuffed);
      }
    });

    test('should return error with invalid inputs', () => {
      const testCases = [
        {
          data: new Uint8Array([18, 165, 27, 22, 18, 174]),
          version: null,
        },
        {
          data: null,
          version: PacketVersionMap.v1,
        },
        {
          data: new Uint8Array([18, 165, 27, 22, 18, 174]),
          version: undefined,
        },
        {
          data: undefined,
          version: PacketVersionMap.v1,
        },
        {
          data: new Uint8Array([]),
          version: PacketVersionMap.v2,
        },
      ];

      for (const testCase of testCases) {
        expect(() =>
          byteStuffing(testCase.data as any, testCase.version as any),
        ).toThrow();
      }
    });
  });

  describe('byteUnstuffing', () => {
    test('should return valid results for v1', () => {
      const testCases = [
        {
          raw: new Uint8Array([18, 165, 27, 22, 18, 174]),
          unstuffed: '12a51b1612ae',
        },
        {
          raw: new Uint8Array([18, 163, 58, 27, 22, 18, 163, 58]),
          unstuffed: '12aa1b1612aa',
        },
        {
          raw: new Uint8Array([18, 163, 58, 27, 163, 51, 18, 163, 58]),
          unstuffed: '12aa1ba312aa',
        },
      ];

      for (const testCase of testCases) {
        const result = byteUnstuffing(testCase.raw, PacketVersionMap.v1);
        expect(result).toEqual(testCase.unstuffed);
      }
    });

    test('should return valid results for v2', () => {
      const testCases = [
        {
          raw: new Uint8Array([18, 165, 27, 22, 18, 174]),
          unstuffed: '12a51b1612ae',
        },
        {
          raw: new Uint8Array([18, 163, 58, 27, 22, 18, 163, 58]),
          unstuffed: '125a1b16125a',
        },
        {
          raw: new Uint8Array([18, 163, 58, 27, 163, 51, 18, 163, 58]),
          unstuffed: '125a1ba3125a',
        },
      ];

      for (const testCase of testCases) {
        const result = byteUnstuffing(testCase.raw, PacketVersionMap.v2);
        expect(result).toEqual(testCase.unstuffed);
      }
    });

    test('should return error with invalid inputs', () => {
      const testCases = [
        {
          data: new Uint8Array([18, 165, 27, 22, 18, 174]),
          version: null,
        },
        {
          data: null,
          version: PacketVersionMap.v1,
        },
        {
          data: new Uint8Array([18, 165, 27, 22, 18, 174]),
          version: undefined,
        },
        {
          data: undefined,
          version: PacketVersionMap.v1,
        },
        {
          data: new Uint8Array([]),
          version: PacketVersionMap.v2,
        },
      ];

      for (const testCase of testCases) {
        expect(() =>
          byteUnstuffing(testCase.data as any, testCase.version as any),
        ).toThrow();
      }
    });
  });
});
