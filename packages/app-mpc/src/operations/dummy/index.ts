import { ISDK } from '@cypherock/sdk-core';
import { assertOrThrowInvalidResult, OperationHelper } from '../../utils';
import { IDummyParams, IDummyResult } from './types';

export * from './types';

export const dummy = async (
  sdk: ISDK,
  params: IDummyParams,
): Promise<IDummyResult> => {
  const helper = new OperationHelper(sdk, 'dummy', 'dummy');

  await helper.sendQuery({
    initiate: {},
  });

  const { firstResponse } = await helper.waitForResult();
  assertOrThrowInvalidResult(firstResponse?.num);

  params.onFirstResponse?.(firstResponse.num);

  await helper.sendQuery({
    next: {},
  });

  const { secondResponse } = await helper.waitForResult();

  return {
    condition: secondResponse?.condition ?? false,
  };
};
