import { ISDK } from '@cypherock/sdk-core';
// import {
//   assert,
//   // createLoggerWithPrefix,
// } from '@cypherock/sdk-utils';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  // logger as rootLogger,
} from '../../utils';
import { IExitApplicationResult } from './types';

export * from './types';

// const logger = createLoggerWithPrefix(rootLogger, 'GetPublicKey');

export const exitApplication = async (
  sdk: ISDK,
): Promise<IExitApplicationResult> => {
  const helper = new OperationHelper(sdk, 'exitApplication', 'exitApplication');

  await helper.sendQuery({
    initiate: {},
  });

  const result = await helper.waitForResult();
  assertOrThrowInvalidResult(result.result);

  return {
    exited: result.result.exited,
  };
};
