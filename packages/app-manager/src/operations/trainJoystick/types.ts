import { TrainJoystickStatus } from '../../proto/generated/types';

export type TrainJoystickEventHandler = (event: TrainJoystickStatus) => void;
