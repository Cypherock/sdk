import { eip712JsonToStruct } from '../../src/utils';
import fixtures from './__fixtures__';

describe('eip712JsonToStruct', () => {
  fixtures.valid.forEach((testCase, index) => {
    it(`${index}.should convert EIP712TypedData to SignTypedDataStruct`, () => {
      const result = eip712JsonToStruct(testCase.data);
      expect(result).toEqual(testCase.results);
    });
  });
});
