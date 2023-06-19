import {
  DeviceAppError,
  DeviceCommunicationError,
} from '@cypherock/sdk-interfaces';

const protoSendAbortTestCases = {
  constantDate: new Date('2023-03-07T09:43:48.755Z'),
  invalidArgs: [
    {
      sequenceNumber: 123423,
    },
  ],
  valid: [
    {
      name: 'CmdSeq: 18',
      packets: [
        new Uint8Array([
          85, 85, 135, 124, 0, 1, 0, 1, 0, 18, 8, 1, 0, 17, 254, 0,
        ]),
        new Uint8Array([
          85, 85, 169, 56, 0, 1, 0, 1, 255, 255, 1, 1, 0, 17, 254, 0,
        ]),
      ],
      ackPackets: [
        [
          new Uint8Array([
            85, 85, 28, 162, 0, 1, 0, 1, 255, 255, 4, 1, 0, 17, 254, 15, 0, 11,
            0, 0, 8, 2, 16, 3, 32, 18, 40, 7, 48, 132, 1,
          ]),
        ],
        [
          new Uint8Array([
            85, 85, 30, 138, 0, 1, 0, 1, 255, 255, 4, 1, 1, 112, 220, 12, 0, 8,
            0, 0, 8, 1, 16, 1, 32, 1, 40, 7,
          ]),
        ],
      ],
      sequenceNumber: 18,
      status: {
        deviceIdleState: 3,
        deviceWaitingOn: 2,
        abortDisabled: false,
        currentCmdSeq: 18,
        cmdState: 7,
        flowStatus: 132,
      },
    },
    {
      name: 'CmdSeq: 78',
      packets: [
        new Uint8Array([
          85, 85, 63, 128, 0, 1, 0, 1, 0, 78, 8, 1, 0, 17, 254, 0,
        ]),
        new Uint8Array([
          85, 85, 169, 56, 0, 1, 0, 1, 255, 255, 1, 1, 0, 17, 254, 0,
        ]),
      ],
      ackPackets: [
        [
          new Uint8Array([
            170, 63, 27, 0, 2, 0, 2, 10, 16, 97, 6, 47, 150, 92, 178, 86, 238,
            68, 168, 147, 34, 27, 233, 174, 197, 213, 124, 255, 32, 26,
          ]),
          new Uint8Array([170, 1, 6, 0, 0, 0, 0, 0]),
          new Uint8Array([
            85, 85, 154, 161, 0, 1, 0, 1, 0, 78, 4, 1, 0, 17, 254, 13, 0, 9, 0,
            0, 16, 3, 32, 78, 40, 1, 48, 164, 1,
          ]),
        ],
        [
          new Uint8Array([
            85, 85, 30, 138, 0, 1, 0, 1, 255, 255, 4, 1, 1, 112, 220, 12, 0, 8,
            0, 0, 8, 1, 16, 1, 32, 1, 40, 7,
          ]),
        ],
      ],
      sequenceNumber: 78,
      status: {
        deviceIdleState: 3,
        deviceWaitingOn: 0,
        abortDisabled: false,
        currentCmdSeq: 78,
        cmdState: 1,
        flowStatus: 164,
      },
    },
  ],
  error: [
    {
      name: 'Invalid CRC',
      packets: [
        new Uint8Array([
          85, 85, 135, 124, 0, 1, 0, 1, 0, 18, 8, 1, 0, 17, 254, 0,
        ]),
      ],
      ackPackets: [
        [
          new Uint8Array([
            85, 85, 200, 162, 0, 1, 0, 1, 255, 255, 4, 1, 0, 17, 254, 15, 0, 11,
            0, 0, 8, 2, 16, 3, 32, 18, 40, 7, 48, 132, 1,
          ]),
        ],
      ],
      sequenceNumber: 18,
      errorInstance: DeviceCommunicationError,
    },
    {
      name: 'Invalid sequenceNumber',
      packets: [
        new Uint8Array([
          85, 85, 63, 128, 0, 1, 0, 1, 0, 78, 8, 1, 0, 17, 254, 0,
        ]),
      ],
      ackPackets: [
        [
          new Uint8Array([
            170, 63, 27, 0, 2, 0, 2, 10, 16, 97, 6, 47, 150, 92, 178, 86, 238,
            68, 168, 147, 34, 27, 233, 174, 197, 213, 124, 255, 32, 26,
          ]),
          new Uint8Array([170, 1, 6, 0, 0, 0, 0, 0]),
          new Uint8Array([
            85, 85, 28, 162, 0, 1, 0, 1, 255, 255, 4, 1, 0, 17, 254, 15, 0, 11,
            0, 0, 8, 2, 16, 3, 32, 18, 40, 7, 48, 132, 1,
          ]),
        ],
      ],
      errorInstance: DeviceAppError,
      sequenceNumber: 78,
    },
  ],
};

export default protoSendAbortTestCases;
