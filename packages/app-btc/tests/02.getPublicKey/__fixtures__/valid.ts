import { IGetPublicKeyTestCase } from './types';

const requestXpub: IGetPublicKeyTestCase = {
  name: 'Request Xpub',
  params: {
    walletId: new Uint8Array([10]),
    derivationPath: [
      { path: 44, isHardened: true },
      { path: 0, isHardened: true },
      { path: 0, isHardened: true },
    ],
  },
  query: new Uint8Array([
    10, 19, 10, 17, 10, 1, 10, 18, 4, 8, 44, 16, 1, 18, 2, 16, 1, 18, 2, 16, 1,
  ]),
  result: new Uint8Array([
    10, 115, 10, 113, 10, 111, 120, 112, 117, 98, 54, 68, 68, 99, 57, 107, 109,
    112, 102, 98, 72, 57, 117, 109, 75, 69, 83, 117, 117, 49, 103, 78, 100, 105,
    87, 83, 116, 106, 71, 54, 67, 110, 104, 77, 86, 49, 113, 97, 78, 111, 50,
    98, 118, 52, 67, 113, 72, 122, 120, 85, 98, 53, 86, 68, 115, 86, 52, 77, 86,
    112, 83, 70, 86, 78, 121, 121, 109, 83, 112, 98, 74, 76, 55, 57, 75, 89, 86,
    57, 75, 56, 88, 82, 100, 105, 98, 70, 109, 118, 54, 116, 86, 54, 116, 50,
    122, 52, 100, 87, 110, 111, 110, 78, 52, 78, 77, 89, 109,
  ]),
  output: {
    publicKey:
      'xpub6DDc9kmpfbH9umKESuu1gNdiWStjG6CnhMV1qaNo2bv4CqHzxUb5VDsV4MVpSFVNyymSpbJL79KYV9K8XRdibFmv6tV6t2z4dWnonN4NMYm',
  },
};

const requestAddress: IGetPublicKeyTestCase = {
  name: 'Request Address',
  params: {
    walletId: new Uint8Array([
      199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38, 17, 160, 103, 233, 62,
      110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86, 128, 26, 3, 187, 121,
      64,
    ]),
    derivationPath: [
      { path: 44, isHardened: true },
      { path: 0, isHardened: true },
      { path: 0, isHardened: true },
      { path: 0, isHardened: false },
      { path: 0, isHardened: false },
    ],
  },
  query: new Uint8Array([
    10, 60, 10, 58, 10, 34, 199, 89, 252, 26, 32, 135, 183, 211, 90, 220, 38,
    17, 160, 103, 233, 62, 110, 172, 92, 20, 35, 250, 190, 146, 62, 8, 53, 86,
    128, 26, 3, 187, 121, 64, 18, 4, 8, 44, 16, 1, 18, 2, 16, 1, 18, 2, 16, 1,
    18, 2, 16, 0, 18, 2, 16, 0,
  ]),
  result: new Uint8Array([
    10, 38, 10, 36, 10, 34, 49, 76, 56, 81, 98, 49, 115, 75, 80, 80, 78, 77, 82,
    98, 117, 83, 84, 106, 54, 87, 49, 87, 88, 110, 71, 102, 122, 120, 114, 83,
    77, 102, 90, 82,
  ]),
  output: {
    publicKey: '1L8Qb1sKPPNMRbuSTj6W1WXnGfzxrSMfZR',
  },
};

const valid: IGetPublicKeyTestCase[] = [requestXpub, requestAddress];

export default valid;
