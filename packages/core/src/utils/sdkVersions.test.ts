import { describe, expect, test } from '@jest/globals';
import { isSDKSupported, getPacketVersionFromSDK } from './sdkVersions';
import { PacketVersionMap } from './packetVersions';

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
    test('should support 2.5.*', () => {
      const versions = new Array(500).fill(0).map(() => {
        const minorVersion = getRandomInt({ min: 0, max: 9999 });
        return `2.5.${minorVersion}`;
      });
      versions.push('2.5.0');

      for (const version of versions) {
        const result = isSDKSupported(version);
        expect(result).toBeDefined();
        expect(result.isNewer).toEqual(false);
        expect(result.isSupported).toEqual(true);
      }
    });

    test('should not support higher than 2.5.*', () => {
      const versions = new Array(200)
        .fill(0)
        .map(() =>
          generateRandomVersion(
            { min: 2, max: 2 },
            { min: 6, max: 999 },
            { min: 0, max: 999 }
          )
        );

      for (let i = 0; i < 200; i += 1) {
        versions.push(
          generateRandomVersion(
            { min: 3, max: 100 },
            { min: 0, max: 999 },
            { min: 0, max: 999 }
          )
        );
      }

      for (const version of versions) {
        const result = isSDKSupported(version);
        expect(result).toBeDefined();
        expect(result.isNewer).toEqual(true);
        expect(result.isSupported).toEqual(false);
      }
    });

    test('should not support lower than 2.5.*', () => {
      const versions = new Array(200)
        .fill(0)
        .map(() =>
          generateRandomVersion(
            { min: 2, max: 2 },
            { min: 0, max: 4 },
            { min: 0, max: 999 }
          )
        );

      for (let i = 0; i < 200; i += 1) {
        versions.push(
          generateRandomVersion(
            { min: 0, max: 1 },
            { min: 0, max: 999 },
            { min: 0, max: 999 }
          )
        );
      }

      for (const version of versions) {
        const result = isSDKSupported(version);
        expect(result).toBeDefined();
        expect(result.isNewer).toEqual(false);
        expect(result.isSupported).toEqual(false);
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
            { min: 0, max: 999 }
          )
        );

      for (const version of versions) {
        const result = getPacketVersionFromSDK(version);
        expect(result).toBeDefined();
        expect(result).toEqual(PacketVersionMap.v2);
      }
    });

    test('should return v3 for 2.*.*', () => {
      const versions = new Array(200)
        .fill(0)
        .map(() =>
          generateRandomVersion(
            { min: 2, max: 2 },
            { min: 0, max: 999 },
            { min: 0, max: 999 }
          )
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
            { min: 3, max: 999 },
            { min: 0, max: 999 },
            { min: 0, max: 999 }
          )
        );

      for (let i = 0; i < 200; i += 1) {
        versions.push(
          generateRandomVersion(
            { min: 0, max: 0 },
            { min: 0, max: 999 },
            { min: 0, max: 999 }
          )
        );
      }

      for (const version of versions) {
        const result = getPacketVersionFromSDK(version);
        expect(result).toBeUndefined();
      }
    });
  });
});
