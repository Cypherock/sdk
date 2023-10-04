import { ISDK } from '@cypherock/sdk-core';
import {
  createLoggerWithPrefix,
  createStatusListener,
  OnStatus,
} from '@cypherock/sdk-utils';
import { APP_VERSION } from '../../constants/appId';
import {
  GetLogsStatus,
  IGetLogsErrorResponse,
} from '../../proto/generated/types';

import {
  assertOrThrowInvalidResult,
  OperationHelper,
  logger as rootLogger,
} from '../../utils';
import { GetLogsError, GetLogsErrorType, GetLogsEventHandler } from './types';

export * from './types';

const logger = createLoggerWithPrefix(rootLogger, 'GetLogs');

const parseGetLogsError = (error?: IGetLogsErrorResponse) => {
  if (error === undefined) return;

  type CoreErrorKey = keyof IGetLogsErrorResponse;
  const keys = Object.keys(error) as CoreErrorKey[];

  const errorTypesMap: Record<CoreErrorKey, GetLogsErrorType> = {
    logsDisabled: GetLogsErrorType.LOGS_DISABLED,
  };

  for (const key of keys) {
    if (error[key]) {
      throw new GetLogsError(errorTypesMap[key]);
    }
  }
};

async function fetchLogsData(
  helper: OperationHelper<'getLogs', 'getLogs'>,
  onStatus: OnStatus,
) {
  const result = await helper.waitForResult(onStatus);

  parseGetLogsError(result.error);
  assertOrThrowInvalidResult(result.logs);

  return result.logs;
}

export const getLogs = async (
  sdk: ISDK,
  onEvent?: GetLogsEventHandler,
): Promise<string> => {
  logger.info('Started');
  const helper = new OperationHelper(sdk, 'getLogs', 'getLogs');

  await sdk.checkAppCompatibility(APP_VERSION);

  const { onStatus, forceStatusUpdate } = createStatusListener({
    enums: GetLogsStatus,
    onEvent,
    logger,
  });

  const decoder = new TextDecoder('ascii');

  const allLogs: string[] = [];
  let isConfirmed = false;
  let hasMore = false;

  await helper.sendQuery({ initiate: {} });

  do {
    const result = await fetchLogsData(helper, onStatus);

    if (!isConfirmed)
      forceStatusUpdate(GetLogsStatus.GET_LOGS_STATUS_USER_CONFIRMED);

    isConfirmed = true;
    hasMore = result.hasMore;

    allLogs.push(decoder.decode(result.data));

    if (hasMore) {
      await helper.sendQuery({ fetchNext: {} });
    }
  } while (hasMore);

  logger.info('Completed');
  return allLogs.join('');
};
