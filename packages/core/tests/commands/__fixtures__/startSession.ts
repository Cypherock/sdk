import { hexToUint8Array, uint8ArrayToHex } from '@cypherock/sdk-utils';
import { ITestCase, msgToUint8Array } from '../__helpers__';
import { PacketVersionMap } from '../../../src/utils';

export interface IValidTestCase extends ITestCase {
  name: string;
  output: string;
}

const validTestCases: IValidTestCase[] = [
  {
    name: 'Successful session',
    sendCommands: [
      {
        name: 'Initiate request',
        data: {
          protoData: uint8ArrayToHex(
            msgToUint8Array({
              sessionStart: {
                request: {
                  initiate: {},
                },
              },
            }),
          ),
          rawData: '',
          sequenceNumber: 0,
          version: PacketVersionMap.v3,
        },
      },
      {
        name: 'Start request',
        data: {
          protoData: uint8ArrayToHex(
            msgToUint8Array({
              sessionStart: {
                request: {
                  start: {
                    sessionRandomPublic: hexToUint8Array(
                      '0x036e8642991660a99c1a54ab3ca3255d7e6c60fdcce4c25b7105dd1032e6ee50',
                    ),
                    signature: hexToUint8Array(
                      '0x205439a820b99e1f2a2ff415b0ce1b288119bb520ea74a79b38da8c7bedd593d',
                    ),
                    sessionAge: 120,
                  },
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
        name: 'Initiate response',
        data: msgToUint8Array({
          sessionStart: {
            response: {
              confirmationInitiate: {
                deviceId: hexToUint8Array(
                  '0x11dc596c392a199178e21a18cfde4da95a0ef0d90b8665d4e418cb3ae3189f29',
                ),
                deviceRandomPublic: hexToUint8Array(
                  '0xcf2005cd0d7997613612b58f3823caa52fb23784930f53e41e2549e08965f1fc',
                ),
                postfix1: hexToUint8Array(
                  '0x6e430b9ea65a14bad3775698dcd6a7a8640656e0bf4094e2e8d0ee45f3ebede5',
                ),
                postfix2: hexToUint8Array(
                  '0xac9e68f3453270733b48ae00d75f2b41db47082e2acf85147500523ebc6c2679',
                ),
                signature: hexToUint8Array(
                  '0xb34e28d6712b9a11ef23474131576885f6e0a4d479b38ad633cbec879094268f',
                ),
              },
            },
          },
        }),
      },
      {
        name: 'Start response',
        data: msgToUint8Array({
          sessionStart: {
            response: {
              confirmationStart: {},
            },
          },
        }),
      },
    ],
    mocks: {
      initiateServerSession: {
        params: {
          deviceId: hexToUint8Array(
            '0x11dc596c392a199178e21a18cfde4da95a0ef0d90b8665d4e418cb3ae3189f29',
          ),
          deviceRandomPublic: hexToUint8Array(
            '0xcf2005cd0d7997613612b58f3823caa52fb23784930f53e41e2549e08965f1fc',
          ),
          postfix1: hexToUint8Array(
            '0x6e430b9ea65a14bad3775698dcd6a7a8640656e0bf4094e2e8d0ee45f3ebede5',
          ),
          postfix2: hexToUint8Array(
            '0xac9e68f3453270733b48ae00d75f2b41db47082e2acf85147500523ebc6c2679',
          ),
          signature: hexToUint8Array(
            '0xb34e28d6712b9a11ef23474131576885f6e0a4d479b38ad633cbec879094268f',
          ),
        },
        result: {
          serverRandomPublic:
            '0x036e8642991660a99c1a54ab3ca3255d7e6c60fdcce4c25b7105dd1032e6ee50',
          sessionAge: 120,
          sessionId:
            '0xd7592df96675788f7d87efa5b8de04a8d1dbbc5a453aa3c97ce2fdae1684e4fc',
          signature:
            '0x205439a820b99e1f2a2ff415b0ce1b288119bb520ea74a79b38da8c7bedd593d',
        },
      },
      startServerSession: {
        params: {
          sessionId:
            '0xd7592df96675788f7d87efa5b8de04a8d1dbbc5a453aa3c97ce2fdae1684e4fc',
        },
      },
    },
    output:
      '0xd7592df96675788f7d87efa5b8de04a8d1dbbc5a453aa3c97ce2fdae1684e4fc',
  },
];

const startSessionTestCases = {
  constantDate: new Date('2023-03-07T09:43:48.755Z'),
  valid: validTestCases,
};

export default startSessionTestCases;
