import { ISDK } from '@cypherock/sdk-core';
import {
  createLoggerWithPrefix,
  createStatusListener,
} from '@cypherock/sdk-utils';
import { TrainJoystickStatus } from '../../proto/generated/types';

import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import { TrainJoystickEventHandler } from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'TrainJoystick');

export const trainJoystick = async (
  sdk: ISDK,
  onEvent?: TrainJoystickEventHandler,
): Promise<void> => {
  logger.info('Started');
  const helper = new OperationHelper(sdk, 'trainJoystick', 'trainJoystick');

  const { onStatus, forceStatusUpdate } = createStatusListener({
    enums: TrainJoystickStatus,
    onEvent,
    logger,
  });

  await helper.sendQuery({ initiate: {} });
  const result = await helper.waitForResult(onStatus);
  logger.verbose('TrainJoystickResponse', { result });
  assertOrThrowInvalidResult(result.result);

  forceStatusUpdate(TrainJoystickStatus.TRAIN_JOYSTICK_CENTER);
  logger.info('Completed');
};
