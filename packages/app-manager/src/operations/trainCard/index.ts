import { ISDK } from '@cypherock/sdk-core';
import {
  createLoggerWithPrefix,
  createStatusListener,
} from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import { ITrainCardResult, TrainCardStatus } from '../../proto/generated/types';

import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import { ITrainCardParams } from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'TrainCard');

export const trainCard = async (
  sdk: ISDK,
  params: ITrainCardParams,
): Promise<ITrainCardResult> => {
  logger.info('Started');

  await sdk.checkAppCompatibility(APP_VERSION);

  const helper = new OperationHelper(sdk, 'trainCard', 'trainCard');

  const { onStatus, forceStatusUpdate } = createStatusListener({
    enums: TrainCardStatus,
    onEvent: params.onEvent,
    logger,
  });

  await helper.sendQuery({ initiate: {} });
  const result = await helper.waitForResult(onStatus);
  logger.verbose('TrainCardResponse', { result });
  assertOrThrowInvalidResult(result.result);

  forceStatusUpdate(TrainCardStatus.TRAIN_CARD_STATUS_CARD_TAPPED);

  if (result.result.walletList.length > 0) {
    const isSelfCreated = await params.onWallets(result.result);

    await helper.sendQuery({ walletVerify: { selfCreated: isSelfCreated } });

    const flowComplete = await helper.waitForResult(onStatus);
    logger.verbose('TrainCardResponse', { result });
    assertOrThrowInvalidResult(flowComplete.flowComplete);
  }

  logger.info('Completed');
  return result.result;
};
