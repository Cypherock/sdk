import { ISDK } from '@cypherock/sdk-core';
import { assertOrThrowInvalidResult, OperationHelper } from '../../utils';
import { ISignMessageParams, ISignMessageResult } from './types';

export * from './types';

export const signMessage = async (
  sdk: ISDK,
  params: ISignMessageParams,
): Promise<ISignMessageResult> => {
  const helper = new OperationHelper(sdk, 'signMessage', 'signMessage');

  await helper.sendQuery({
    initiate: { walletId: params.walletId },
  });

  const { initiate } = await helper.waitForResult();
  assertOrThrowInvalidResult(initiate?.pubKey);

  await helper.sendQuery({
    approveMessage: {
      msg: params.msg,
      groupId: params.groupID,
    },
  });

  const { approveMessage } = await helper.waitForResult();
  assertOrThrowInvalidResult(approveMessage?.approved);

  await params.onMessageApproval();

  return {
    success: true,
  };
};
