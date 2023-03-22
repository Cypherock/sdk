import {
  GetPublicKeyStatus,
  IGetPublicKeyIntiateRequest,
} from '../../proto/generated/types';

export type GetPublicKeyEventHandler = (event: GetPublicKeyStatus) => void;

export interface IGetPublicKeyParams extends IGetPublicKeyIntiateRequest {
  onEvent?: GetPublicKeyEventHandler;
}
