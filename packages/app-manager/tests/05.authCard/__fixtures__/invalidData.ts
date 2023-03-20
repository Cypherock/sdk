import { DeviceAppError } from '@cypherock/sdk-interfaces';
import { IAuthCardTestCase } from './types';

const withInvaidSerialSigData: IAuthCardTestCase = {
  name: 'Invalid data in serialSig step',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([34, 2, 10, 0]),
    },
  ],
  results: [
    {
      name: 'serialSig',
      data: new Uint8Array([
        34, 62, 10, 60, 10, 24, 142, 25, 5, 198, 236, 185, 206, 147, 215, 202,
        32, 12, 33, 164, 252, 205, 209, 52, 110, 243, 37, 33, 251, 198, 114,
        232, 67, 60, 6, 252, 240, 72, 5, 115, 235, 100, 193, 252, 26, 55, 2,
        196, 165,
      ]),
    },
  ],
  errorInstance: DeviceAppError,
};

const withInvaidSerialSigData2: IAuthCardTestCase = {
  name: 'Invalid data in serialSig step',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([34, 2, 10, 0]),
    },
  ],
  results: [
    {
      name: 'serialSig',
      data: new Uint8Array([
        105, 46, 115, 113, 200, 105, 202, 105, 203, 201, 104, 200, 148, 61, 18,
        32, 12, 33, 164, 252, 205, 209, 52, 110, 243, 37, 33, 251, 198, 114,
        232, 67, 60, 6, 252, 240, 72, 5, 115, 235, 100, 193, 252, 26, 55, 2,
        196, 165,
      ]),
    },
  ],
  errorInstance: DeviceAppError,
};

const withInvalidChallengeSigData: IAuthCardTestCase = {
  name: 'Invalid data in challengeSig step',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([34, 2, 10, 0]),
    },
    {
      name: 'challenge',
      data: new Uint8Array([
        34, 32, 18, 30, 10, 28, 91, 43, 48, 103, 233, 161, 221, 174, 200, 188,
        58, 150, 248, 9, 194, 145, 154, 20, 240, 2, 0, 243, 245, 127, 1, 90,
        115, 37,
      ]),
    },
  ],
  results: [
    {
      name: 'serialSig',
      data: new Uint8Array([
        34, 62, 10, 60, 10, 24, 142, 25, 5, 198, 236, 185, 206, 147, 215, 202,
        105, 46, 115, 113, 200, 105, 202, 105, 203, 201, 104, 200, 148, 61, 18,
        32, 12, 33, 164, 252, 205, 209, 52, 110, 243, 37, 33, 251, 198, 114,
        232, 67, 60, 6, 252, 240, 72, 5, 115, 235, 100, 193, 252, 26, 55, 2,
        196, 165,
      ]),
    },
    {
      name: 'challengeSig',
      data: new Uint8Array([
        34, 36, 18, 34, 10, 32, 110, 18, 146, 170, 47, 162, 166, 84, 178, 57,
        204, 158, 229, 107, 113, 214, 188,
      ]),
    },
  ],
  errorInstance: DeviceAppError,
  mocks: {
    challenge: new Uint8Array([
      91, 43, 48, 103, 233, 161, 221, 174, 200, 188, 58, 150, 248, 9, 194, 145,
      154, 20, 240, 2, 0, 243, 245, 127, 1, 90, 115, 37,
    ]),
  },
};

const withInvalidChallengeSigData2: IAuthCardTestCase = {
  name: 'Invalid data in challengeSig step',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([34, 2, 10, 0]),
    },
    {
      name: 'challenge',
      data: new Uint8Array([
        34, 32, 18, 30, 10, 28, 91, 43, 48, 103, 233, 161, 221, 174, 200, 188,
        58, 150, 248, 9, 194, 145, 154, 20, 240, 2, 0, 243, 245, 127, 1, 90,
        115, 37,
      ]),
    },
  ],
  results: [
    {
      name: 'serialSig',
      data: new Uint8Array([
        34, 62, 10, 60, 10, 24, 142, 25, 5, 198, 236, 185, 206, 147, 215, 202,
        105, 46, 115, 113, 200, 105, 202, 105, 203, 201, 104, 200, 148, 61, 18,
        32, 12, 33, 164, 252, 205, 209, 52, 110, 243, 37, 33, 251, 198, 114,
        232, 67, 60, 6, 252, 240, 72, 5, 115, 235, 100, 193, 252, 26, 55, 2,
        196, 165,
      ]),
    },
    {
      name: 'challengeSig',
      data: new Uint8Array([
        180, 174, 155, 207, 154, 42, 142, 121, 176, 134, 225, 0, 48, 44, 101,
        204, 158, 229, 107, 113, 214, 188,
      ]),
    },
  ],
  errorInstance: DeviceAppError,
  mocks: {
    challenge: new Uint8Array([
      91, 43, 48, 103, 233, 161, 221, 174, 200, 188, 58, 150, 248, 9, 194, 145,
      154, 20, 240, 2, 0, 243, 245, 127, 1, 90, 115, 37,
    ]),
  },
};

const invalidData: IAuthCardTestCase[] = [
  withInvaidSerialSigData,
  withInvaidSerialSigData2,
  withInvalidChallengeSigData,
  withInvalidChallengeSigData2,
];

export default invalidData;
