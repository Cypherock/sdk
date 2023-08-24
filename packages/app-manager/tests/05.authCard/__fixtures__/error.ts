import {
  DeviceAppError,
  DeviceAppErrorType,
  deviceAppErrorTypeDetails,
} from '@cypherock/sdk-interfaces';
import { IAuthCardTestCase } from './types';
import { CardError } from '../../../src';

const withUserRejection: IAuthCardTestCase = {
  name: 'When user rejects the card auth',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([34, 2, 10, 0]),
    },
  ],
  results: [
    {
      name: 'userRejection',
      data: new Uint8Array([34, 5, 26, 3, 176, 1, 1]),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.USER_REJECTION].message,
};

const withCardError: IAuthCardTestCase = {
  name: 'When card error',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([34, 2, 10, 0]),
    },
  ],
  results: [
    {
      name: 'userRejection',
      data: new Uint8Array([34, 5, 26, 3, 168, 1, 1]),
    },
  ],
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.CARD_OPERATION_FAILED]
      .subError[CardError.CARD_ERROR_NOT_PAIRED].message,
};

const withSerialSignatureFailure: IAuthCardTestCase = {
  name: 'Serial signature failure',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([34, 2, 10, 0]),
    },
    {
      name: 'result',
      data: new Uint8Array([34, 2, 26, 0]),
    },
  ],
  results: [
    {
      name: 'serialSig',
      data: new Uint8Array([
        34, 74, 10, 72, 10, 34, 19, 93, 166, 151, 183, 121, 160, 50, 206, 70,
        21, 65, 198, 6, 190, 51, 16, 36, 188, 193, 249, 37, 104, 104, 118, 83,
        191, 142, 10, 5, 66, 125, 215, 106, 18, 34, 131, 23, 205, 123, 111, 180,
        52, 54, 198, 169, 90, 213, 197, 169, 16, 220, 12, 44, 36, 104, 31, 16,
        157, 147, 215, 158, 161, 44, 66, 187, 175, 98, 22, 97,
      ]),
      statuses: [
        {
          flowStatus: 2,
          expectEventCalls: [0, 1, 2],
        },
      ],
    },
    {
      name: 'flowComplete',
      data: new Uint8Array([34, 2, 34, 0]),
    },
  ],
  mocks: {
    eventCalls: [[0], [1], [2]],
    challenge: undefined,
    verifySerialSignatureCalls: [
      [
        {
          serial: new Uint8Array([
            19, 93, 166, 151, 183, 121, 160, 50, 206, 70, 21, 65, 198, 6, 190,
            51, 16, 36, 188, 193, 249, 37, 104, 104, 118, 83, 191, 142, 10, 5,
            66, 125, 215, 106,
          ]),
          signature: new Uint8Array([
            131, 23, 205, 123, 111, 180, 52, 54, 198, 169, 90, 213, 197, 169,
            16, 220, 12, 44, 36, 104, 31, 16, 157, 147, 215, 158, 161, 44, 66,
            187, 175, 98, 22, 97,
          ]),
          message: new Uint8Array([
            32, 241, 249, 237, 102, 217, 89, 181, 26, 9, 4, 130, 117, 252, 65,
            28, 92, 243, 29, 107, 226, 72, 28, 165, 188, 34, 86, 236, 250, 158,
            21, 35,
          ]),
        },
      ],
    ],
  },
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.CARD_AUTH_FAILED].message,
};

const withChallengeSignatureFailure: IAuthCardTestCase = {
  name: 'Challenge signature failure',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([34, 2, 10, 0]),
    },
    {
      name: 'challenge',
      data: new Uint8Array([
        34, 28, 18, 26, 10, 24, 25, 250, 69, 179, 135, 118, 1, 5, 121, 13, 163,
        254, 191, 113, 130, 130, 3, 127, 216, 89, 74, 57, 110, 215,
      ]),
    },
    {
      name: 'result',
      data: new Uint8Array([34, 2, 26, 0]),
    },
  ],
  results: [
    {
      name: 'serialSig',
      data: new Uint8Array([
        34, 74, 10, 72, 10, 34, 19, 93, 166, 151, 183, 121, 160, 50, 206, 70,
        21, 65, 198, 6, 190, 51, 16, 36, 188, 193, 249, 37, 104, 104, 118, 83,
        191, 142, 10, 5, 66, 125, 215, 106, 18, 34, 131, 23, 205, 123, 111, 180,
        52, 54, 198, 169, 90, 213, 197, 169, 16, 220, 12, 44, 36, 104, 31, 16,
        157, 147, 215, 158, 161, 44, 66, 187, 175, 98, 22, 97,
      ]),
    },
    {
      name: 'challengeSig',
      data: new Uint8Array([
        34, 39, 18, 37, 10, 35, 114, 199, 196, 130, 166, 119, 166, 232, 169,
        250, 224, 38, 73, 242, 72, 66, 107, 63, 69, 96, 72, 63, 115, 53, 44, 9,
        207, 133, 84, 104, 141, 85, 215, 54, 106,
      ]),
    },
    {
      name: 'flowComplete',
      data: new Uint8Array([34, 2, 34, 0]),
    },
  ],
  mocks: {
    eventCalls: [[0], [1], [2], [3]],
    challenge: new Uint8Array([
      25, 250, 69, 179, 135, 118, 1, 5, 121, 13, 163, 254, 191, 113, 130, 130,
      3, 127, 216, 89, 74, 57, 110, 215,
    ]),
    challengeVerified: false,
    verifySerialSignatureCalls: [
      [
        {
          serial: new Uint8Array([
            19, 93, 166, 151, 183, 121, 160, 50, 206, 70, 21, 65, 198, 6, 190,
            51, 16, 36, 188, 193, 249, 37, 104, 104, 118, 83, 191, 142, 10, 5,
            66, 125, 215, 106,
          ]),
          signature: new Uint8Array([
            131, 23, 205, 123, 111, 180, 52, 54, 198, 169, 90, 213, 197, 169,
            16, 220, 12, 44, 36, 104, 31, 16, 157, 147, 215, 158, 161, 44, 66,
            187, 175, 98, 22, 97,
          ]),
          message: new Uint8Array([
            32, 241, 249, 237, 102, 217, 89, 181, 26, 9, 4, 130, 117, 252, 65,
            28, 92, 243, 29, 107, 226, 72, 28, 165, 188, 34, 86, 236, 250, 158,
            21, 35,
          ]),
        },
      ],
    ],
    verifyChallengeSignatureCalls: [
      [
        {
          challenge: new Uint8Array([
            25, 250, 69, 179, 135, 118, 1, 5, 121, 13, 163, 254, 191, 113, 130,
            130, 3, 127, 216, 89, 74, 57, 110, 215,
          ]),
          serial: new Uint8Array([
            19, 93, 166, 151, 183, 121, 160, 50, 206, 70, 21, 65, 198, 6, 190,
            51, 16, 36, 188, 193, 249, 37, 104, 104, 118, 83, 191, 142, 10, 5,
            66, 125, 215, 106,
          ]),
          signature: new Uint8Array([
            114, 199, 196, 130, 166, 119, 166, 232, 169, 250, 224, 38, 73, 242,
            72, 66, 107, 63, 69, 96, 72, 63, 115, 53, 44, 9, 207, 133, 84, 104,
            141, 85, 215, 54, 106,
          ]),
          firmwareVersion: '0.0.0',
        },
      ],
    ],
  },
  errorInstance: DeviceAppError,
  errorMessage:
    deviceAppErrorTypeDetails[DeviceAppErrorType.CARD_AUTH_FAILED].message,
};

const error: IAuthCardTestCase[] = [
  withUserRejection,
  withCardError,
  withSerialSignatureFailure,
  withChallengeSignatureFailure,
];

export default error;
