import { ISDK } from '@cypherock/sdk-core';
import { DeviceState } from '@cypherock/sdk-interfaces';
import { jest } from '@jest/globals';

let sequenceNumber = 0;

export const getStatus = jest.fn<ISDK['getStatus']>();
export const sendAbort = jest.fn<ISDK['sendAbort']>();
export const getResult = jest.fn<ISDK['getResult']>();
export const sendQuery = jest.fn<ISDK['sendQuery']>();

export const configureAppletId = jest.fn<ISDK['configureAppletId']>();
export const checkAppCompatibility = jest.fn<ISDK['checkAppCompatibility']>();

export const waitForResult = jest.fn<ISDK['waitForResult']>();
export const getSequenceNumber = jest.fn<ISDK['getSequenceNumber']>(
  async () => sequenceNumber,
);
export const getNewSequenceNumber = jest.fn<ISDK['getNewSequenceNumber']>(
  async () => {
    sequenceNumber += 1;
    return sequenceNumber;
  },
);

export const runOperation = jest.fn<ISDK['runOperation']>(func => func());

export const destroy = jest.fn<ISDK['destroy']>();
export const getDeviceState = jest.fn<ISDK['getDeviceState']>(
  async () => DeviceState.MAIN,
);

export const create = jest.fn(async () =>
  Promise.resolve({
    configureAppletId,
    checkAppCompatibility,
    sendAbort,
    getResult,
    getStatus,
    sendQuery,
    waitForResult,
    getSequenceNumber,
    getNewSequenceNumber,
    runOperation,
    destroy,
    getDeviceState,
  }),
);

jest.mock('@cypherock/sdk-core', () => {
  const originalModule: any = jest.requireActual('@cypherock/sdk-core');

  return {
    __esModule: true,
    ...originalModule,
    SDK: {
      create,
    },
  };
});
