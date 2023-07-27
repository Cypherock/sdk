import {
  BITCOIN_COIN_INDEX,
  DASH_COIN_INDEX,
  DOGECOIN_COIN_INDEX,
  HARDENED_BASE,
  LEGACY_PURPOSE,
  LITECOIN_COIN_INDEX,
  SEGWIT_PURPOSE,
} from '../../../../utils';

export const getAddressFromPublicKeyTestCases = {
  valid: [
    {
      input: {
        publicKey: new Uint8Array([
          4, 114, 58, 22, 162, 239, 174, 254, 135, 250, 145, 227, 19, 86, 116,
          116, 149, 216, 5, 0, 203, 143, 67, 230, 139, 84, 209, 34, 137, 41,
          170, 109, 14, 188, 192, 157, 100, 168, 130, 25, 201, 255, 77, 143, 78,
          132, 189, 135, 29, 181, 90, 242, 35, 242, 156, 128, 139, 53, 162, 142,
          26, 13, 227, 31, 105,
        ]),
        derivationPath: [
          LEGACY_PURPOSE,
          BITCOIN_COIN_INDEX,
          HARDENED_BASE,
          1,
          0,
        ],
      },
      output: '12K1ctzU34VvByyDNsAurmd4xX1pGiP2w3',
    },
    {
      input: {
        publicKey: new Uint8Array([
          4, 26, 135, 73, 214, 210, 175, 19, 78, 83, 234, 201, 149, 86, 177,
          161, 13, 225, 178, 121, 239, 68, 112, 120, 112, 203, 34, 151, 97, 163,
          221, 130, 247, 3, 115, 114, 117, 149, 71, 48, 88, 216, 250, 125, 150,
          65, 120, 93, 141, 7, 21, 19, 115, 157, 209, 231, 214, 178, 214, 13,
          153, 71, 7, 228, 7,
        ]),
        derivationPath: [
          SEGWIT_PURPOSE,
          BITCOIN_COIN_INDEX,
          HARDENED_BASE,
          1,
          0,
        ],
      },
      output: 'bc1qyxhcx4t9d7gvrd8ft2agax24xrh4pjry4wjmms',
    },
    {
      input: {
        publicKey: new Uint8Array([
          4, 54, 86, 107, 207, 196, 179, 185, 206, 145, 120, 66, 75, 79, 5, 73,
          201, 10, 104, 143, 67, 205, 71, 240, 237, 197, 80, 86, 226, 131, 172,
          119, 154, 46, 65, 224, 160, 197, 158, 49, 62, 73, 206, 186, 254, 24,
          245, 149, 64, 34, 172, 247, 207, 232, 127, 8, 72, 85, 81, 70, 121,
          217, 94, 78, 119,
        ]),
        derivationPath: [LEGACY_PURPOSE, DASH_COIN_INDEX, HARDENED_BASE, 1, 0],
      },
      output: 'XhLRPaXaTbjzjPcHKzVnurR7RtEDfQDYnC',
    },
    {
      input: {
        publicKey: new Uint8Array([
          4, 54, 86, 107, 207, 196, 179, 185, 206, 145, 120, 66, 75, 79, 5, 73,
          201, 10, 104, 143, 67, 205, 71, 240, 237, 197, 80, 86, 226, 131, 172,
          119, 154, 46, 65, 224, 160, 197, 158, 49, 62, 73, 206, 186, 254, 24,
          245, 149, 64, 34, 172, 247, 207, 232, 127, 8, 72, 85, 81, 70, 121,
          217, 94, 78, 119,
        ]),
        derivationPath: [
          LEGACY_PURPOSE,
          LITECOIN_COIN_INDEX,
          HARDENED_BASE,
          1,
          0,
        ],
      },
      output: 'LRsXpYBWaYmTqFhreFAsLLo5om1omqPv29',
    },
    {
      input: {
        publicKey: new Uint8Array([
          4, 54, 86, 107, 207, 196, 179, 185, 206, 145, 120, 66, 75, 79, 5, 73,
          201, 10, 104, 143, 67, 205, 71, 240, 237, 197, 80, 86, 226, 131, 172,
          119, 154, 46, 65, 224, 160, 197, 158, 49, 62, 73, 206, 186, 254, 24,
          245, 149, 64, 34, 172, 247, 207, 232, 127, 8, 72, 85, 81, 70, 121,
          217, 94, 78, 119,
        ]),
        derivationPath: [
          SEGWIT_PURPOSE,
          LITECOIN_COIN_INDEX,
          HARDENED_BASE,
          1,
          0,
        ],
      },
      output: 'ltc1qfrkzs4y7p63y0ygwzg6l5pn87jnj5a9t9mp7ud',
    },
    {
      input: {
        publicKey: new Uint8Array([
          4, 5, 191, 16, 114, 188, 69, 90, 70, 156, 8, 194, 158, 52, 28, 209,
          99, 31, 9, 122, 241, 57, 208, 182, 38, 194, 193, 210, 200, 30, 171,
          216, 201, 90, 106, 161, 38, 83, 172, 174, 6, 89, 189, 35, 112, 137,
          99, 98, 156, 220, 219, 111, 110, 193, 146, 220, 213, 87, 91, 214, 153,
          139, 154, 129, 223,
        ]),
        derivationPath: [
          LEGACY_PURPOSE,
          DOGECOIN_COIN_INDEX,
          HARDENED_BASE,
          1,
          0,
        ],
      },
      output: 'DEoRrM4MHW68q57TNREvTMeWXq8uo8xk4C',
    },
  ],
  invalid: [
    {
      publicKey: new Uint8Array([
        4, 114, 58, 22, 162, 239, 174, 254, 135, 250, 145, 227, 19, 86, 116,
        116, 149, 216, 5, 0, 203, 143, 67, 230, 139, 84, 209, 34, 137, 41, 170,
        109, 14, 188, 192, 157, 100, 168, 130, 25, 201, 255, 77, 143, 78, 132,
        189, 135, 29, 181, 90, 242, 35, 242, 156, 128, 139, 53, 162, 142, 26,
        13, 227, 31, 105,
      ]),
      derivationPath: [LEGACY_PURPOSE, 4, HARDENED_BASE, 1, 0],
    },
    {
      publicKey: new Uint8Array([
        4, 114, 58, 22, 162, 239, 174, 254, 135, 250, 145, 227, 19, 86, 116,
        116, 149, 216, 5, 0, 203, 143, 67, 230, 139, 84, 209, 34, 137, 41, 170,
        109, 14, 188, 192, 157, 100, 168, 130, 25, 201, 255, 77, 143, 78, 132,
        189, 135, 29, 181, 90, 242, 35, 242, 156, 128, 139, 53, 162, 142, 26,
        13, 227, 31, 105,
      ]),
      derivationPath: [LEGACY_PURPOSE, 99, HARDENED_BASE, 1, 0],
    },
    {
      publicKey: new Uint8Array([
        4, 114, 58, 22, 162, 239, 174, 254, 135, 250, 145, 227, 19, 86, 116,
        116, 149, 216, 5, 0, 203, 143, 67, 230, 139, 84, 209, 34, 137, 41, 170,
        109, 14, 188, 192, 157, 100, 168, 130, 25, 201, 255, 77, 143, 78, 132,
        189, 135, 29, 181, 90, 242, 35, 242, 156, 128, 139, 53, 162, 142, 26,
        13, 227, 31, 105,
      ]),
      derivationPath: [134, 99, HARDENED_BASE, 1, 0],
    },
    {
      publicKey: new Uint8Array([]),
      derivationPath: [LEGACY_PURPOSE, 0, HARDENED_BASE, 1, 0],
    },
  ],
};
