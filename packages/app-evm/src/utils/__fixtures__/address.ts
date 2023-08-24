import { hexToUint8Array } from '@cypherock/sdk-utils';

export interface IGetAddressFromPublicKeyTestCase {
  publicKey: Uint8Array | string;
  address: string;
}

const fixtures: IGetAddressFromPublicKeyTestCase[] = [
  {
    publicKey:
      '0x0352ae5aa4e5fd42ccba911a9e0454e2e9857be4fe285b9db1c3420c57a15df469',
    address: '0xC15B3b7D83E61ca9d8Ca452734a5D03bDB0Bf2f8',
  },
  {
    address: '0xd17D1dC290BA7345a49318A4da489a39Fd4fFEB9',
    publicKey:
      '030b07c453ba2f2e805876a6f4e184240632333483e9d090cb2ed389630a16b55e',
  },
  {
    address: '0x027a89D69D8D59CCD25F7f95dC175cbDDf95f489',
    publicKey: hexToUint8Array(
      '0x02dcb5b2032f0c80019ebb042df94db5f523ed0cea949f0106c49fdcfb7bc54c72',
    ),
  },
  {
    address: '0xcf282DC371BAA836be32737B3239DECCe7CE0ABC',
    publicKey:
      '6652f174b66a0f0e1449890f5eae8cc4928c639cfe21625d1179e16f23f19580567239e8ae439c2920691949d0ca4e021fdced8a253a16d6e92151b18f8e285a',
  },
];

export default fixtures;
