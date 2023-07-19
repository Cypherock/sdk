import { describe, expect, test } from '@jest/globals';
import { getAddressFromPublicKeyTestCases } from '../__fixtures__';
import { getAddressFromPublicKey } from '..';

describe('getAddressFromPublicKey', () => {
  test('should return valid packets', () => {
    for (const testCase of getAddressFromPublicKeyTestCases.valid) {
      const result = getAddressFromPublicKey(
        testCase.input.publicKey,
        testCase.input.derivationPath,
      );
      expect(result).toEqual(testCase.output);
    }
  });

  test('should throw error for invalid path', () => {
    for (const testCase of getAddressFromPublicKeyTestCases.invalid) {
      expect(() =>
        getAddressFromPublicKey(testCase.publicKey, testCase.derivationPath),
      ).toThrow();
    }
  });
});
