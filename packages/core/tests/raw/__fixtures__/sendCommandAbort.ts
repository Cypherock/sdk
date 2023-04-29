import {
  DeviceAppError,
  DeviceCommunicationError,
} from '@cypherock/sdk-interfaces';

const rawSendAbortTestCases = {
  constantDate: new Date('2023-03-07T09:43:48.755Z'),
  invalidArgs: [
    {
      sequenceNumber: null,
    },
    {
      sequenceNumber: undefined,
    },
    {
      sequenceNumber: 123423,
    },
  ],
  valid: [
    {
      name: 'CmdSeq: 18',
      abortRequest: new Uint8Array([
        85, 85, 135, 124, 0, 1, 0, 1, 0, 18, 8, 1, 0, 17, 254, 0,
      ]),
      ackPackets: [
        new Uint8Array([
          85, 85, 143, 73, 0, 1, 0, 1, 0, 18, 4, 1, 0, 18, 86, 11, 0, 0, 0, 7,
          35, 0, 0, 18, 7, 0, 132,
        ]),
      ],
      sequenceNumber: 18,
      status: {
        deviceState: '23',
        deviceIdleState: 3,
        deviceWaitingOn: 2,
        abortDisabled: false,
        currentCmdSeq: 18,
        cmdState: 7,
        flowStatus: 132,
        isStatus: true,
      },
    },
    {
      name: 'CmdSeq: 78',
      abortRequest: new Uint8Array([
        85, 85, 63, 128, 0, 1, 0, 1, 0, 78, 8, 1, 0, 17, 254, 0,
      ]),
      ackPackets: [
        new Uint8Array([
          170, 63, 27, 0, 2, 0, 2, 10, 16, 97, 6, 47, 150, 92, 178, 86, 238, 68,
          168, 147, 34, 27, 233, 174, 197, 213, 124, 255, 32, 26,
        ]),
        new Uint8Array([170, 1, 6, 0, 0, 0, 0, 0]),
        new Uint8Array([
          85, 85, 75, 43, 0, 1, 0, 1, 0, 78, 4, 1, 0, 18, 90, 11, 0, 0, 0, 7, 3,
          0, 0, 78, 1, 0, 164,
        ]),
      ],
      sequenceNumber: 78,
      status: {
        deviceState: '3',
        deviceIdleState: 3,
        deviceWaitingOn: 0,
        abortDisabled: false,
        currentCmdSeq: 78,
        cmdState: 1,
        flowStatus: 164,
        isStatus: true,
      },
    },
  ],
  error: [
    {
      name: 'Invalid CRC',
      abortRequest: new Uint8Array([
        85, 85, 135, 124, 0, 1, 0, 1, 0, 18, 8, 1, 0, 17, 254, 0,
      ]),
      ackPackets: [
        new Uint8Array([
          85, 85, 100, 73, 0, 1, 0, 1, 0, 18, 4, 1, 0, 18, 86, 11, 0, 0, 0, 7,
          35, 0, 0, 18, 7, 0, 132,
        ]),
      ],
      sequenceNumber: 18,
      errorInstance: DeviceCommunicationError,
    },
    {
      name: 'Invalid sequenceNumber',
      abortRequest: new Uint8Array([
        85, 85, 63, 128, 0, 1, 0, 1, 0, 78, 8, 1, 0, 17, 254, 0,
      ]),
      ackPackets: [
        new Uint8Array([
          170, 63, 27, 0, 2, 0, 2, 10, 16, 97, 6, 47, 150, 92, 178, 86, 238, 68,
          168, 147, 34, 27, 233, 174, 197, 213, 124, 255, 32, 26,
        ]),
        new Uint8Array([170, 1, 6, 0, 0, 0, 0, 0]),
        new Uint8Array([
          85, 85, 143, 73, 0, 1, 0, 1, 0, 18, 4, 1, 0, 18, 86, 11, 0, 0, 0, 7,
          35, 0, 0, 18, 7, 0, 132,
        ]),
      ],
      errorInstance: DeviceAppError,
      sequenceNumber: 78,
    },
  ],
};

export default rawSendAbortTestCases;
