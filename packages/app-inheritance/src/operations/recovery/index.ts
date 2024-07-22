import { ISDK } from '@cypherock/sdk-core';
import { createLoggerWithPrefix } from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import { IPlainData } from '../../proto/generated/types';
import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';

const logger = createLoggerWithPrefix(rootLogger, 'RecoveryRequest');

export const getRecovery = async (sdk: ISDK): Promise<IPlainData> => {
  logger.info('Started');

  await sdk.checkAppCompatibility(APP_VERSION);

  const helper = new OperationHelper({
    sdk,
    queryKey: 'recovery',
    resultKey: 'recovery',
  });
  // TODO: add vars to parameters
  await helper.sendQuery({
    encryptedDataPacket: {
      packet: new Uint8Array([65, 65]),
    },
  });

  var result: any;

  for (var i = 0; i < 5; i++) {
    result.plainData[i] = await helper.waitForResult();
    logger.verbose('RecoveryResponse', result.plainData[i]);
    console.log(JSON.stringify(result.plainData[i]));
    assertOrThrowInvalidResult(result.plainData[i].message);
  }

  logger.info('Completed');
  return result.plainData;
};
