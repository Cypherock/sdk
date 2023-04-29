import {
  DeviceAppError,
  DeviceCommunicationError,
} from '@cypherock/sdk-interfaces';

const rawWaitForCommandOutputTestCases = {
  constantDate: new Date('2023-03-07T09:43:48.755Z'),
  invalidArgs: [
    {
      sequenceNumber: null,
      expectedCommandTypes: [1],
    },
    {
      sequenceNumber: 1,
      expectedCommandTypes: null,
    },
    {
      sequenceNumber: undefined,
      expectedCommandTypes: [1],
    },
    {
      sequenceNumber: 1,
      expectedCommandTypes: undefined,
    },
    {
      sequenceNumber: 123423,
      expectedCommandTypes: [1],
    },
    {
      sequenceNumber: 1,
      expectedCommandTypes: [],
    },
  ],
  valid: [
    {
      name: 'Cmd: 12',
      output: {
        isStatus: false,
        isRawData: true,
        data: '626e0158eabd6778b018e7b75c86d50b',
        commandType: 12,
      },
      sequenceNumber: 16,
      expectedCommandTypes: [12],
      packets: [
        new Uint8Array([
          85, 85, 193, 89, 0, 1, 0, 1, 0, 16, 3, 1, 0, 17, 254, 6, 0, 0, 0, 2,
          0, 1,
        ]),
      ],
      outputPackets: [
        [
          new Uint8Array([
            85, 85, 68, 192, 0, 1, 0, 1, 0, 16, 6, 1, 0, 18, 139, 24, 0, 0, 0,
            20, 0, 0, 0, 12, 98, 110, 1, 88, 234, 189, 103, 120, 176, 24, 231,
            183, 92, 134, 213, 11,
          ]),
        ],
      ],
      statusPackets: [
        [
          new Uint8Array([
            85, 85, 42, 232, 0, 1, 0, 1, 0, 16, 4, 1, 0, 24, 245, 11, 0, 0, 0,
            7, 2, 1, 0, 16, 12, 0, 4,
          ]),
        ],
        [
          new Uint8Array([
            85, 85, 58, 201, 0, 1, 0, 1, 0, 16, 4, 1, 0, 24, 245, 11, 0, 0, 0,
            7, 2, 1, 0, 16, 12, 0, 5,
          ]),
        ],
        [
          new Uint8Array([
            85, 85, 10, 170, 0, 1, 0, 1, 0, 16, 4, 1, 0, 24, 245, 11, 0, 0, 0,
            7, 2, 1, 0, 16, 12, 0, 6,
          ]),
        ],
      ],
      statusList: [
        {
          deviceState: '2',
          deviceIdleState: 2,
          deviceWaitingOn: 0,
          abortDisabled: true,
          currentCmdSeq: 16,
          cmdState: 12,
          flowStatus: 4,
          isStatus: true,
        },
        {
          deviceState: '2',
          deviceIdleState: 2,
          deviceWaitingOn: 0,
          abortDisabled: true,
          currentCmdSeq: 16,
          cmdState: 12,
          flowStatus: 5,
          isStatus: true,
        },
        {
          deviceState: '2',
          deviceIdleState: 2,
          deviceWaitingOn: 0,
          abortDisabled: true,
          currentCmdSeq: 16,
          cmdState: 12,
          flowStatus: 6,
          isStatus: true,
        },
      ],
    },
    {
      name: 'Cmd: 124',
      output: {
        isStatus: false,
        isRawData: true,
        data: 'd35fd0f6c3e97d7d8e9e1031a64047df0427addf57d184892cb364cb51ebdc3d3e6a58511dbc89fa960c860777c02d9e392c512449cc4f4b655f9db4b157178e6c5d12b93a5bb81957c0f9a0bd6982da9a4a5ac2f54787567732eca760ca539fb562f96210d890bfd632bf2f6728a8f76897ae42d1e82cdc6ae649ade98929989c9ec7ec6ad1f7b40b79a6c0f405c3123aecc7c534fd70a0e7dd061c177e84b776e0a52e0a5d719c530b5391e4c324c7eebdea150c9d137fcf2f2bfa13d2592c74787624c7fafa31d45ab67a01ceb6bcb48c03484e28bceb70330007aa6e235d46007d6051618684f2537eb2b1e280ae3abef84c72d77bd423f5741fa998c8532ad9e0d165c103ed8bea30f7615e83',
        commandType: 124,
      },
      sequenceNumber: 212,
      expectedCommandTypes: [124],
      packets: [
        new Uint8Array([
          85, 85, 43, 132, 0, 1, 0, 1, 0, 212, 3, 1, 0, 17, 254, 6, 0, 0, 0, 2,
          0, 1,
        ]),
        new Uint8Array([
          85, 85, 27, 231, 0, 1, 0, 1, 0, 212, 3, 1, 0, 17, 254, 6, 0, 0, 0, 2,
          0, 2,
        ]),
        new Uint8Array([
          85, 85, 11, 198, 0, 1, 0, 1, 0, 212, 3, 1, 0, 17, 254, 6, 0, 0, 0, 2,
          0, 3,
        ]),
        new Uint8Array([
          85, 85, 123, 33, 0, 1, 0, 1, 0, 212, 3, 1, 0, 17, 254, 6, 0, 0, 0, 2,
          0, 4,
        ]),
        new Uint8Array([
          85, 85, 107, 0, 0, 1, 0, 1, 0, 212, 3, 1, 0, 17, 254, 6, 0, 0, 0, 2,
          0, 5,
        ]),
        new Uint8Array([
          85, 85, 91, 99, 0, 1, 0, 1, 0, 212, 3, 1, 0, 17, 254, 6, 0, 0, 0, 2,
          0, 6,
        ]),
      ],
      outputPackets: [
        [
          new Uint8Array([
            85, 85, 100, 73, 0, 1, 0, 6, 0, 212, 6, 1, 0, 18, 149, 48, 0, 0, 1,
            19, 0, 0, 0, 124, 211, 95, 208, 246, 195, 233, 125, 125, 142, 158,
            16, 49, 166, 64, 71, 223, 4, 39, 173, 223, 87, 209, 132, 137, 44,
            179, 100, 203, 81, 235, 220, 61, 62, 106, 88, 81, 29, 188, 137, 250,
          ]),
          new Uint8Array([
            85, 85, 137, 73, 0, 1, 0, 6, 0, 212, 6, 1, 0, 18, 149, 48, 0, 0, 1,
            19, 0, 0, 0, 124, 211, 95, 208, 246, 195, 233, 125, 125, 142, 158,
            16, 49, 166, 64, 71, 223, 4, 39, 173, 223, 87, 209, 132, 137, 44,
            179, 100, 203, 81, 235, 220, 61, 62, 106, 88, 81, 29, 188, 137, 250,
          ]),
        ],
        [
          new Uint8Array([
            85, 85, 49, 178, 0, 2, 0, 6, 0, 212, 6, 1, 0, 18, 149, 48, 150, 12,
            134, 7, 119, 192, 45, 158, 57, 44, 81, 36, 73, 204, 79, 75, 101, 95,
            157, 180, 177, 87, 23, 142, 108, 93, 18, 185, 58, 91, 184, 25, 87,
            192, 249, 160, 189, 105, 130, 218, 154, 74, 90, 194, 245, 71, 135,
            86,
          ]),
        ],
        [
          new Uint8Array([
            85, 85, 70, 253, 0, 3, 0, 6, 0, 212, 6, 1, 0, 18, 149, 48, 119, 50,
            236, 167, 96, 202, 83, 159, 181, 98, 249, 98, 16, 216, 144, 191,
            214, 50, 191, 47, 103, 40, 168, 247, 104, 151, 174, 66, 209, 232,
            44, 220, 106, 230, 73, 173, 233, 137, 41, 152, 156, 158, 199, 236,
            106, 209, 247, 180,
          ]),
        ],
        [
          new Uint8Array([
            85, 85, 30, 10, 0, 4, 0, 6, 0, 212, 6, 1, 0, 18, 149, 48, 11, 121,
            166, 192, 244, 5, 195, 18, 58, 236, 199, 197, 52, 253, 112, 160,
            231, 221, 6, 28, 23, 126, 132, 183, 118, 224, 165, 46, 10, 93, 113,
            156, 83, 11, 83, 145, 228, 195, 36, 199, 238, 189, 234, 21, 12, 157,
            19, 127,
          ]),
        ],
        [
          new Uint8Array([
            85, 85, 29, 40, 0, 5, 0, 6, 0, 212, 6, 1, 0, 18, 149, 48, 207, 47,
            43, 250, 19, 210, 89, 44, 116, 120, 118, 36, 199, 250, 250, 49, 212,
            90, 182, 122, 1, 206, 182, 188, 180, 140, 3, 72, 78, 40, 188, 235,
            112, 51, 0, 7, 170, 110, 35, 93, 70, 0, 125, 96, 81, 97, 134, 132,
          ]),
        ],
        [
          new Uint8Array([
            85, 85, 156, 25, 0, 6, 0, 6, 0, 212, 6, 1, 0, 18, 149, 39, 242, 83,
            126, 178, 177, 226, 128, 174, 58, 190, 248, 76, 114, 215, 123, 212,
            35, 245, 116, 31, 169, 152, 200, 83, 42, 217, 224, 209, 101, 193, 3,
            237, 139, 234, 48, 247, 97, 94, 131,
          ]),
        ],
      ],
      statusPackets: [
        [
          new Uint8Array([
            85, 85, 44, 6, 0, 1, 0, 1, 0, 212, 4, 1, 0, 24, 248, 11, 0, 0, 0, 7,
            2, 1, 0, 212, 124, 0, 4,
          ]),
        ],
        [
          new Uint8Array([
            85, 85, 253, 171, 0, 1, 0, 1, 0, 212, 4, 1, 0, 24, 248, 11, 0, 0, 0,
            7, 2, 1, 0, 212, 124, 0, 9,
          ]),
        ],
        [
          new Uint8Array([
            85, 85, 94, 241, 0, 1, 0, 1, 0, 212, 4, 1, 0, 24, 248, 11, 0, 0, 0,
            7, 2, 1, 0, 212, 124, 0, 18,
          ]),
        ],
      ],
      statusList: [
        {
          deviceState: '2',
          deviceIdleState: 2,
          deviceWaitingOn: 0,
          abortDisabled: true,
          currentCmdSeq: 212,
          cmdState: 124,
          flowStatus: 4,
          isStatus: true,
        },
        {
          deviceState: '2',
          deviceIdleState: 2,
          deviceWaitingOn: 0,
          abortDisabled: true,
          currentCmdSeq: 212,
          cmdState: 124,
          flowStatus: 9,
          isStatus: true,
        },
        {
          deviceState: '2',
          deviceIdleState: 2,
          deviceWaitingOn: 0,
          abortDisabled: true,
          currentCmdSeq: 212,
          cmdState: 124,
          flowStatus: 18,
          isStatus: true,
        },
      ],
    },
  ],
  error: [
    {
      name: 'Invalid CRC',
      sequenceNumber: 16,
      expectedCommandTypes: [12],
      packets: [
        new Uint8Array([
          85, 85, 193, 89, 0, 1, 0, 1, 0, 16, 3, 1, 0, 17, 254, 6, 0, 0, 0, 2,
          0, 1,
        ]),
      ],
      outputPackets: [
        [
          new Uint8Array([
            85, 85, 100, 192, 0, 1, 0, 1, 0, 16, 6, 1, 0, 18, 139, 24, 0, 0, 0,
            20, 0, 0, 0, 12, 98, 110, 1, 88, 234, 189, 103, 120, 176, 24, 231,
            183, 92, 134, 213, 11,
          ]),
        ],
      ],
      statusPackets: [],
      statusList: [],
      errorInstance: DeviceCommunicationError,
    },
    {
      name: 'Invalid sequenceNumber',
      sequenceNumber: 215,
      expectedCommandTypes: [12],
      packets: [
        new Uint8Array([
          85, 85, 228, 33, 0, 1, 0, 1, 0, 215, 3, 1, 0, 17, 254, 6, 0, 0, 0, 2,
          0, 1,
        ]),
      ],
      outputPackets: [
        [
          new Uint8Array([
            85, 85, 178, 91, 0, 1, 0, 1, 0, 200, 4, 1, 0, 18, 146, 11, 0, 0, 0,
            7, 3, 0, 0, 200, 1, 0, 164,
          ]),
        ],
      ],
      statusPackets: [],
      statusList: [],
      errorInstance: DeviceAppError,
    },
    {
      name: 'Invalid expected command type',
      sequenceNumber: 16,
      expectedCommandTypes: [10],
      packets: [
        new Uint8Array([
          85, 85, 193, 89, 0, 1, 0, 1, 0, 16, 3, 1, 0, 17, 254, 6, 0, 0, 0, 2,
          0, 1,
        ]),
      ],
      outputPackets: [
        [
          new Uint8Array([
            85, 85, 68, 192, 0, 1, 0, 1, 0, 16, 6, 1, 0, 18, 139, 24, 0, 0, 0,
            20, 0, 0, 0, 12, 98, 110, 1, 88, 234, 189, 103, 120, 176, 24, 231,
            183, 92, 134, 213, 11,
          ]),
        ],
      ],
      statusPackets: [
        [
          new Uint8Array([
            85, 85, 42, 232, 0, 1, 0, 1, 0, 16, 4, 1, 0, 24, 245, 11, 0, 0, 0,
            7, 2, 1, 0, 16, 12, 0, 4,
          ]),
        ],
        [
          new Uint8Array([
            85, 85, 58, 201, 0, 1, 0, 1, 0, 16, 4, 1, 0, 24, 245, 11, 0, 0, 0,
            7, 2, 1, 0, 16, 12, 0, 5,
          ]),
        ],
        [
          new Uint8Array([
            85, 85, 10, 170, 0, 1, 0, 1, 0, 16, 4, 1, 0, 24, 245, 11, 0, 0, 0,
            7, 2, 1, 0, 16, 12, 0, 6,
          ]),
        ],
      ],
      statusList: [
        {
          deviceState: '2',
          deviceIdleState: 2,
          deviceWaitingOn: 0,
          abortDisabled: true,
          currentCmdSeq: 16,
          cmdState: 12,
          flowStatus: 4,
          isStatus: true,
        },
        {
          deviceState: '2',
          deviceIdleState: 2,
          deviceWaitingOn: 0,
          abortDisabled: true,
          currentCmdSeq: 16,
          cmdState: 12,
          flowStatus: 5,
          isStatus: true,
        },
        {
          deviceState: '2',
          deviceIdleState: 2,
          deviceWaitingOn: 0,
          abortDisabled: true,
          currentCmdSeq: 16,
          cmdState: 12,
          flowStatus: 6,
          isStatus: true,
        },
      ],
      errorInstance: DeviceAppError,
    },
  ],
};

export default rawWaitForCommandOutputTestCases;
