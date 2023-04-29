import { AuthCardStatus } from '../../proto/generated/types';

export type AuthCardEventHandler = (event: AuthCardStatus) => void;

export interface IAuthCardParams {
  cardIndex?: number;
  onEvent?: AuthCardEventHandler;
}
