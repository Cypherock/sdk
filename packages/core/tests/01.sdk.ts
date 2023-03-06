import { describe, expect, test } from '@jest/globals';
import SDK from '../src/sdk';

describe('01. getSDKVersion', () => {
  test('should throw error with invalid arguments', () => {
    const testCases = [null, undefined];

    for (const testCase of testCases) {
      expect(SDK.getSDKVersion(testCase as any)).rejects.toThrow();
    }
  });
});
