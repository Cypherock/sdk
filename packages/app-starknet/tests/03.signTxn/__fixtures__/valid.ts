import { hexToUint8Array } from '@cypherock/sdk-utils';
import { ISignTxnTestCase } from './types';
import { queryToUint8Array, resultToUint8Array } from '../__helpers__';

const sendWithSerialize: ISignTxnTestCase = {
  name: 'Starknet transfer',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPath: [
      0x80000000 + 0xa55,
      0x80000000 + 0x4741e9c9,
      0x80000000 + 0x447a6028,
      0x80000000,
      0x80000000,
      0xc,
    ],
    txn: {
      invokeTxn: {
        senderAddress: new Uint8Array([
          199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233,
          62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3,
          187, 121, 64,
        ]),
        version: new Uint8Array([0x0]),
        calldata: { value: [new Uint8Array([0x0])] },
        chainId: new Uint8Array([0x0]),
        nonce: new Uint8Array([0x20]),
        accountDeploymentData: [new Uint8Array([0x0])],
        nonceDataAvailabilityMode: new Uint8Array([0x0]),
        feeDataAvailabilityMode: new Uint8Array([0x0]),
        resourceBound: {
          level1: {
            maxAmount: new Uint8Array([0x0]),
            maxPricePerUnit: new Uint8Array([0x0]),
          },
          level2: {
            maxAmount: new Uint8Array([0x0]),
            maxPricePerUnit: new Uint8Array([0x0]),
          },
        },
        tip: new Uint8Array([0x0]),
        paymasterData: [new Uint8Array([0x0])],
      },
    },
  },
  queries: [
    {
      name: 'Initate query',
      data: queryToUint8Array({
        signTxn: {
          initiate: {
            walletId: new Uint8Array([
              199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103,
              233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128,
              26, 3, 187, 121, 64,
            ]),
            derivationPath: [
              0x80000000 + 0xa55,
              0x80000000 + 0x4741e9c9,
              0x80000000 + 0x447a6028,
              0x80000000,
              0x80000000,
              0xc,
            ],
          },
        },
      }),
    },
    {
      name: 'Sign Txn Data',
      data: queryToUint8Array({
        signTxn: {
          txn: {
            invokeTxn: {
              senderAddress: new Uint8Array([
                199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103,
                233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86,
                128, 26, 3, 187, 121, 64,
              ]),
              version: new Uint8Array([0x0]),
              calldata: { value: [new Uint8Array([0x0])] },
              chainId: new Uint8Array([0x0]),
              nonce: new Uint8Array([0x20]),
              accountDeploymentData: [new Uint8Array([0x0])],
              nonceDataAvailabilityMode: new Uint8Array([0x0]),
              feeDataAvailabilityMode: new Uint8Array([0x0]),
              resourceBound: {
                level1: {
                  maxAmount: new Uint8Array([0x0]),
                  maxPricePerUnit: new Uint8Array([0x0]),
                },
                level2: {
                  maxAmount: new Uint8Array([0x0]),
                  maxPricePerUnit: new Uint8Array([0x0]),
                },
              },
              tip: new Uint8Array([0x0]),
              paymasterData: [new Uint8Array([0x0])],
            },
          },
        },
      }),
    },
    {
      name: 'Signature request',
      data: queryToUint8Array({
        signTxn: {
          signature: {},
        },
      }),
    },
  ],
  results: [
    {
      name: 'Confirmation',
      data: resultToUint8Array({
        signTxn: {
          confirmation: {},
        },
      }),
    },
    {
      name: 'Accepted',
      data: resultToUint8Array({
        signTxn: {
          unsignedTxnAccepted: {},
        },
      }),
    },
    {
      name: 'Signature',
      data: resultToUint8Array({
        signTxn: {
          signature: {
            signature: hexToUint8Array(
              'fc6a1780ad15dd1e6dc73b45e178d69e61815f64a50c31fe260e1d3d2153794ec7f032feb0e686c0345500b2f6dbc905f3761dc6e9091c1b1a01b7aad9ce1907',
            ),
          },
        },
      }),
    },
  ],
  mocks: {
    eventCalls: [[0], [1], [2], [3], [4]],
  },
  output: {
    signature:
      'fc6a1780ad15dd1e6dc73b45e178d69e61815f64a50c31fe260e1d3d2153794ec7f032feb0e686c0345500b2f6dbc905f3761dc6e9091c1b1a01b7aad9ce1907',
    serializedTxn:
      'fc6a1780ad15dd1e6dc73b45e178d69e61815f64a50c31fe260e1d3d2153794ec7f032feb0e686c0345500b2f6dbc905f3761dc6e9091c1b1a01b7aad9ce1907',
  },
};

const valid: ISignTxnTestCase[] = [sendWithSerialize];

export default valid;
