import { jest } from '@jest/globals';

export const post = jest.fn();
export const get = jest.fn();

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    post,
    get,
  },
}));
