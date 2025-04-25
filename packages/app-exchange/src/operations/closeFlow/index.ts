import { ISDK } from '@cypherock/sdk-core';
import { createLoggerWithPrefix } from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import { OperationHelper, logger as rootLogger } from '../../utils';

const logger = createLoggerWithPrefix(rootLogger, 'CloseFlow');

export const closeFlow = async (sdk: ISDK): Promise<void> => {
  logger.info('Started');

  await sdk.checkAppCompatibility(APP_VERSION);

  const helper = new OperationHelper({
    sdk,
    queryKey: 'closeFlow',
    resultKey: 'closeFlow',
  });

  await helper.sendQuery({
    close: {},
  });

  await helper.waitForResult();

  logger.info('Completed');
};
