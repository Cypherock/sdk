import { IVerifyEntityInfoInitiateRequest } from '../../proto/generated/types';

export type IVerifyEntityInfoParams = IVerifyEntityInfoInitiateRequest;

export interface IVerifyEntityInfoResult {
  verified: boolean;
}
