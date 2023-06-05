import { ISDK } from '@cypherock/sdk-core';
import { createLoggerWithPrefix } from '@cypherock/sdk-utils';
import { ITrainCardResult } from '../../proto/generated/types';

import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';

const logger = createLoggerWithPrefix(rootLogger, 'TrainCard');

export const trainCard = async (sdk: ISDK): Promise<ITrainCardResult> => {
  logger.info('Started');
  const helper = new OperationHelper(sdk, 'trainCard', 'trainCard');

  await helper.sendQuery({ initiate: {} });
  const result = await helper.waitForResult();
  logger.verbose('TrainCardResponse', { result });
  assertOrThrowInvalidResult(result.result);

  logger.info('Completed');
  return result.result;
};
