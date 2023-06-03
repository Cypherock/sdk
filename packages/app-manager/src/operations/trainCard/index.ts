import { ISDK } from '@cypherock/sdk-core';
import { createStatusListener } from '@cypherock/sdk-utils';

import { ITrainCardResult, TrainCardStatus } from '../../proto/generated/types';
import { assertOrThrowInvalidResult, OperationHelper } from '../../utils';
import { ITrainCardParams } from './types';

export * from './types';

export const trainCard = async (
  sdk: ISDK,
  params: ITrainCardParams,
): Promise<ITrainCardResult> => {
  const helper = new OperationHelper(sdk, 'trainCard', 'trainCard');

  const { onStatus, forceStatusUpdate } = createStatusListener(
    TrainCardStatus,
    params.onEvent,
  );

  await helper.sendQuery({ initiate: {} });
  const result = await helper.waitForResult(onStatus);
  assertOrThrowInvalidResult(result.result);

  forceStatusUpdate(TrainCardStatus.TRAIN_CARD_STATUS_CARD_TAPPED);

  if (result.result.walletList.length > 0) {
    const isSelfCreated = await params.onWallets(result.result);

    await helper.sendQuery({ walletVerify: { selfCreated: isSelfCreated } });

    const flowComplete = await helper.waitForResult(onStatus);
    assertOrThrowInvalidResult(flowComplete.flowComplete);
  }

  return result.result;
};
