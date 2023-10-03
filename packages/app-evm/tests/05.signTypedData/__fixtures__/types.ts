import { EIP712TypedData } from '../../../src/utils';
import { SignTypedDataStruct } from '../../../src/proto/generated/evm/sign_msg';

export interface ISignTypedDataCase {
  data: EIP712TypedData;
  results: SignTypedDataStruct;
}

export interface IFixtures {
  valid: ISignTypedDataCase[];
}
