import { describe, expect, test } from '@jest/globals';
import { PacketVersionMap } from '../../../utils';
import { createAckPacket, xmodemDecode, xmodemEncode } from '../legacy';
import {
  createAckPacketTestCases,
  xmodemDecodeTestCases,
  xmodemEncodeTestCases,
} from '../__fixtures__/legacy';

describe('Legacy Packet Encoder', () => {
  describe('createAckPacket', () => {
    test('should return valid packets for v1', () => {
      for (const testCase of createAckPacketTestCases.validV1) {
        const result = createAckPacket(
          testCase.params.commandType,
          testCase.params.packetNumber,
          PacketVersionMap.v1,
        );
        expect(result).toEqual(testCase.result);
      }
    });

    test('should return valid packets for v2', () => {
      for (const testCase of createAckPacketTestCases.validV2) {
        const result = createAckPacket(
          testCase.params.commandType,
          testCase.params.packetNumber,
          PacketVersionMap.v2,
        );
        expect(result).toEqual(testCase.result);
      }
    });

    test('should throw error with invalid data', () => {
      for (const testCase of createAckPacketTestCases.invalid) {
        expect(() =>
          createAckPacket(
            testCase.commandType as any,
            testCase.packetNumber as any,
            testCase.version as any,
          ),
        ).toThrow();
      }
    });
  });

  describe('xmodemEncode', () => {
    test('should return valid packets for v1', () => {
      for (const testCase of xmodemEncodeTestCases.validV1) {
        const result = xmodemEncode(
          testCase.params.data,
          testCase.params.commandType,
          PacketVersionMap.v1,
        );
        expect(result).toEqual(testCase.packets);
      }
    });

    test('should return valid packets for v2', () => {
      for (const testCase of xmodemEncodeTestCases.validV2) {
        const result = xmodemEncode(
          testCase.params.data,
          testCase.params.commandType,
          PacketVersionMap.v2,
        );
        expect(result).toEqual(testCase.packets);
      }
    });

    test('should throw error with invalid data', () => {
      for (const testCase of xmodemEncodeTestCases.invalid) {
        expect(() =>
          xmodemEncode(
            testCase.data as any,
            testCase.commandType as any,
            testCase.version as any,
          ),
        ).toThrow();
      }
    });
  });

  describe('xmodemDecode', () => {
    test('should decode valid packets for v1', () => {
      for (const testCase of xmodemDecodeTestCases.validV1) {
        const packetList = xmodemDecode(
          testCase.rawPackets,
          PacketVersionMap.v1,
        );

        expect(Array.isArray(packetList)).toBeTruthy();
        expect(packetList).toEqual(testCase.packetList);

        let data = '';
        for (const packet of packetList) {
          data += packet.dataChunk;
        }
        expect(data).toEqual(testCase.data);
      }
    });

    test('should decode valid packets for v2', () => {
      for (const testCase of xmodemDecodeTestCases.validV2) {
        const packetList = xmodemDecode(
          testCase.rawPackets,
          PacketVersionMap.v2,
        );

        expect(Array.isArray(packetList)).toBeTruthy();
        expect(packetList).toEqual(testCase.packetList);

        let data = '';
        for (const packet of packetList) {
          data += packet.dataChunk;
        }
        expect(data).toEqual(testCase.data);
      }
    });

    test('should return error when invalid packet', () => {
      for (const testCase of xmodemDecodeTestCases.errorPackets) {
        const result = xmodemDecode(testCase.rawPackets, testCase.version);
        expect(Array.isArray(result)).toBeTruthy();
        for (const packet of result) {
          expect(packet.errorList.length).toEqual(1);
        }
      }
    });

    test('should throw error with invalid data', () => {
      for (const testCase of xmodemDecodeTestCases.invalid) {
        expect(() =>
          xmodemDecode(testCase.packets as any, testCase.version as any),
        ).toThrow();
      }
    });
  });
});
