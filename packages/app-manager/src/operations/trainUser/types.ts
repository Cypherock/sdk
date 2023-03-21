import { TrainUserStatus } from '../../proto/generated/types';

export type TrainUserEventHandler = (event: TrainUserStatus) => void;
