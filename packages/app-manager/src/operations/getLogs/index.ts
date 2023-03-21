import { ISDK } from '@cypherock/sdk-core';
import {
  GetLogsStatus,
  IGetLogsErrorResponse,
} from '../../proto/generated/types';

import {
  assertOrThrowInvalidResult,
  createStatusListener,
  OnStatus,
  OperationHelper,
} from '../../utils';
import { GetLogsError, GetLogsErrorType, GetLogsEventHandler } from './types';

export * from './types';

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
  const helper = new OperationHelper(sdk, 'getLogs', 'getLogs');

  const { onStatus, forceStatusUpdate } = createStatusListener(
    GetLogsStatus,
    onEvent,
  );

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

  return allLogs.join('');
};
