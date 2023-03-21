import { ISDK } from '@cypherock/sdk-core';
import {
  ITrainUserResponse,
  TrainUserStatus,
} from '../../proto/generated/types';

import { createStatusListener, OperationHelper } from '../../utils';
import { TrainUserEventHandler } from './types';

export * from './types';

export const trainUser = async (
  sdk: ISDK,
  onEvent?: TrainUserEventHandler,
): Promise<ITrainUserResponse> => {
  const helper = new OperationHelper(sdk, 'trainUser', 'trainUser');

  const { onStatus, forceStatusUpdate } = createStatusListener(
    TrainUserStatus,
    onEvent,
  );

  await helper.sendQuery({ initiate: {} });
  const result = helper.waitForResult(onStatus);

  forceStatusUpdate(TrainUserStatus.USER_TRAINING_CARD_TAP);

  return result;
};
