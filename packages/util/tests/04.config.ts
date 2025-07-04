import { describe, expect, test, beforeEach, jest } from '@jest/globals';
import { getEnvVariable } from '../src';

describe('config.ts', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  describe('config', () => {
    test('should be able to change configuration from process.env', async () => {
      const customUrl = 'https://test.cypherock.com';

      process.env.API_CYPHEROCK = customUrl;

      const { getConfig } = await import('../src');
      const config = getConfig();

      expect(config).toBeDefined();
      expect(config.API_CYPHEROCK).toEqual(customUrl);
    });

    test('should have default value with no external configuration', async () => {
      const { getConfig } = await import('../src');
      const config = getConfig();

      expect(config).toBeDefined();
      expect(config.API_CYPHEROCK).toEqual('https://api.cypherock.com');
    });
  });

  describe('getEnvVariable', () => {
    test('should throw error when required field is not found', async () => {
      expect(() => getEnvVariable('TEST')).toThrowError();
    });
  });
});
