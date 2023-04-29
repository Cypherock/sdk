import { jest } from '@jest/globals';

export const getDeviceInfo = jest.fn();

jest.mock('../operations/getDeviceInfo', () => ({
  __esModule: true,
  getDeviceInfo,
}));
