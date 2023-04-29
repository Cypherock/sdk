import {
  GetXpubsStatus,
  IGetXpubsIntiateRequest,
} from '../../proto/generated/types';

export type GetXpubsEventHandler = (event: GetXpubsStatus) => void;

export interface IGetXpubsParams extends IGetXpubsIntiateRequest {
  onEvent?: GetXpubsEventHandler;
}
