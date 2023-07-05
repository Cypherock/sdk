import { IAuthCardTestCase } from './types';

const withValidData: IAuthCardTestCase = {
  name: 'With valid data',
  params: {
    cardNumber: null as any,
  },
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
    {
      name: 'result',
      data: new Uint8Array([34, 4, 26, 2, 8, 1]),
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
      statuses: [
        {
          flowStatus: 0,
          expectEventCalls: [0],
        },
        {
          flowStatus: 1,
          expectEventCalls: [1],
        },
      ],
    },
    {
      name: 'challengeSig',
      data: new Uint8Array([
        34, 36, 18, 34, 10, 32, 110, 18, 146, 170, 47, 162, 166, 84, 178, 57,
        180, 174, 155, 207, 154, 42, 142, 121, 176, 134, 225, 0, 48, 44, 101,
        204, 158, 229, 107, 113, 214, 188,
      ]),
    },
    {
      name: 'flowComplete',
      data: new Uint8Array([34, 2, 34, 0]),
    },
  ],
  mocks: {
    challenge: new Uint8Array([
      91, 43, 48, 103, 233, 161, 221, 174, 200, 188, 58, 150, 248, 9, 194, 145,
      154, 20, 240, 2, 0, 243, 245, 127, 1, 90, 115, 37,
    ]),
    challengeVerified: true,
    eventCalls: [[0], [1], [2], [3], [4]],
    verifySerialSignatureCalls: [
      [
        {
          serial: new Uint8Array([
            142, 25, 5, 198, 236, 185, 206, 147, 215, 202, 105, 46, 115, 113,
            200, 105, 202, 105, 203, 201, 104, 200, 148, 61,
          ]),
          signature: new Uint8Array([
            12, 33, 164, 252, 205, 209, 52, 110, 243, 37, 33, 251, 198, 114,
            232, 67, 60, 6, 252, 240, 72, 5, 115, 235, 100, 193, 252, 26, 55, 2,
            196, 165,
          ]),
          message: new Uint8Array([
            0, 254, 119, 136, 186, 99, 7, 17, 175, 104, 196, 9, 16, 15, 42, 184,
            208, 120, 160, 166, 176, 106, 169, 108, 17, 153, 132, 111, 251, 12,
            180, 61,
          ]),
        },
      ],
    ],
    verifyChallengeSignatureCalls: [
      [
        {
          serial: new Uint8Array([
            142, 25, 5, 198, 236, 185, 206, 147, 215, 202, 105, 46, 115, 113,
            200, 105, 202, 105, 203, 201, 104, 200, 148, 61,
          ]),
          challenge: new Uint8Array([
            91, 43, 48, 103, 233, 161, 221, 174, 200, 188, 58, 150, 248, 9, 194,
            145, 154, 20, 240, 2, 0, 243, 245, 127, 1, 90, 115, 37,
          ]),
          signature: new Uint8Array([
            110, 18, 146, 170, 47, 162, 166, 84, 178, 57, 180, 174, 155, 207,
            154, 42, 142, 121, 176, 134, 225, 0, 48, 44, 101, 204, 158, 229,
            107, 113, 214, 188,
          ]),
          firmwareVersion: '0.0.0',
        },
      ],
    ],
  },
};

const withPartiallySkippedStatus: IAuthCardTestCase = {
  name: 'With partial skipped statuses',
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([34, 2, 10, 0]),
    },
    {
      name: 'challenge',
      data: new Uint8Array([
        34, 34, 18, 32, 10, 30, 241, 128, 110, 126, 86, 168, 164, 255, 27, 176,
        12, 227, 184, 63, 81, 59, 31, 35, 108, 135, 159, 239, 36, 110, 13, 169,
        31, 71, 188, 241,
      ]),
    },
    {
      name: 'result',
      data: new Uint8Array([34, 4, 26, 2, 8, 1]),
    },
  ],
  results: [
    {
      name: 'serialSig',
      data: new Uint8Array([
        34, 62, 10, 60, 10, 24, 40, 133, 211, 25, 83, 197, 228, 28, 119, 162,
        159, 35, 87, 88, 87, 165, 247, 26, 152, 179, 7, 201, 96, 67, 18, 32,
        110, 18, 146, 170, 47, 162, 166, 84, 178, 57, 180, 174, 155, 207, 154,
        42, 142, 121, 176, 134, 225, 0, 48, 44, 101, 204, 158, 229, 107, 113,
        214, 188,
      ]),
      statuses: [
        {
          flowStatus: 3,
          expectEventCalls: [0, 1, 2, 3],
        },
      ],
    },
    {
      name: 'challengeSig',
      data: new Uint8Array([
        34, 38, 18, 36, 10, 34, 5, 67, 73, 90, 189, 27, 123, 252, 198, 97, 250,
        37, 114, 94, 184, 237, 197, 41, 58, 115, 226, 92, 25, 121, 48, 39, 226,
        71, 241, 117, 102, 156, 189, 63,
      ]),
    },
    {
      name: 'flowComplete',
      data: new Uint8Array([34, 2, 34, 0]),
    },
  ],
  mocks: {
    challenge: new Uint8Array([
      241, 128, 110, 126, 86, 168, 164, 255, 27, 176, 12, 227, 184, 63, 81, 59,
      31, 35, 108, 135, 159, 239, 36, 110, 13, 169, 31, 71, 188, 241,
    ]),
    challengeVerified: true,
    eventCalls: [[0], [1], [2], [3], [4]],
    verifySerialSignatureCalls: [
      [
        {
          serial: new Uint8Array([
            40, 133, 211, 25, 83, 197, 228, 28, 119, 162, 159, 35, 87, 88, 87,
            165, 247, 26, 152, 179, 7, 201, 96, 67,
          ]),
          signature: new Uint8Array([
            110, 18, 146, 170, 47, 162, 166, 84, 178, 57, 180, 174, 155, 207,
            154, 42, 142, 121, 176, 134, 225, 0, 48, 44, 101, 204, 158, 229,
            107, 113, 214, 188,
          ]),
          message: new Uint8Array([
            255, 201, 16, 158, 208, 20, 3, 130, 150, 200, 179, 64, 254, 4, 109,
            131, 3, 164, 56, 73, 142, 93, 77, 147, 141, 99, 4, 147, 240, 13,
            104, 225,
          ]),
        },
      ],
    ],
    verifyChallengeSignatureCalls: [
      [
        {
          challenge: new Uint8Array([
            241, 128, 110, 126, 86, 168, 164, 255, 27, 176, 12, 227, 184, 63,
            81, 59, 31, 35, 108, 135, 159, 239, 36, 110, 13, 169, 31, 71, 188,
            241,
          ]),
          serial: new Uint8Array([
            40, 133, 211, 25, 83, 197, 228, 28, 119, 162, 159, 35, 87, 88, 87,
            165, 247, 26, 152, 179, 7, 201, 96, 67,
          ]),
          signature: new Uint8Array([
            5, 67, 73, 90, 189, 27, 123, 252, 198, 97, 250, 37, 114, 94, 184,
            237, 197, 41, 58, 115, 226, 92, 25, 121, 48, 39, 226, 71, 241, 117,
            102, 156, 189, 63,
          ]),
          firmwareVersion: '0.0.0',
        },
      ],
    ],
  },
};

const withSkippedStatuses: IAuthCardTestCase = {
  name: 'With skipped statuses',
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
      data: new Uint8Array([34, 4, 26, 2, 8, 1]),
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
      statuses: [],
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
    eventCalls: [[0], [1], [2], [3], [4]],
    challenge: new Uint8Array([
      25, 250, 69, 179, 135, 118, 1, 5, 121, 13, 163, 254, 191, 113, 130, 130,
      3, 127, 216, 89, 74, 57, 110, 215,
    ]),
    challengeVerified: true,
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
};

const withCardIndex1: IAuthCardTestCase = {
  name: 'With card index 1',
  params: {
    cardNumber: 1,
  },
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([34, 4, 10, 2, 8, 1]),
    },
    {
      name: 'challenge',
      data: new Uint8Array([
        34, 32, 18, 30, 10, 28, 91, 43, 48, 103, 233, 161, 221, 174, 200, 188,
        58, 150, 248, 9, 194, 145, 154, 20, 240, 2, 0, 243, 245, 127, 1, 90,
        115, 37,
      ]),
    },
    {
      name: 'result',
      data: new Uint8Array([34, 4, 26, 2, 8, 1]),
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
      statuses: [
        {
          flowStatus: 0,
          expectEventCalls: [0],
        },
        {
          flowStatus: 1,
          expectEventCalls: [1],
        },
      ],
    },
    {
      name: 'challengeSig',
      data: new Uint8Array([
        34, 36, 18, 34, 10, 32, 110, 18, 146, 170, 47, 162, 166, 84, 178, 57,
        180, 174, 155, 207, 154, 42, 142, 121, 176, 134, 225, 0, 48, 44, 101,
        204, 158, 229, 107, 113, 214, 188,
      ]),
    },
    {
      name: 'flowComplete',
      data: new Uint8Array([34, 2, 34, 0]),
    },
  ],
  mocks: {
    challenge: new Uint8Array([
      91, 43, 48, 103, 233, 161, 221, 174, 200, 188, 58, 150, 248, 9, 194, 145,
      154, 20, 240, 2, 0, 243, 245, 127, 1, 90, 115, 37,
    ]),
    challengeVerified: true,
    eventCalls: [[0], [1], [2], [3], [4]],
    verifySerialSignatureCalls: [
      [
        {
          serial: new Uint8Array([
            142, 25, 5, 198, 236, 185, 206, 147, 215, 202, 105, 46, 115, 113,
            200, 105, 202, 105, 203, 201, 104, 200, 148, 61,
          ]),
          signature: new Uint8Array([
            12, 33, 164, 252, 205, 209, 52, 110, 243, 37, 33, 251, 198, 114,
            232, 67, 60, 6, 252, 240, 72, 5, 115, 235, 100, 193, 252, 26, 55, 2,
            196, 165,
          ]),
          message: new Uint8Array([
            0, 254, 119, 136, 186, 99, 7, 17, 175, 104, 196, 9, 16, 15, 42, 184,
            208, 120, 160, 166, 176, 106, 169, 108, 17, 153, 132, 111, 251, 12,
            180, 61,
          ]),
        },
      ],
    ],
    verifyChallengeSignatureCalls: [
      [
        {
          serial: new Uint8Array([
            142, 25, 5, 198, 236, 185, 206, 147, 215, 202, 105, 46, 115, 113,
            200, 105, 202, 105, 203, 201, 104, 200, 148, 61,
          ]),
          challenge: new Uint8Array([
            91, 43, 48, 103, 233, 161, 221, 174, 200, 188, 58, 150, 248, 9, 194,
            145, 154, 20, 240, 2, 0, 243, 245, 127, 1, 90, 115, 37,
          ]),
          signature: new Uint8Array([
            110, 18, 146, 170, 47, 162, 166, 84, 178, 57, 180, 174, 155, 207,
            154, 42, 142, 121, 176, 134, 225, 0, 48, 44, 101, 204, 158, 229,
            107, 113, 214, 188,
          ]),
          firmwareVersion: '0.0.0',
        },
      ],
    ],
  },
};

const withCardIndex2: IAuthCardTestCase = {
  name: 'With card index 2',
  params: {
    cardNumber: 2,
  },
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([34, 4, 10, 2, 8, 2]),
    },
    {
      name: 'challenge',
      data: new Uint8Array([
        34, 32, 18, 30, 10, 28, 91, 43, 48, 103, 233, 161, 221, 174, 200, 188,
        58, 150, 248, 9, 194, 145, 154, 20, 240, 2, 0, 243, 245, 127, 1, 90,
        115, 37,
      ]),
    },
    {
      name: 'result',
      data: new Uint8Array([34, 4, 26, 2, 8, 1]),
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
      statuses: [
        {
          flowStatus: 0,
          expectEventCalls: [0],
        },
        {
          flowStatus: 1,
          expectEventCalls: [1],
        },
      ],
    },
    {
      name: 'challengeSig',
      data: new Uint8Array([
        34, 36, 18, 34, 10, 32, 110, 18, 146, 170, 47, 162, 166, 84, 178, 57,
        180, 174, 155, 207, 154, 42, 142, 121, 176, 134, 225, 0, 48, 44, 101,
        204, 158, 229, 107, 113, 214, 188,
      ]),
    },
    {
      name: 'flowComplete',
      data: new Uint8Array([34, 2, 34, 0]),
    },
  ],
  mocks: {
    challenge: new Uint8Array([
      91, 43, 48, 103, 233, 161, 221, 174, 200, 188, 58, 150, 248, 9, 194, 145,
      154, 20, 240, 2, 0, 243, 245, 127, 1, 90, 115, 37,
    ]),
    challengeVerified: true,
    eventCalls: [[0], [1], [2], [3], [4]],
    verifySerialSignatureCalls: [
      [
        {
          serial: new Uint8Array([
            142, 25, 5, 198, 236, 185, 206, 147, 215, 202, 105, 46, 115, 113,
            200, 105, 202, 105, 203, 201, 104, 200, 148, 61,
          ]),
          signature: new Uint8Array([
            12, 33, 164, 252, 205, 209, 52, 110, 243, 37, 33, 251, 198, 114,
            232, 67, 60, 6, 252, 240, 72, 5, 115, 235, 100, 193, 252, 26, 55, 2,
            196, 165,
          ]),
          message: new Uint8Array([
            0, 254, 119, 136, 186, 99, 7, 17, 175, 104, 196, 9, 16, 15, 42, 184,
            208, 120, 160, 166, 176, 106, 169, 108, 17, 153, 132, 111, 251, 12,
            180, 61,
          ]),
        },
      ],
    ],
    verifyChallengeSignatureCalls: [
      [
        {
          serial: new Uint8Array([
            142, 25, 5, 198, 236, 185, 206, 147, 215, 202, 105, 46, 115, 113,
            200, 105, 202, 105, 203, 201, 104, 200, 148, 61,
          ]),
          challenge: new Uint8Array([
            91, 43, 48, 103, 233, 161, 221, 174, 200, 188, 58, 150, 248, 9, 194,
            145, 154, 20, 240, 2, 0, 243, 245, 127, 1, 90, 115, 37,
          ]),
          signature: new Uint8Array([
            110, 18, 146, 170, 47, 162, 166, 84, 178, 57, 180, 174, 155, 207,
            154, 42, 142, 121, 176, 134, 225, 0, 48, 44, 101, 204, 158, 229,
            107, 113, 214, 188,
          ]),
          firmwareVersion: '0.0.0',
        },
      ],
    ],
  },
};

const withCardIndex4: IAuthCardTestCase = {
  name: 'With card index 4',
  params: {
    cardNumber: 4,
  },
  queries: [
    {
      name: 'initiate',
      data: new Uint8Array([34, 4, 10, 2, 8, 4]),
    },
    {
      name: 'challenge',
      data: new Uint8Array([
        34, 32, 18, 30, 10, 28, 91, 43, 48, 103, 233, 161, 221, 174, 200, 188,
        58, 150, 248, 9, 194, 145, 154, 20, 240, 2, 0, 243, 245, 127, 1, 90,
        115, 37,
      ]),
    },
    {
      name: 'result',
      data: new Uint8Array([34, 4, 26, 2, 8, 1]),
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
      statuses: [
        {
          flowStatus: 0,
          expectEventCalls: [0],
        },
        {
          flowStatus: 1,
          expectEventCalls: [1],
        },
      ],
    },
    {
      name: 'challengeSig',
      data: new Uint8Array([
        34, 36, 18, 34, 10, 32, 110, 18, 146, 170, 47, 162, 166, 84, 178, 57,
        180, 174, 155, 207, 154, 42, 142, 121, 176, 134, 225, 0, 48, 44, 101,
        204, 158, 229, 107, 113, 214, 188,
      ]),
    },
    {
      name: 'flowComplete',
      data: new Uint8Array([34, 2, 34, 0]),
    },
  ],
  mocks: {
    challenge: new Uint8Array([
      91, 43, 48, 103, 233, 161, 221, 174, 200, 188, 58, 150, 248, 9, 194, 145,
      154, 20, 240, 2, 0, 243, 245, 127, 1, 90, 115, 37,
    ]),
    challengeVerified: true,
    eventCalls: [[0], [1], [2], [3], [4]],
    verifySerialSignatureCalls: [
      [
        {
          serial: new Uint8Array([
            142, 25, 5, 198, 236, 185, 206, 147, 215, 202, 105, 46, 115, 113,
            200, 105, 202, 105, 203, 201, 104, 200, 148, 61,
          ]),
          signature: new Uint8Array([
            12, 33, 164, 252, 205, 209, 52, 110, 243, 37, 33, 251, 198, 114,
            232, 67, 60, 6, 252, 240, 72, 5, 115, 235, 100, 193, 252, 26, 55, 2,
            196, 165,
          ]),
          message: new Uint8Array([
            0, 254, 119, 136, 186, 99, 7, 17, 175, 104, 196, 9, 16, 15, 42, 184,
            208, 120, 160, 166, 176, 106, 169, 108, 17, 153, 132, 111, 251, 12,
            180, 61,
          ]),
        },
      ],
    ],
    verifyChallengeSignatureCalls: [
      [
        {
          serial: new Uint8Array([
            142, 25, 5, 198, 236, 185, 206, 147, 215, 202, 105, 46, 115, 113,
            200, 105, 202, 105, 203, 201, 104, 200, 148, 61,
          ]),
          challenge: new Uint8Array([
            91, 43, 48, 103, 233, 161, 221, 174, 200, 188, 58, 150, 248, 9, 194,
            145, 154, 20, 240, 2, 0, 243, 245, 127, 1, 90, 115, 37,
          ]),
          signature: new Uint8Array([
            110, 18, 146, 170, 47, 162, 166, 84, 178, 57, 180, 174, 155, 207,
            154, 42, 142, 121, 176, 134, 225, 0, 48, 44, 101, 204, 158, 229,
            107, 113, 214, 188,
          ]),
          firmwareVersion: '0.0.0',
        },
      ],
    ],
  },
};

const valid: IAuthCardTestCase[] = [
  withValidData,
  withPartiallySkippedStatus,
  withSkippedStatuses,
  withCardIndex1,
  withCardIndex2,
  withCardIndex4,
];

export default valid;
