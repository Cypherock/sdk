import { IGetXpubsIntiateRequest } from '../../proto/generated/types';

export enum GetXpubsEvent {
  INIT = 0,
  CONFIRM = 1,
  PASSPHRASE = 2,
  PIN_CARD = 3,
}

export type GetXpubsEventHandler = (event: GetXpubsEvent) => void;

export interface IGetXpubsParams extends IGetXpubsIntiateRequest {
  onEvent?: GetXpubsEventHandler;
}
