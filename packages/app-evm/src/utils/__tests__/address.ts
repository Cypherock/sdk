// eslint-disable-next-line import/no-extraneous-dependencies
import { ethers } from 'ethers';
import fixtures from '../__fixtures__/address';
import { getAddressFromPublicKey } from '../address';
import { setEthersLib } from '../ethers';

describe('getAddressFromPublicKey', () => {
  beforeAll(() => {
    setEthersLib(ethers);
  });
  fixtures.forEach(testCase => {
    test(testCase.address, () => {
      expect(getAddressFromPublicKey(testCase.publicKey)).toEqual(
        testCase.address,
      );
    });
  });
});
