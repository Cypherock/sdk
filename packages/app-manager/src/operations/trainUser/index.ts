import { ISDK } from '@cypherock/sdk-core';
import {
  ITrainUserResultResponse,
  TrainUserStatus,
} from '../../proto/generated/types';

import {
  assertOrThrowInvalidResult,
  createStatusListener,
  OperationHelper,
} from '../../utils';
import { ITrainUserParams } from './types';

export * from './types';

export const trainUser = async (
  sdk: ISDK,
  params?: ITrainUserParams,
): Promise<ITrainUserResultResponse> => {
  const { onEvent, jumpToState } = params ?? {};

  const helper = new OperationHelper(sdk, 'trainUser', 'trainUser');

  const { onStatus, forceStatusUpdate } = createStatusListener(
    TrainUserStatus,
    onEvent,
  );

  await helper.sendQuery({ initiate: { jumpToState } });
  const result = await helper.waitForResult(onStatus);
  assertOrThrowInvalidResult(result.result);

  forceStatusUpdate(TrainUserStatus.USER_TRAINING_CARD_TAP);

  return result.result;
};
