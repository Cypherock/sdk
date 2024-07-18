import { uint8ArrayToHex } from '@cypherock/sdk-utils';
import { ITestCase, msgToUint8Array } from '../__helpers__';
import { PacketVersionMap } from '../../../src/utils';

export interface IValidTestCase extends ITestCase {
  name: string;
}

const validTestCases: IValidTestCase[] = [
  {
    name: 'Successfully close session',
    sendCommands: [
      {
        name: 'Close request',
        data: {
          protoData: uint8ArrayToHex(
            msgToUint8Array({
              sessionClose: {
                request: {
                  clear: {},
                },
              },
            }),
          ),
          rawData: '',
          sequenceNumber: 0,
          version: PacketVersionMap.v3,
        },
      },
    ],
    results: [
      {
        name: 'Close response',
        data: msgToUint8Array({
          sessionClose: {
            response: {
              clear: {},
            },
          },
        }),
      },
    ],
  },
];

const closeSessionTestCases = {
  constantDate: new Date('2023-03-07T09:43:48.755Z'),
  valid: validTestCases,
};

export default closeSessionTestCases;
