import { ISDK } from '@cypherock/sdk-core';
import { createStatusListener } from '@cypherock/sdk-utils';
import { TrainJoystickStatus } from '../../proto/generated/types';

import { assertOrThrowInvalidResult, OperationHelper } from '../../utils';
import { TrainJoystickEventHandler } from './types';

export * from './types';

export const trainJoystick = async (
  sdk: ISDK,
  onEvent?: TrainJoystickEventHandler,
): Promise<void> => {
  const helper = new OperationHelper(sdk, 'trainJoystick', 'trainJoystick');

  const { onStatus, forceStatusUpdate } = createStatusListener(
    TrainJoystickStatus,
    onEvent,
  );

  await helper.sendQuery({ initiate: {} });
  const result = await helper.waitForResult(onStatus);
  assertOrThrowInvalidResult(result.result);

  forceStatusUpdate(TrainJoystickStatus.TRAIN_JOYSTICK_CENTER);
};
