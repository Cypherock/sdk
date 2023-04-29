import { DeviceAppError } from '@cypherock/sdk-interfaces';
import { IAuthDeviceTestCase } from './types';

const withInvaidSerialSigData: IAuthDeviceTestCase = {
  name: 'Invalid data in serialSig step',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([26, 2, 10, 0]),
    },
    {
      name: 'challenge',
      data: new Uint8Array([
        26, 28, 18, 26, 10, 24, 250, 253, 111, 43, 36, 92, 54, 97, 161, 102,
        155, 13, 159, 32, 200, 231, 29, 105, 150, 133, 212, 45, 38, 206,
      ]),
    },
    {
      name: 'result',
      data: new Uint8Array([26, 4, 26, 2, 8, 1]),
    },
  ],
  results: [
    {
      name: 'serialSig',
      data: new Uint8Array([
        26, 48, 18, 46, 10, 2, 10, 22, 18, 2, 24, 125, 26, 36, 150, 122, 88,
        129, 61, 16, 161, 42, 122, 107, 98, 35, 51, 47, 95, 247, 86, 247, 2,
        129, 35, 143, 222, 136, 154, 19, 160, 41, 37, 144, 197, 190, 151, 236,
        190, 86,
      ]),
    },
    {
      name: 'challengeSig',
      data: new Uint8Array([
        26, 48, 18, 46, 10, 2, 10, 22, 18, 2, 24, 125, 26, 36, 150, 122, 88,
        129, 61, 16, 161, 42, 122, 107, 98, 35, 51, 47, 95, 247, 86, 247, 2,
        129, 35, 143, 222, 136, 154, 19, 160, 41, 37, 144, 197, 190, 151, 236,
        190, 86,
      ]),
    },
  ],
  errorInstance: DeviceAppError,
  mocks: {
    deviceInfo: {
      firmwareVersion: {
        major: 1,
        minor: 0,
        patch: 0,
      },
    },
    challenge: new Uint8Array([
      250, 253, 111, 43, 36, 92, 54, 97, 161, 102, 155, 13, 159, 32, 200, 231,
      29, 105, 150, 133, 212, 45, 38, 206,
    ]),
    challengeVerified: true,
  },
};

const withInvaidSerialSigData2: IAuthDeviceTestCase = {
  name: 'Invalid data in serialSig step',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([26, 2, 10, 0]),
    },
    {
      name: 'challenge',
      data: new Uint8Array([
        26, 28, 18, 26, 10, 24, 250, 253, 111, 43, 36, 92, 54, 97, 161, 102,
        155, 13, 159, 32, 200, 231, 29, 105, 150, 133, 212, 45, 38, 206,
      ]),
    },
    {
      name: 'result',
      data: new Uint8Array([26, 4, 26, 2, 8, 1]),
    },
  ],
  results: [
    {
      name: 'serialSig',
      data: new Uint8Array([
        18, 29, 10, 27, 10, 12, 172, 202, 213, 11, 207, 28, 212, 148, 211, 254,
        190, 172, 18, 9, 67, 121, 112, 104, 101, 114, 111, 99, 107, 24, 1,
      ]),
    },
    {
      name: 'challengeSig',
      data: new Uint8Array([
        26, 48, 18, 46, 10, 2, 10, 22, 18, 2, 24, 125, 26, 36, 150, 122, 88,
        129, 61, 16, 161, 42, 122, 107, 98, 35, 51, 47, 95, 247, 86, 247, 2,
        129, 35, 143, 222, 136, 154, 19, 160, 41, 37, 144, 197, 190, 151, 236,
        190, 86,
      ]),
    },
  ],
  errorInstance: DeviceAppError,
  mocks: {
    deviceInfo: {
      firmwareVersion: {
        major: 1,
        minor: 0,
        patch: 0,
      },
    },
    challenge: new Uint8Array([
      250, 253, 111, 43, 36, 92, 54, 97, 161, 102, 155, 13, 159, 32, 200, 231,
      29, 105, 150, 133, 212, 45, 38, 206,
    ]),
    challengeVerified: true,
  },
};

const withInvalidChallengeSigData: IAuthDeviceTestCase = {
  name: 'Invalid data in challengeSig step',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([26, 2, 10, 0]),
    },
    {
      name: 'challenge',
      data: new Uint8Array([
        26, 28, 18, 26, 10, 24, 250, 253, 111, 43, 36, 92, 54, 97, 161, 102,
        155, 13, 159, 32, 200, 231, 29, 105, 150, 133, 212, 45, 38, 206,
      ]),
    },
    {
      name: 'result',
      data: new Uint8Array([26, 4, 26, 2, 8, 1]),
    },
  ],
  results: [
    {
      name: 'serialSig',
      data: new Uint8Array([
        26, 72, 10, 70, 10, 2, 10, 22, 18, 2, 24, 125, 26, 22, 13, 49, 221, 64,
        137, 35, 45, 158, 80, 19, 223, 142, 180, 13, 112, 72, 118, 82, 63, 154,
        121, 108, 34, 36, 150, 122, 88, 129, 61, 16, 161, 42, 122, 107, 98, 35,
        51, 47, 95, 247, 86, 247, 2, 129, 35, 143, 222, 136, 154, 19, 160, 41,
        37, 144, 197, 190, 151, 236, 190, 86,
      ]),
    },
    {
      name: 'challengeSig',
      data: new Uint8Array([
        26, 72, 10, 70, 10, 2, 10, 22, 18, 2, 24, 125, 26, 22, 13, 49, 221, 64,
        137, 35, 45, 158, 80, 19, 223, 142, 180, 13, 112, 72, 118, 82, 63, 154,
        121, 108, 34, 36, 150, 122, 88, 129, 61, 16, 161, 42, 122, 107, 98, 35,
        51, 47, 95, 247, 86, 247, 2, 129, 35, 143, 222, 136, 154, 19, 160, 41,
        37, 144, 197, 190, 151, 236, 190, 86,
      ]),
    },
  ],
  errorInstance: DeviceAppError,
  mocks: {
    deviceInfo: {
      firmwareVersion: {
        major: 1,
        minor: 0,
        patch: 0,
      },
    },
    challenge: new Uint8Array([
      250, 253, 111, 43, 36, 92, 54, 97, 161, 102, 155, 13, 159, 32, 200, 231,
      29, 105, 150, 133, 212, 45, 38, 206,
    ]),
    challengeVerified: true,
  },
};

const withInvalidChallengeSigData2: IAuthDeviceTestCase = {
  name: 'Invalid data in challengeSig step',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([26, 2, 10, 0]),
    },
    {
      name: 'challenge',
      data: new Uint8Array([
        26, 28, 18, 26, 10, 24, 250, 253, 111, 43, 36, 92, 54, 97, 161, 102,
        155, 13, 159, 32, 200, 231, 29, 105, 150, 133, 212, 45, 38, 206,
      ]),
    },
    {
      name: 'result',
      data: new Uint8Array([26, 4, 26, 2, 8, 1]),
    },
  ],
  results: [
    {
      name: 'serialSig',
      data: new Uint8Array([
        26, 72, 10, 70, 10, 2, 10, 22, 18, 2, 24, 125, 26, 22, 13, 49, 221, 64,
        137, 35, 45, 158, 80, 19, 223, 142, 180, 13, 112, 72, 118, 82, 63, 154,
        121, 108, 34, 36, 150, 122, 88, 129, 61, 16, 161, 42, 122, 107, 98, 35,
        51, 47, 95, 247, 86, 247, 2, 129, 35, 143, 222, 136, 154, 19, 160, 41,
        37, 144, 197, 190, 151, 236, 190, 86,
      ]),
    },
    {
      name: 'challengeSig',
      data: new Uint8Array([
        18, 29, 10, 27, 10, 12, 172, 202, 213, 11, 207, 28, 212, 148, 211, 254,
        190, 172, 18, 9, 67, 121, 112, 104, 101, 114, 111, 99, 107, 24, 1,
      ]),
    },
  ],
  errorInstance: DeviceAppError,
  mocks: {
    deviceInfo: {
      firmwareVersion: {
        major: 1,
        minor: 0,
        patch: 0,
      },
    },
    challenge: new Uint8Array([
      250, 253, 111, 43, 36, 92, 54, 97, 161, 102, 155, 13, 159, 32, 200, 231,
      29, 105, 150, 133, 212, 45, 38, 206,
    ]),
    challengeVerified: true,
  },
};

const invalidData: IAuthDeviceTestCase[] = [
  withInvaidSerialSigData,
  withInvaidSerialSigData2,
  withInvalidChallengeSigData,
  withInvalidChallengeSigData2,
];

export default invalidData;
