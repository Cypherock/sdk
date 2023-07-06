import { IAuthDeviceTestCase } from './types';

const withValidData: IAuthDeviceTestCase = {
  name: 'With valid data',
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
      statuses: [
        {
          flowStatus: 0,
          expectEventCalls: [0],
        },
        {
          flowStatus: 1,
          expectEventCalls: [1],
        },
        {
          flowStatus: 2,
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
    challenge: new Uint8Array([
      250, 253, 111, 43, 36, 92, 54, 97, 161, 102, 155, 13, 159, 32, 200, 231,
      29, 105, 150, 133, 212, 45, 38, 206,
    ]),
    challengeVerified: true,
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
            250, 253, 111, 43, 36, 92, 54, 97, 161, 102, 155, 13, 159, 32, 200,
            231, 29, 105, 150, 133, 212, 45, 38, 206,
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
    eventCalls: [[0], [1]],
    deviceInfo: {
      firmwareVersion: {
        major: 1,
        minor: 0,
        patch: 0,
      },
    },
  },
};

const withPartiallySkippedStatus: IAuthDeviceTestCase = {
  name: 'With partial skipped statuses',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([26, 2, 10, 0]),
    },
    {
      name: 'challenge',
      data: new Uint8Array([
        26, 28, 18, 26, 10, 24, 143, 38, 255, 171, 87, 190, 161, 60, 70, 86, 74,
        222, 253, 255, 156, 88, 108, 38, 69, 58, 133, 74, 131, 172,
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
    deviceInfo: {
      firmwareVersion: {
        major: 1,
        minor: 0,
        patch: 0,
      },
    },
    challenge: new Uint8Array([
      143, 38, 255, 171, 87, 190, 161, 60, 70, 86, 74, 222, 253, 255, 156, 88,
      108, 38, 69, 58, 133, 74, 131, 172,
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
            143, 38, 255, 171, 87, 190, 161, 60, 70, 86, 74, 222, 253, 255, 156,
            88, 108, 38, 69, 58, 133, 74, 131, 172,
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
    challengeVerified: true,
    eventCalls: [[0], [1]],
  },
};

const withSkippedStatuses: IAuthDeviceTestCase = {
  name: 'With skipped statuses',
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
      statuses: [],
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
    challengeVerified: true,
  },
};

const valid: IAuthDeviceTestCase[] = [
  withValidData,
  withPartiallySkippedStatus,
  withSkippedStatuses,
];

export default valid;
