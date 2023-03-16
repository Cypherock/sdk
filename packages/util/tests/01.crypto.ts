import { describe, expect, test } from '@jest/globals';
import {
  crc16,
  hexToAscii,
  hexToUint8Array,
  intToUintByte,
  padStart,
  uint8ArrayToHex,
} from '../src';

describe('Crypto Util', () => {
  describe('hexToAscii', () => {
    test('should return valid ascii with valid hex', () => {
      const testCases = [
        { ascii: '', hex: '' },
        { ascii: '', hex: '0x' },
        { ascii: 'hello world', hex: '68656c6c6f20776f726c64' },
        {
          ascii: 'Ever man are put down his very',
          hex: '45766572206d616e206172652070757420646f776e206869732076657279',
        },
        {
          ascii:
            'Surrounded to me occasional pianoforte alteration unaffected impossible ye. For saw half than cold. Pretty merits waited six talked pulled you. Conduct replied off led whether any shortly why arrived adapted. Numerous ladyship so raillery humoured goodness received an. So narrow formal length my highly longer afford oh. Tall neat he make or at dull ye.',
          hex: '0x537572726f756e64656420746f206d65206f63636173696f6e616c207069616e6f666f72746520616c7465726174696f6e20756e616666656374656420696d706f737369626c652079652e20466f72207361772068616c66207468616e20636f6c642e20507265747479206d657269747320776169746564207369782074616c6b65642070756c6c656420796f752e20436f6e64756374207265706c696564206f6666206c6564207768657468657220616e792073686f72746c7920776879206172726976656420616461707465642e204e756d65726f7573206c6164797368697020736f207261696c6c6572792068756d6f7572656420676f6f646e65737320726563656976656420616e2e20536f206e6172726f7720666f726d616c206c656e677468206d7920686967686c79206c6f6e676572206166666f7264206f682e2054616c6c206e656174206865206d616b65206f722061742064756c6c2079652e',
        },
        {
          ascii:
            'Impossible considered invitation him men instrument saw celebrated unpleasant. Put rest and must set kind next many near nay. He exquisite continued explained middleton am. Voice hours young woody has she think equal. Estate moment he at on wonder at season little. Six garden result summer set family esteem nay estate. End admiration mrs unreserved discovered comparison especially invitation.',
          hex: '496d706f737369626c6520636f6e7369646572656420696e7669746174696f6e2068696d206d656e20696e737472756d656e74207361772063656c6562726174656420756e706c656173616e742e20507574207265737420616e64206d75737420736574206b696e64206e657874206d616e79206e656172206e61792e2048652065787175697369746520636f6e74696e756564206578706c61696e6564206d6964646c65746f6e20616d2e20566f69636520686f75727320796f756e6720776f6f64792068617320736865207468696e6b20657175616c2e20457374617465206d6f6d656e74206865206174206f6e20776f6e64657220617420736561736f6e206c6974746c652e205369782067617264656e20726573756c742073756d6d6572207365742066616d696c792065737465656d206e6179206573746174652e20456e642061646d69726174696f6e206d727320756e726573657276656420646973636f766572656420636f6d70617269736f6e20657370656369616c6c7920696e7669746174696f6e2e',
        },
        {
          ascii:
            "The discovery was made by Richard McClintock , a professor of Latin at Hampden-Sydney College in Virginia, who faced the impetuous recurrence of the dark word consectetur in the text Lorem ipsum researched its origins to identify them in sections 1.10.32 and 1.10.33 of the aforementioned Cicero's philosophical work.\n\n",
          hex: '0x54686520646973636f7665727920776173206d6164652062792052696368617264204d63436c696e746f636b202c20612070726f666573736f72206f66204c6174696e2061742048616d7064656e2d5379646e657920436f6c6c65676520696e2056697267696e69612c2077686f2066616365642074686520696d706574756f757320726563757272656e6365206f6620746865206461726b20776f726420636f6e736563746574757220696e207468652074657874204c6f72656d20697073756d207265736561726368656420697473206f726967696e7320746f206964656e74696679207468656d20696e2073656374696f6e7320312e31302e333220616e6420312e31302e3333206f66207468652061666f72656d656e74696f6e65642043696365726f2773207068696c6f736f70686963616c20776f726b2e0a0a',
        },
      ];

      for (const testCase of testCases) {
        const result = hexToAscii(testCase.hex);
        expect(typeof result).toEqual('string');
        expect(result).toEqual(testCase.ascii);
      }
    });

    test('should throw error with invalid hex', () => {
      const testCases: any[] = [
        null,
        undefined,
        'x',
        'as',
        '0x2',
        '0x4686520646973636f7665727920776173206d6164652062792052696368617264204d63436c696e746f636b202c20612070726f666573736f72206f66204c6174696e2061742048616d7064656e2d5379646e657920436f6c6c65676520696e2056697267696e69612c2077686f2066616365642074686520696d706574756f757320726563757272656e6365206f6620746865206461726b20776f726420636f6e736563746574757220696e207468652074657874204c6f72656d20697073756d207265736561726368656420697473206f726967696e7320746f206964656e74696679207468656d20696e2073656374696f6e7320312e31302e333220616e6420312e31302e3333206f66207468652061666f72656d656e74696f6e65642043696365726f2773207068696c6f736f70686963616c20776f726b2e0a0a',
      ];

      for (const testCase of testCases) {
        expect(() => hexToAscii(testCase)).toThrow();
      }
    });
  });

  describe('intToUintByte', () => {
    test('should return valid string with valid params', () => {
      const testCases = [
        { params: { ele: 0, radix: 8 }, result: '00' },
        { params: { ele: 19, radix: 8 }, result: '13' },
        { params: { ele: 55, radix: 8 }, result: '37' },
        { params: { ele: 812763, radix: 8 * 5 }, result: '00000c66db' },
        {
          params: { ele: 98273649812740, radix: 8 * 6 },
          result: '59611dfce504',
        },
        {
          params: { ele: '0x249C1AFCB', radix: 8 * 6 },
          result: '000249c1afcb',
        },
        {
          params: { ele: '6512', radix: 8 * 6 },
          result: '000000001970',
        },
        {
          params: { ele: '-19', radix: 8 * 6 },
          result: 'ffffffffffed',
        },
      ];

      for (const testCase of testCases) {
        const result = intToUintByte(
          testCase.params.ele,
          testCase.params.radix,
        );
        expect(result).toEqual(testCase.result);
      }
    });

    test('should throw error with invalid params', () => {
      const testCases: any[] = [
        { ele: null, radix: 7 },
        { ele: 0, radix: null },
        { ele: undefined, radix: 7 },
        { ele: 0, radix: undefined },
        { ele: undefined, radix: undefined },
        { ele: null, radix: null },
        { ele: undefined, radix: null },
        { ele: null, radix: undefined },
        { ele: 0, radix: 7 },
        { ele: 'asd', radix: 8 },
        { ele: 'x12', radix: 8 },
        { ele: 0, radix: 19 },
        { ele: 0, radix: 0 },
        { ele: 45067, radix: 8 },
        { ele: 721077, radix: 16 },
      ];

      for (const testCase of testCases) {
        expect(() => intToUintByte(testCase.ele, testCase.radix)).toThrow();
      }
    });
  });

  describe('padStart', () => {
    test('should return valid string with valid params', () => {
      const testCases = [
        {
          params: { str: '', targetLength: 8, padString: ' ' },
          result: '        ',
        },
        {
          params: { str: '0012', targetLength: 8, padString: ' ' },
          result: '    0012',
        },
        {
          params: { str: '912837ajs', targetLength: 4, padString: ' ' },
          result: '912837ajs',
        },
        {
          params: { str: '8761248912987', targetLength: 20, padString: '01' },
          result: '01010108761248912987',
        },
      ];

      for (const testCase of testCases) {
        const result = padStart(
          testCase.params.str,
          testCase.params.targetLength,
          testCase.params.padString,
        );
        expect(result).toEqual(testCase.result);
      }
    });

    test('should throw error with invalid params', () => {
      const testCases: any[] = [
        { str: null, targetLength: 0, padString: '' },
        { str: '', targetLength: null, padString: '' },
        { str: '', targetLength: 8, padString: null },
        { str: undefined, targetLength: 0, padString: '' },
        { str: '', targetLength: undefined, padString: '' },
        { str: '', targetLength: 8, padString: undefined },
        { str: '', targetLength: 8, padString: '' },
      ];

      for (const testCase of testCases) {
        expect(() =>
          padStart(testCase.str, testCase.targetLength, testCase.padString),
        ).toThrow();
      }
    });
  });

  describe('uint8ArrayToHex', () => {
    test('should return valid hex with valid params', () => {
      const testCases = [
        {
          uint8: new Uint8Array([]),
          result: '',
        },
        {
          uint8: new Uint8Array([12, 255, 78]),
          result: '0cff4e',
        },
        {
          uint8: new Uint8Array([213, 204, 204, 100, 217]),
          result: 'd5cccc64d9',
        },
        {
          uint8: new Uint8Array([
            12, 102, 56, 236, 103, 69, 123, 56, 48, 199, 71, 250, 121,
          ]),
          result: '0c6638ec67457b3830c747fa79',
        },
      ];

      for (const testCase of testCases) {
        const result = uint8ArrayToHex(testCase.uint8);
        expect(result).toEqual(testCase.result);
      }
    });
  });

  describe('hexToUint8Array', () => {
    test('should return valid hex with valid params', () => {
      const testCases = [
        {
          uint8: new Uint8Array([]),
          hex: '',
        },
        {
          uint8: new Uint8Array([12, 255, 78]),
          hex: '0cff4e',
        },
        {
          uint8: new Uint8Array([213, 204, 204, 100, 217]),
          hex: 'd5cccc64d9',
        },
        {
          uint8: new Uint8Array([
            12, 102, 56, 236, 103, 69, 123, 56, 48, 199, 71, 250, 121,
          ]),
          hex: '0x0c6638ec67457b3830c747fa79',
        },
      ];

      for (const testCase of testCases) {
        const result = hexToUint8Array(testCase.hex);
        expect(result).toEqual(testCase.uint8);
      }
    });

    test('should throw error with invalid params', () => {
      const testCases = [null, undefined, '124', 'asfkh'];

      for (const testCase of testCases) {
        expect(() => hexToUint8Array(testCase as any)).toThrow();
      }
    });
  });

  describe('crc16', () => {
    test('should return valid crc16', () => {
      const testCases = [
        {
          uint8: new Uint8Array([]),
          result: 0,
        },
        {
          uint8: new Uint8Array([
            145, 130, 99, 145, 38, 56, 151, 145, 39, 147, 241, 40, 115, 152, 23,
            35, 152, 113, 35, 250, 118, 250, 188, 237,
          ]),
          result: 56915,
        },
        {
          uint8: new Uint8Array([
            97, 108, 115, 107, 104, 100, 105, 111, 97, 121, 99, 107, 106, 97,
            98, 99, 107, 97, 104, 100, 97, 115, 104, 99, 110, 97, 115, 99, 104,
            97, 105, 111, 104, 115, 99, 107, 97, 104, 117, 105, 119, 97, 115,
            110, 99, 97, 115, 99, 111, 105, 97, 119, 97, 99, 98, 115, 106, 98,
            97, 99, 104, 113, 119, 111, 100, 104, 97, 111, 105, 115, 99, 110,
          ]),
          result: 28193,
        },
        {
          uint8: new Uint8Array([
            115, 107, 103, 100, 102, 97, 111, 105, 119, 103, 32, 102, 105, 108,
            97, 103, 100, 105, 103, 32, 97, 119, 105, 100, 103, 102, 105, 97,
            103, 100, 102, 105, 32, 97, 103, 119, 100, 111, 102, 103, 32, 108,
            105, 115, 97, 100, 103, 105, 97, 103, 119, 100, 102, 105, 103, 97,
            100, 107, 106, 115,
          ]),
          result: 33357,
        },
      ];

      for (const testCase of testCases) {
        const result = crc16(testCase.uint8);
        expect(result).toEqual(testCase.result);
      }
    });
  });
});
