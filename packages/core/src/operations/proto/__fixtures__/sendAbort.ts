import {
  DeviceAppError,
  DeviceCommunicationError,
} from '@cypherock/sdk-interfaces';
import { PacketVersionMap } from '../../../utils';

export const protoSendAbortTestCases = {
  constantDate: new Date('2023-03-07T09:43:48.755Z'),
  invalidArgs: [
    {
      connection: null,
      version: PacketVersionMap.v3,
      sequenceNumber: 1,
    },
    {
      version: null,
      sequenceNumber: 1,
    },
    {
      version: PacketVersionMap.v3,
      sequenceNumber: null,
    },
    {
      connection: undefined,
      version: PacketVersionMap.v3,
      sequenceNumber: 1,
    },
    {
      version: undefined,
      sequenceNumber: 1,
    },
    {
      version: PacketVersionMap.v3,
      sequenceNumber: undefined,
    },
    {
      version: PacketVersionMap.v1,
      sequenceNumber: 1,
    },
    {
      version: PacketVersionMap.v2,
      sequenceNumber: 1,
    },
    {
      version: 'invalid',
      sequenceNumber: 1,
    },
    {
      version: PacketVersionMap.v3,
      sequenceNumber: 123423,
    },
  ],
  valid: [
    {
      abortRequest: new Uint8Array([
        85, 85, 135, 124, 0, 1, 0, 1, 0, 18, 8, 1, 0, 17, 254, 0,
      ]),
      ackPackets: [
        new Uint8Array([
          85, 85, 28, 162, 0, 1, 0, 1, 255, 255, 4, 1, 0, 17, 254, 15, 0, 11, 0,
          0, 8, 2, 16, 3, 32, 18, 40, 7, 48, 132, 1,
        ]),
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
      version: PacketVersionMap.v3,
    },
    {
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
          85, 85, 154, 161, 0, 1, 0, 1, 0, 78, 4, 1, 0, 17, 254, 13, 0, 9, 0, 0,
          16, 3, 32, 78, 40, 1, 48, 164, 1,
        ]),
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
      version: PacketVersionMap.v3,
    },
  ],
  error: [
    // Invalid crc
    {
      abortRequest: new Uint8Array([
        85, 85, 135, 124, 0, 1, 0, 1, 0, 18, 8, 1, 0, 17, 254, 0,
      ]),
      ackPackets: [
        new Uint8Array([
          85, 85, 200, 162, 0, 1, 0, 1, 255, 255, 4, 1, 0, 17, 254, 15, 0, 11,
          0, 0, 8, 2, 16, 3, 32, 18, 40, 7, 48, 132, 1,
        ]),
      ],
      sequenceNumber: 18,
      version: PacketVersionMap.v3,
      errorInstance: DeviceCommunicationError,
    },
    // Invalid sequence number
    {
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
          85, 85, 28, 162, 0, 1, 0, 1, 255, 255, 4, 1, 0, 17, 254, 15, 0, 11, 0,
          0, 8, 2, 16, 3, 32, 18, 40, 7, 48, 132, 1,
        ]),
      ],
      errorInstance: DeviceAppError,
      sequenceNumber: 78,
      version: PacketVersionMap.v3,
    },
  ],
};
