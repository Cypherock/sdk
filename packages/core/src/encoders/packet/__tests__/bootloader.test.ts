import { describe, expect, test } from '@jest/globals';
import { stmXmodemEncode } from '../bootloader';
import { stmXmodemEncodeTestCases } from '../__fixtures__/bootloader';

describe('Bootloader Packet Encoder', () => {
  describe('stmXmodemEncode', () => {
    test('should return valid packets', () => {
      for (const testCase of stmXmodemEncodeTestCases.valid) {
        const result = stmXmodemEncode(testCase.data);
        expect(result).toEqual(testCase.packetList);
      }
    });

    test('should throw error with invalid data', () => {
      for (const testCase of stmXmodemEncodeTestCases.invalid) {
        expect(() => stmXmodemEncode(testCase)).toThrow();
      }
    });
  });
});
