import { describe, expect, test } from '@jest/globals';
import { getAddressFromPublicKeyTestCases } from '../__fixtures__';
import { getAddressFromPublicKey } from '..';

describe('getAddressFromPublicKey', () => {
  test('should return valid packets', async () => {
    for (const testCase of getAddressFromPublicKeyTestCases.valid) {
      const result = await getAddressFromPublicKey(
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
      ).rejects.toThrow();
    }
  });
});
