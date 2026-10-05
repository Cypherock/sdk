import { ethers } from 'ethers';

import { eip712JsonToStruct, setEthersLib } from '../../src/utils';
import fixtures from './__fixtures__';

describe('eip712JsonToStruct', () => {
  beforeAll(() => {
    setEthersLib(ethers);
  });

  fixtures.valid.forEach((testCase, index) => {
    it(`${index}.should convert EIP712TypedData to SignTypedDataStruct`, () => {
      const result = eip712JsonToStruct(testCase.data);
      expect(result).toEqual(testCase.results);
    });
  });
});
