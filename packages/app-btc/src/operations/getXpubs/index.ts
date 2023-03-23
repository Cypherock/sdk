import { ISDK } from '@cypherock/sdk-core';
import { createStatusListener, assert } from '@cypherock/sdk-utils';
import {
  GetXpubsStatus,
  IGetXpubsResultResponse,
} from '../../proto/generated/types';
import { assertOrThrowInvalidResult, OperationHelper } from '../../utils';
import { IGetXpubsParams } from './types';

export * from './types';

export const getXpubs = async (
  sdk: ISDK,
  params: IGetXpubsParams,
): Promise<IGetXpubsResultResponse> => {
  assert(params, 'Params should be defined');
  assert(params.derivationPaths, 'DerivationPaths should be defined');
  assert(params.walletId, 'WalletId should be defined');
  assert(
    params.derivationPaths.length > 0,
    'DerivationPaths should not be empty',
  );
  assert(
    params.derivationPaths.reduce(
      (acc, path) => acc && path.path.length === 3,
      true,
    ),
    'DerivationPaths should of depth 3',
  );

  const helper = new OperationHelper(sdk, 'getXpubs', 'getXpubs');

  const { onStatus, forceStatusUpdate } = createStatusListener(
    GetXpubsStatus,
    params.onEvent,
  );

  await helper.sendQuery({
    initiate: {
      walletId: params.walletId,
      derivationPaths: params.derivationPaths,
    },
  });

  const result = await helper.waitForResult(onStatus);
  assertOrThrowInvalidResult(result.result);

  forceStatusUpdate(GetXpubsStatus.GET_XPUBS_STATUS_CARD);

  return result.result;
};
