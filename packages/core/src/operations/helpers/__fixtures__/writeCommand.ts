import { DeviceCommunicationError } from '@cypherock/sdk-interfaces';
import { PacketVersionMap } from '../../../utils';

export const writeCommandHelperTestCases = {
  invalidArgs: [
    {
      packet: new Uint8Array([10]),
      sequenceNumber: 0,
      ackPacketTypes: [6],
      version: PacketVersionMap.v1,
    },
    {
      packet: new Uint8Array([10]),
      sequenceNumber: 0,
      ackPacketTypes: [6],
      version: PacketVersionMap.v2,
    },
    {
      packet: new Uint8Array([10]),
      sequenceNumber: 0,
      ackPacketTypes: [6],
      version: 'invalid',
    },
    {
      connection: null,
      packet: new Uint8Array([10]),
      sequenceNumber: 0,
      ackPacketTypes: [6],
      version: PacketVersionMap.v3,
    },
    {
      packet: null,
      sequenceNumber: 0,
      ackPacketTypes: [6],
      version: PacketVersionMap.v3,
    },
    {
      packet: new Uint8Array([10]),
      sequenceNumber: null,
      ackPacketTypes: [6],
      version: PacketVersionMap.v3,
    },
    {
      packet: new Uint8Array([10]),
      sequenceNumber: 0,
      ackPacketTypes: null,
      version: PacketVersionMap.v3,
    },
    {
      packet: new Uint8Array([10]),
      sequenceNumber: 0,
      ackPacketTypes: [6],
      version: null,
    },
    {
      connection: undefined,
      packet: new Uint8Array([10]),
      sequenceNumber: 0,
      ackPacketTypes: [6],
      version: PacketVersionMap.v3,
    },
    {
      packet: undefined,
      sequenceNumber: 0,
      ackPacketTypes: [6],
      version: PacketVersionMap.v3,
    },
    {
      packet: new Uint8Array([10]),
      sequenceNumber: undefined,
      ackPacketTypes: [6],
      version: PacketVersionMap.v3,
    },
    {
      packet: new Uint8Array([10]),
      sequenceNumber: 0,
      ackPacketTypes: undefined,
      version: PacketVersionMap.v3,
    },
    {
      packet: new Uint8Array([10]),
      sequenceNumber: 0,
      ackPacketTypes: [6],
      version: undefined,
    },
    {
      packet: new Uint8Array([]),
      sequenceNumber: 0,
      ackPacketTypes: [6],
      version: PacketVersionMap.v3,
    },
    {
      packet: new Uint8Array([10]),
      sequenceNumber: 0,
      ackPacketTypes: [],
      version: PacketVersionMap.v3,
    },
  ],
  valid: [
    {
      // Status Packet Request
      packet: new Uint8Array([
        85, 85, 96, 77, 0, 1, 0, 1, 0, 1, 1, 1, 0, 5, 229, 0,
      ]),
      ackPackets: [
        new Uint8Array([85, 85, 235, 13, 0, 1, 0, 1, 0, 1, 3, 1, 0, 5, 229, 0]),
      ],
      decodedAckPacket: {
        startOfFrame: '5555',
        currentPacketNumber: 1,
        totalPacketNumber: 1,
        crc: 'eb0d',
        payloadData: '',
        errorList: [],
        sequenceNumber: 1,
        packetType: 3,
        timestamp: 16778725,
      },
      ackPacketTypes: [3],
      sequenceNumber: 1,
    },
    {
      // Send Cmd
      packet: new Uint8Array([
        85, 85, 251, 151, 0, 1, 0, 1, 0, 16, 2, 1, 0, 5, 229, 18, 0, 0, 0, 14,
        13, 132, 60, 156, 132, 72, 109, 130, 151, 242, 104, 195, 233, 47,
      ]),
      ackPackets: [
        new Uint8Array([85, 85, 235, 13, 0, 1, 0, 1, 0, 1, 3, 1, 0, 5, 229, 0]),
        new Uint8Array([85, 85, 235, 13, 0, 1, 0, 1, 0, 1, 3, 1, 0, 5, 229, 0]),
        new Uint8Array([85, 85, 235, 13, 0, 1, 0, 1, 0, 1, 3, 1, 0, 5, 229, 0]),
        new Uint8Array([85, 85, 235, 13, 0, 1, 0, 1, 0, 1, 3, 1, 0, 5, 229, 0]),
        new Uint8Array([85, 85, 235, 13, 0, 1, 0, 1, 0, 1, 3, 1, 0, 5, 229, 0]),
        new Uint8Array([
          85, 85, 233, 246, 0, 1, 0, 1, 0, 16, 5, 1, 0, 5, 229, 0,
        ]),
      ],
      decodedAckPacket: {
        startOfFrame: '5555',
        currentPacketNumber: 1,
        totalPacketNumber: 1,
        crc: 'e9f6',
        payloadData: '',
        errorList: [],
        sequenceNumber: 16,
        packetType: 5,
        timestamp: 16778725,
      },
      ackPacketTypes: [5],
      sequenceNumber: 16,
    },
  ],
  error: [
    {
      // Invalid packet type
      packet: new Uint8Array([
        85, 85, 96, 77, 0, 1, 0, 1, 0, 1, 1, 1, 0, 5, 229, 0,
      ]),
      ackPackets: [
        new Uint8Array([85, 85, 235, 13, 0, 1, 0, 1, 0, 1, 3, 1, 0, 5, 229, 0]),
      ],
      ackPacketTypes: [1],
      sequenceNumber: 1,
      errorInstance: DeviceCommunicationError,
    },
    {
      // Invalid sequence number
      packet: new Uint8Array([
        85, 85, 251, 151, 0, 1, 0, 1, 0, 16, 2, 1, 0, 5, 229, 18, 0, 0, 0, 14,
        13, 132, 60, 156, 132, 72, 109, 130, 151, 242, 104, 195, 233, 47,
      ]),
      ackPackets: [
        new Uint8Array([
          85, 85, 233, 246, 0, 1, 0, 1, 0, 16, 5, 1, 0, 5, 229, 0,
        ]),
      ],
      ackPacketTypes: [5],
      sequenceNumber: 12,
      errorInstance: DeviceCommunicationError,
    },
    {
      // Error Packet
      packet: new Uint8Array([
        85, 85, 251, 151, 0, 1, 0, 1, 0, 16, 2, 1, 0, 5, 229, 18, 0, 0, 0, 14,
        13, 132, 60, 156, 132, 72, 109, 130, 151, 242, 104, 195, 233, 47,
      ]),
      ackPackets: [
        new Uint8Array([
          85, 85, 98, 182, 0, 1, 0, 1, 0, 16, 7, 1, 0, 5, 229, 0,
        ]),
      ],
      ackPacketTypes: [5],
      sequenceNumber: 16,
      errorInstance: DeviceCommunicationError,
    },
  ],
};
