import { describe, expect, test } from '@jest/globals';
import {
  isSDKSupported,
  getPacketVersionFromSDK,
  formatSDKVersion,
} from '../sdkVersions';
import { PacketVersionMap } from '../packetVersions';

interface Range {
  min: number;
  max: number;
}

function getRandomInt(range: Range) {
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

function generateRandomVersion(major: Range, minor: Range, patch: Range) {
  return `${getRandomInt(major)}.${getRandomInt(minor)}.${getRandomInt(patch)}`;
}

describe('SDK Version', () => {
  describe('isSDKSupported', () => {
    test('should support 2.6.*', () => {
      const versions = new Array(100).fill(0).map(() => {
        const minorVersion = getRandomInt({ min: 0, max: 9999 });
        return `2.6.${minorVersion}`;
      });
      versions.push('2.6.0');

      for (const version of versions) {
        const result = isSDKSupported(version);
        expect(result).toBeDefined();
        expect(result.isNewer).toEqual(false);
        expect(result.isSupported).toEqual(true);
      }
    });

    test('should support higher than 2.6.* and less than 3.1.0', () => {
      const versions = new Array(200)
        .fill(0)
        .map(() =>
          generateRandomVersion(
            { min: 2, max: 2 },
            { min: 6, max: 999 },
            { min: 0, max: 999 },
          ),
        );
      versions.push(
        ...new Array(200)
          .fill(0)
          .map(() =>
            generateRandomVersion(
              { min: 3, max: 3 },
              { min: 0, max: 0 },
              { min: 0, max: 999 },
            ),
          ),
      );

      for (const version of versions) {
        const result = isSDKSupported(version);
        expect(result).toBeDefined();
        expect(result.isNewer).toEqual(false);
        expect(result.isSupported).toEqual(true);
      }
    });

    test('should not support higher than 3.1.0', () => {
      const versions = new Array(200)
        .fill(0)
        .map(() =>
          generateRandomVersion(
            { min: 3, max: 100 },
            { min: 1, max: 999 },
            { min: 0, max: 999 },
          ),
        );

      for (const version of versions) {
        const result = isSDKSupported(version);
        expect(result).toBeDefined();
        expect(result.isNewer).toEqual(true);
        expect(result.isSupported).toEqual(false);
      }
    });

    test('should not support lower than 2.6.*', () => {
      const versions = new Array(200)
        .fill(0)
        .map(() =>
          generateRandomVersion(
            { min: 2, max: 2 },
            { min: 0, max: 5 },
            { min: 0, max: 999 },
          ),
        );

      for (let i = 0; i < 200; i += 1) {
        versions.push(
          generateRandomVersion(
            { min: 0, max: 1 },
            { min: 0, max: 999 },
            { min: 0, max: 999 },
          ),
        );
      }

      for (const version of versions) {
        const result = isSDKSupported(version);
        expect(result).toBeDefined();
        expect(result.isNewer).toEqual(false);
        expect(result.isSupported).toEqual(false);
      }
    });

    test('should throw error with invalid arguments', () => {
      const testCases: any[] = [null, undefined, '', 'asd', '1.asd'];

      for (const testCase of testCases) {
        expect(() => isSDKSupported(testCase)).toThrow();
      }
    });
  });

  describe('getPacketVersionFromSDK', () => {
    test('should return v2 for 1.*.*', () => {
      const versions = new Array(200)
        .fill(0)
        .map(() =>
          generateRandomVersion(
            { min: 1, max: 1 },
            { min: 0, max: 999 },
            { min: 0, max: 999 },
          ),
        );

      for (const version of versions) {
        const result = getPacketVersionFromSDK(version);
        expect(result).toBeDefined();
        expect(result).toEqual(PacketVersionMap.v2);
      }
    });

    test('should return v3 for 2.*.*, 3.*.*)', () => {
      const versions = new Array(200)
        .fill(0)
        .map(() =>
          generateRandomVersion(
            { min: 2, max: 3 },
            { min: 0, max: 999 },
            { min: 0, max: 999 },
          ),
        );

      for (const version of versions) {
        const result = getPacketVersionFromSDK(version);
        expect(result).toBeDefined();
        expect(result).toEqual(PacketVersionMap.v3);
      }
    });

    test('should return undefined for not supported', () => {
      const versions = new Array(200)
        .fill(0)
        .map(() =>
          generateRandomVersion(
            { min: 4, max: 999 },
            { min: 0, max: 999 },
            { min: 0, max: 999 },
          ),
        );

      for (let i = 0; i < 200; i += 1) {
        versions.push(
          generateRandomVersion(
            { min: 0, max: 0 },
            { min: 0, max: 999 },
            { min: 0, max: 999 },
          ),
        );
      }

      for (const version of versions) {
        const result = getPacketVersionFromSDK(version);
        expect(result).toBeUndefined();
      }
    });

    test('should throw error with invalid arguments', () => {
      const testCases: any[] = [null, undefined, '', 'asd', '1.asd'];
      for (const testCase of testCases) {
        expect(() => getPacketVersionFromSDK(testCase)).toThrow();
      }
    });
  });

  describe('formatSDKVersion', () => {
    test('it should return valid versions', () => {
      const testCases = [
        { raw: '000000000000', formatted: '0.0.0' },
        { raw: '000100020032', formatted: '1.2.50' },
        { raw: '000000f200a2', formatted: '0.242.162' },
        { raw: '020010000010', formatted: '512.4096.16' },
      ];

      for (const testCase of testCases) {
        const result = formatSDKVersion(testCase.raw);
        expect(result).toEqual(testCase.formatted);
      }
    });

    test('it should throw error with invalid parameters', () => {
      const testCases = [
        null,
        undefined,
        '',
        '0x1287612121',
        '3212',
        'asdgawvaseaw',
      ];

      for (const testCase of testCases) {
        expect(() => formatSDKVersion(testCase as any)).toThrow();
      }
    });
  });
});
