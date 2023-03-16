import { jest } from '@jest/globals';

let sequenceNumber = 0;

export const getStatus = jest.fn();
export const sendAbort = jest.fn();
export const getResult = jest.fn();
export const sendQuery = jest.fn();

export const waitForResult = jest.fn();
export const getSequenceNumber = jest.fn(() => sequenceNumber);
export const getNewSequenceNumber = jest.fn(() => {
  sequenceNumber += 1;
  return sequenceNumber;
});

export const wrapOperation = jest.fn((func: () => Promise<void>) => func());

export const destroy = jest.fn();

export const create = jest.fn(async () =>
  Promise.resolve({
    sendAbort,
    getResult,
    getStatus,
    sendQuery,
    waitForResult,
    getSequenceNumber,
    getNewSequenceNumber,
    wrapOperation,
    destroy,
  }),
);

jest.mock('@cypherock/sdk-core', () => ({
  create,
}));
