import { ISDK } from '@cypherock/sdk-core';
import { ITrainCardResult } from '../../proto/generated/types';

import { assertOrThrowInvalidResult, OperationHelper } from '../../utils';

export const trainCard = async (sdk: ISDK): Promise<ITrainCardResult> => {
  const helper = new OperationHelper(sdk, 'trainCard', 'trainCard');

  await helper.sendQuery({ initiate: {} });
  const result = await helper.waitForResult();
  assertOrThrowInvalidResult(result.result);

  return result.result;
};
