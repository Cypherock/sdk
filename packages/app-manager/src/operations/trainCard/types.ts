import { ITrainCardResult, TrainCardStatus } from '../../proto/generated/types';

export type TrainCardEventHandler = (event: TrainCardStatus) => void;

export interface ITrainCardParams {
  onWallets: (params: ITrainCardResult) => Promise<boolean>;
  onEvent?: TrainCardEventHandler;
}
