import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { IAuthDeviceTestCase } from './types';

const withUserRejection: IAuthDeviceTestCase = {
  name: 'When user rejects the device auth',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([26, 2, 10, 0]),
    },
  ],
  results: [
    {
      name: 'userRejection',
      data: new Uint8Array([26, 5, 26, 3, 176, 1, 1]),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.USER_REJECTION].message,
  mocks: {
    deviceInfo: {
      firmwareVersion: {
        major: 1,
        minor: 0,
        patch: 0,
      },
    },
  },
};

const withSerialSignatureFailure: IAuthDeviceTestCase = {
  name: 'Serial signature failure',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([26, 2, 10, 0]),
    },
    {
      name: 'result',
      data: new Uint8Array([26, 2, 26, 0]),
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
      statuses: [
        {
          flowStatus: 4,
          expectEventCalls: [0, 1],
        },
      ],
    },
    {
      name: 'flowComplete',
      data: new Uint8Array([26, 2, 34, 0]),
    },
  ],
  mocks: {
    eventCalls: [[0], [1]],
    deviceInfo: {
      firmwareVersion: {
        major: 1,
        minor: 0,
        patch: 0,
      },
    },
    verifySerialSignatureCalls: [
      [
        {
          postfix1: new Uint8Array([10, 22]),
          postfix2: new Uint8Array([24, 125]),
          serial: new Uint8Array([
            13, 49, 221, 64, 137, 35, 45, 158, 80, 19, 223, 142, 180, 13, 112,
            72, 118, 82, 63, 154, 121, 108,
          ]),
          signature: new Uint8Array([
            150, 122, 88, 129, 61, 16, 161, 42, 122, 107, 98, 35, 51, 47, 95,
            247, 86, 247, 2, 129, 35, 143, 222, 136, 154, 19, 160, 41, 37, 144,
            197, 190, 151, 236, 190, 86,
          ]),
        },
      ],
    ],
    challenge: undefined,
  },
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.DEVICE_AUTH_FAILED].message,
};

const withChallengeSignatureFailure: IAuthDeviceTestCase = {
  name: 'Challenge signature failure',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([26, 2, 10, 0]),
    },
    {
      name: 'challenge',
      data: new Uint8Array([
        26, 28, 18, 26, 10, 24, 63, 205, 246, 233, 246, 124, 84, 56, 185, 168,
        7, 161, 59, 122, 91, 176, 56, 76, 86, 11, 138, 118, 184, 167,
      ]),
    },
    {
      name: 'result',
      data: new Uint8Array([26, 2, 26, 0]),
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
      statuses: [
        {
          flowStatus: 4,
          expectEventCalls: [0, 1],
        },
      ],
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
    {
      name: 'flowComplete',
      data: new Uint8Array([26, 2, 34, 0]),
    },
  ],
  mocks: {
    eventCalls: [[0], [1]],
    deviceInfo: {
      firmwareVersion: {
        major: 1,
        minor: 0,
        patch: 0,
      },
    },
    challenge: new Uint8Array([
      63, 205, 246, 233, 246, 124, 84, 56, 185, 168, 7, 161, 59, 122, 91, 176,
      56, 76, 86, 11, 138, 118, 184, 167,
    ]),
    verifySerialSignatureCalls: [
      [
        {
          postfix1: new Uint8Array([10, 22]),
          postfix2: new Uint8Array([24, 125]),
          serial: new Uint8Array([
            13, 49, 221, 64, 137, 35, 45, 158, 80, 19, 223, 142, 180, 13, 112,
            72, 118, 82, 63, 154, 121, 108,
          ]),
          signature: new Uint8Array([
            150, 122, 88, 129, 61, 16, 161, 42, 122, 107, 98, 35, 51, 47, 95,
            247, 86, 247, 2, 129, 35, 143, 222, 136, 154, 19, 160, 41, 37, 144,
            197, 190, 151, 236, 190, 86,
          ]),
        },
      ],
    ],
    verifyChallengeSignatureCalls: [
      [
        {
          postfix1: new Uint8Array([10, 22]),
          postfix2: new Uint8Array([24, 125]),
          signature: new Uint8Array([
            150, 122, 88, 129, 61, 16, 161, 42, 122, 107, 98, 35, 51, 47, 95,
            247, 86, 247, 2, 129, 35, 143, 222, 136, 154, 19, 160, 41, 37, 144,
            197, 190, 151, 236, 190, 86,
          ]),
          challenge: new Uint8Array([
            63, 205, 246, 233, 246, 124, 84, 56, 185, 168, 7, 161, 59, 122, 91,
            176, 56, 76, 86, 11, 138, 118, 184, 167,
          ]),
          serial: new Uint8Array([
            13, 49, 221, 64, 137, 35, 45, 158, 80, 19, 223, 142, 180, 13, 112,
            72, 118, 82, 63, 154, 121, 108,
          ]),
          isTestApp: false,
          firmwareVersion: '1.0.0',
        },
      ],
    ],
    challengeVerified: false,
  },
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.DEVICE_AUTH_FAILED].message,
};

const error: IAuthDeviceTestCase[] = [
  withUserRejection,
  withSerialSignatureFailure,
  withChallengeSignatureFailure,
];

export default error;
