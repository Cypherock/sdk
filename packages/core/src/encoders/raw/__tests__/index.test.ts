import { describe, expect, test } from '@jest/globals';
import { decodeRawData, decodeStatus, encodeRawData } from '..';
import { PacketVersionMap } from '../../../utils';
import {
  decodeRawDataTestCases,
  decodeStatusTestCases,
  encodeRawDataTestCases,
  rawDataTestCases,
} from '../__fixtures__';

describe('Raw Encoder', () => {
  describe('encodeRawData', () => {
    test('should return valid packets', () => {
      for (const testCase of rawDataTestCases.validEncodings) {
        const result = encodeRawData(testCase.rawData, PacketVersionMap.v3);
        expect(result).toEqual(testCase.encoded);
      }
    });

    test('should throw error with invalid data', () => {
      for (const testCase of encodeRawDataTestCases.invalid) {
        expect(() =>
          encodeRawData(testCase.rawData as any, testCase.version as any),
        ).toThrow();
      }
    });
  });

  describe('decodeRawData', () => {
    test('should return valid packets', () => {
      for (const testCase of rawDataTestCases.validEncodings) {
        const result = decodeRawData(testCase.encoded, PacketVersionMap.v3);
        expect(result).toBeDefined();
        expect(result).toEqual(testCase.rawData);
      }
    });

    test('should throw error with invalid data', () => {
      for (const testCase of decodeRawDataTestCases.invalid) {
        expect(() =>
          decodeRawData(testCase.payload as any, testCase.version as any),
        ).toThrow();
      }
    });
  });

  describe('decodeStatus', () => {
    test('should return valid packets', () => {
      for (const testCase of decodeStatusTestCases.validEncodings) {
        const result = decodeStatus(testCase.encoded, PacketVersionMap.v3);
        expect(result).toBeDefined();
        expect(result).toEqual(testCase.status);
      }
    });

    test('should throw error with invalid data', () => {
      for (const testCase of decodeStatusTestCases.invalid) {
        expect(() =>
          decodeStatus(testCase.payload as any, testCase.version as any),
        ).toThrow();
      }
    });
  });
});
