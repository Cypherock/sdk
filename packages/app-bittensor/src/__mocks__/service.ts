import { jest } from '@jest/globals';

export const getLatestBlockHash = jest.fn();

jest.mock('../services/transaction', () => ({
  __esModule: true,
  getLatestBlockHash,
}));
