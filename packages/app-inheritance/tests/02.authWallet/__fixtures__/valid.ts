import { hexToUint8Array, createFlowStatus } from '@cypherock/sdk-utils';
import { Query, Result } from '../../../src/proto/generated/inheritance/core';
import { IAuthWalletTestCase } from './types';

const authenticateWalletWithPublicKey: IAuthWalletTestCase = {
  name: 'Authenticate wallet with publickey',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187,
    ]),
    challenge: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    withPublicKey: true,
    type: 'wallet-based',
  },
  queries: [
    {
      name: 'Initate query',
      data: Uint8Array.from(
        Query.encode(
          Query.create({
            authWallet: {
              initiate: {
                walletId: new Uint8Array([
                  199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160,
                  103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53,
                  86, 128, 26, 3, 187,
                ]),
                challenge: new Uint8Array([
                  199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160,
                  103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53,
                  86, 128, 26, 3, 187, 121, 64,
                ]),
                withPublicKey: true,
                doWalletBased: true,
                doSeedBased: false,
              },
            },
          }),
        ).finish(),
      ),
    },
  ],
  results: [
    {
      name: 'result',
      data: Uint8Array.from(
        Result.encode(
          Result.create({
            authWallet: {
              result: {
                walletBased: {
                  signature: hexToUint8Array(
                    '0x032891c403786eed3405bf29304abbcbb5282bc2b30eb3c45759f42bc9bb1b62c6',
                  ),
                  publicKey: hexToUint8Array(
                    '0x032891c403786eed3405bf29304abbcbb5282bc2b30eb3c45759f42bc9bb1b62c6',
                  ),
                },
              },
            },
          }),
        ).finish(),
      ),
      statuses: [
        {
          flowStatus: createFlowStatus(0, 0),
          expectEventCalls: [0],
        },
        {
          flowStatus: createFlowStatus(1, 0),
          expectEventCalls: [1],
        },
        {
          flowStatus: createFlowStatus(2, 0),
          expectEventCalls: [2],
        },
        {
          flowStatus: createFlowStatus(3, 0),
          expectEventCalls: [3],
        },
        {
          flowStatus: createFlowStatus(4, 0),
          expectEventCalls: [4],
        },
      ],
    },
  ],
  mocks: { eventCalls: [[0], [1], [2], [3], [4]] },
  output: {
    walletBased: {
      signature: hexToUint8Array(
        '0x032891c403786eed3405bf29304abbcbb5282bc2b30eb3c45759f42bc9bb1b62c6',
      ),
      publicKey: hexToUint8Array(
        '0x032891c403786eed3405bf29304abbcbb5282bc2b30eb3c45759f42bc9bb1b62c6',
      ),
    },
  },
};

const valid: IAuthWalletTestCase[] = [authenticateWalletWithPublicKey];

export default valid;
