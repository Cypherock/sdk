import { jest } from '@jest/globals';

export const post = jest.fn();
export const get = jest.fn();

jest.mock('../utils/http', () => ({
  __esModule: true,
  http: {
    post,
    get,
  },
}));
