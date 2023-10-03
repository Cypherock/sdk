import * as eip712 from 'eip-712';

import { eip712JsonToStruct, setEip712Lib } from '../../src/utils';
import fixtures from './__fixtures__';

describe('eip712JsonToStruct', () => {
  beforeAll(() => {
    setEip712Lib(eip712);
  });

  fixtures.valid.forEach((testCase, index) => {
    it(`${index}.should convert EIP712TypedData to SignTypedDataStruct`, () => {
      const result = eip712JsonToStruct(testCase.data);
      expect(result).toEqual(testCase.results);
    });
  });
});
