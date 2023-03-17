import { DeviceAppError } from '@cypherock/sdk-interfaces';

const fixtures = {
  valid: [
    {
      name: 'No wallets',
      query: new Uint8Array([18, 0]),
      result: new Uint8Array([18, 0]),
      output: {
        walletList: [],
      },
    },
    {
      name: 'With 1 wallet',
      query: new Uint8Array([18, 0]),
      result: new Uint8Array([
        18, 29, 10, 27, 10, 12, 172, 202, 213, 11, 207, 28, 212, 148, 211, 254,
        190, 172, 18, 9, 67, 121, 112, 104, 101, 114, 111, 99, 107, 24, 1,
      ]),
      output: {
        walletList: [
          {
            id: new Uint8Array([
              172, 202, 213, 11, 207, 28, 212, 148, 211, 254, 190, 172,
            ]),
            name: 'Cypherock',
            hasPin: true,
            hasPassphrase: false,
          },
        ],
      },
    },
    {
      name: 'With 4 wallet',
      query: new Uint8Array([18, 0]),
      result: new Uint8Array([
        18, 138, 1, 10, 27, 10, 12, 172, 202, 213, 11, 207, 28, 212, 148, 211,
        254, 190, 172, 18, 9, 67, 121, 112, 104, 101, 114, 111, 99, 107, 24, 1,
        10, 36, 10, 16, 20, 180, 243, 105, 94, 24, 43, 158, 169, 152, 195, 4,
        65, 16, 127, 216, 18, 16, 87, 97, 108, 108, 101, 116, 32, 114, 97, 110,
        100, 111, 109, 33, 33, 33, 10, 43, 10, 22, 160, 47, 195, 132, 26, 22,
        63, 61, 10, 41, 91, 123, 129, 33, 225, 87, 190, 17, 252, 63, 185, 225,
        18, 15, 109, 121, 64, 101, 109, 97, 105, 108, 32, 119, 97, 108, 108,
        101, 116, 24, 1, 10, 24, 10, 22, 52, 159, 176, 31, 243, 146, 57, 72,
        187, 198, 171, 176, 73, 19, 198, 239, 200, 22, 59, 4, 107, 252,
      ]),
      output: {
        walletList: [
          {
            id: new Uint8Array([
              172, 202, 213, 11, 207, 28, 212, 148, 211, 254, 190, 172,
            ]),
            name: 'Cypherock',
            hasPin: true,
            hasPassphrase: false,
          },
          {
            id: new Uint8Array([
              20, 180, 243, 105, 94, 24, 43, 158, 169, 152, 195, 4, 65, 16, 127,
              216,
            ]),
            name: 'Wallet random!!!',
            hasPin: false,
            hasPassphrase: false,
          },
          {
            id: new Uint8Array([
              160, 47, 195, 132, 26, 22, 63, 61, 10, 41, 91, 123, 129, 33, 225,
              87, 190, 17, 252, 63, 185, 225,
            ]),
            name: 'my@email wallet',
            hasPin: true,
            hasPassphrase: false,
          },
          {
            id: new Uint8Array([
              52, 159, 176, 31, 243, 146, 57, 72, 187, 198, 171, 176, 73, 19,
              198, 239, 200, 22, 59, 4, 107, 252,
            ]),
            name: '',
            hasPin: false,
            hasPassphrase: false,
          },
        ],
      },
    },
  ],
  error: [
    {
      query: new Uint8Array([18, 0]),
      result: new Uint8Array([
        18, 29, 34, 27, 10, 12, 172, 202, 213, 11, 207, 28, 212, 148, 211, 254,
      ]),
      errorInstance: DeviceAppError,
    },
    {
      query: new Uint8Array([18, 0]),
      result: new Uint8Array([
        18, 29, 34, 27, 10, 12, 172, 202, 213, 11, 207, 28, 212, 148, 211, 254,
        190, 172, 18, 9, 67, 121, 112, 104, 101, 114, 111, 99, 107, 24,
      ]),
      errorInstance: DeviceAppError,
    },
    {
      query: new Uint8Array([18, 0]),
      result: new Uint8Array([18]),
      errorInstance: DeviceAppError,
    },
    {
      query: new Uint8Array([18, 0]),
      result: new Uint8Array([]),
      errorInstance: DeviceAppError,
    },
    {
      query: new Uint8Array([18, 0]),
      result: new Uint8Array([
        10, 30, 10, 12, 123, 43, 26, 231, 42, 86, 91, 130, 41, 55, 186, 203, 18,
        2, 8, 1, 24, 1, 34, 8, 8, 12, 18, 4, 8, 1, 24, 26,
      ]),
      errorInstance: DeviceAppError,
    },
  ],
};

export default fixtures;
