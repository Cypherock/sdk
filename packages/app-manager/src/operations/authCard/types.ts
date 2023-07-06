import { AuthCardStatus } from '../../proto/generated/types';

export type AuthCardEventHandler = (event: AuthCardStatus) => void;

export interface IAuthCardParams {
  cardNumber?: number;
  isPairRequired?: boolean;
  onEvent?: AuthCardEventHandler;
  email?: string;
  cysyncVersion?: string;
  onlyFailure?: boolean;
  sessionId?: string;
}
