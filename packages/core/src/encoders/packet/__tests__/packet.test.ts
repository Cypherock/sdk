import {
  afterAll,
  beforeAll,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { PacketVersionMap } from '../../../utils';
import {
  encodePayloadData,
  decodePayloadData,
  encodePacket,
  decodePacket,
} from '../packet';
import {
  decodePacketTestCases,
  decodePayloadDataTestCases,
  encodePacketTestCases,
  encodePayloadDataTestCases,
  packetDataTestCases,
  payloadDataTestCases,
} from '../__fixtures__/packet';

describe('Packet Encoder', () => {
  describe('encodePayloadData', () => {
    test('should return valid packets', () => {
      for (const testCase of payloadDataTestCases.validEncodings) {
        const result = encodePayloadData(
          testCase.rawData,
          testCase.protobufData,
          PacketVersionMap.v3,
        );
        expect(result).toEqual(testCase.encoded);
      }
    });

    test('should throw error with invalid data', () => {
      for (const testCase of encodePayloadDataTestCases.invalid) {
        expect(() =>
          encodePayloadData(
            testCase.rawData as any,
            testCase.protobufData as any,
            testCase.version as any,
          ),
        ).toThrow();
      }
    });
  });

  describe('decodePayloadData', () => {
    test('should return valid packets', () => {
      for (const testCase of payloadDataTestCases.validEncodings) {
        const result = decodePayloadData(testCase.encoded, PacketVersionMap.v3);
        expect(result).toBeDefined();
        expect(result.rawData).toEqual(testCase.rawData);
        expect(result.protobufData).toEqual(testCase.protobufData);
      }
    });

    test('should throw error with invalid data', () => {
      for (const testCase of decodePayloadDataTestCases.invalid) {
        expect(() =>
          decodePayloadData(testCase.payload as any, testCase.version as any),
        ).toThrow();
      }
    });
  });

  describe('encodePacket', () => {
    const RealDate = Date.now;

    beforeAll(() => {
      global.Date.now = jest.fn(() =>
        packetDataTestCases.constantDate.getTime(),
      );
    });

    afterAll(() => {
      global.Date.now = RealDate;
    });

    test('should return valid packets', () => {
      for (const testCase of packetDataTestCases.validEncodings) {
        const result = encodePacket({
          rawData: testCase.rawData,
          protoData: testCase.protoData,
          sequenceNumber: testCase.sequenceNumber,
          packetType: testCase.packetType,
          version: testCase.version,
        });
        expect(result).toEqual(testCase.encoded);
      }
    });

    test('should throw error with invalid data', () => {
      for (const testCase of encodePacketTestCases.invalid) {
        expect(() =>
          encodePacket({
            rawData: testCase.rawData as any,
            protoData: testCase.protoData as any,
            sequenceNumber: testCase.sequenceNumber as any,
            packetType: testCase.packetType as any,
            version: testCase.version as any,
          }),
        ).toThrow();
      }
    });
  });

  describe('decodePacket', () => {
    const RealDate = Date.now;

    beforeAll(() => {
      global.Date.now = jest.fn(() =>
        packetDataTestCases.constantDate.getTime(),
      );
    });

    afterAll(() => {
      global.Date.now = RealDate;
    });

    test('should return valid packets', () => {
      for (const testCase of packetDataTestCases.validEncodings) {
        const packetList = decodePacket(
          testCase.encoded.reduce(
            (a, elem) => new Uint8Array([...a, ...elem]),
            new Uint8Array(),
          ),
          PacketVersionMap.v3,
        );
        expect(packetList).toEqual(testCase.packetList);

        let data = '';
        for (const packet of packetList) {
          data += packet.payloadData;
        }
        expect(data).toEqual(testCase.encodedPayloadData);
      }
    });

    test('should return error when invalid packet', () => {
      for (const testCase of decodePacketTestCases.errorPackets) {
        const result = decodePacket(testCase, PacketVersionMap.v3);
        expect(Array.isArray(result)).toBeTruthy();
        for (const packet of result) {
          expect(packet.errorList.length).toEqual(1);
        }
      }
    });

    test('should throw error with invalid data', () => {
      for (const testCase of decodePacketTestCases.invalid) {
        expect(() =>
          decodePacket(testCase.payload as any, testCase.version as any),
        ).toThrow();
      }
    });
  });
});
