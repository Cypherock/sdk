import { TrainUserStatus } from '../../proto/generated/types';

export type TrainUserEventHandler = (event: TrainUserStatus) => void;

export interface ITrainUserParams {
  jumpToState?: TrainUserStatus;
  onEvent?: TrainUserEventHandler;
}
